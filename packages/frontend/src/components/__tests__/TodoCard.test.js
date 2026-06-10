import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2027-12-25', // Future date to avoid overdue styling
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December \d+, 2027/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  // Overdue functionality tests (T010-T016)
  describe('Overdue functionality', () => {
    beforeEach(() => {
      // Mock current date to June 10, 2026 for consistent testing
      jest.useFakeTimers();
      const mockDate = new Date('2026-06-10');
      mockDate.setHours(0, 0, 0, 0);
      jest.setSystemTime(mockDate);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should render overdue styling for incomplete todo with past due date (T010)', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2026-06-01', // Past due date
        completed: 0
      };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('todo-card--overdue');
    });

    it('should render normal styling for todo due today (T011)', () => {
      const todayTodo = {
        ...mockTodo,
        dueDate: '2026-06-10', // Today
        completed: 0
      };
      const { container } = render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
    });

    it('should render normal styling for future due date (T012)', () => {
      const futureTodo = {
        ...mockTodo,
        dueDate: '2026-06-20', // Future
        completed: 0
      };
      const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
    });

    it('should render success styling (not overdue) for completed todo with past due date (T013)', () => {
      const completedOverdueTodo = {
        ...mockTodo,
        dueDate: '2026-06-01', // Past due date
        completed: 1 // But completed
      };
      const { container } = render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
      expect(card).toHaveClass('completed');
    });

    it('should render normal styling for todo without due date (T014)', () => {
      const noDateTodo = {
        ...mockTodo,
        dueDate: null,
        completed: 0
      };
      const { container } = render(<TodoCard todo={noDateTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
    });

    it('should preserve overdue styling on hover/focus (T015)', () => {
      // Note: CSS hover/focus states are tested via visual/manual testing
      // This test verifies the CSS class is present, which enables hover/focus styles
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2026-06-01',
        completed: 0
      };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('todo-card--overdue');
      // CSS will handle hover/focus pseudo-classes on top of this base class
    });

    it('should have ARIA label "Overdue: {title}" when todo is overdue (T016)', () => {
      const overdueTodo = {
        ...mockTodo,
        title: 'Buy groceries',
        dueDate: '2026-06-01',
        completed: 0
      };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).toHaveAttribute('aria-label', 'Overdue: Buy groceries');
    });

    it('should not have overdue ARIA label for normal todo', () => {
      const normalTodo = {
        ...mockTodo,
        title: 'Normal task',
        dueDate: '2026-06-20',
        completed: 0
      };
      const { container } = render(<TodoCard todo={normalTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveAttribute('aria-label');
    });

    // Relative time display tests (T031-T032)
    it('should display relative time for overdue incomplete todos (T031)', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: '2026-06-05', // 5 days ago
        completed: 0
      };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      // Should show relative time in the due date display
      const dueDateText = screen.getByText(/Due:/);
      expect(dueDateText.textContent).toMatch(/ago|yesterday/i);
    });

    it('should NOT display relative time for completed todos (T032)', () => {
      const completedOverdueTodo = {
        ...mockTodo,
        dueDate: '2026-06-05', // Past due date
        completed: 1 // But completed
      };
      render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      // Should show normal date format, not relative time
      const dueDateText = screen.getByText(/Due:/);
      expect(dueDateText.textContent).not.toMatch(/ago|yesterday/i);
    });
  });
});
