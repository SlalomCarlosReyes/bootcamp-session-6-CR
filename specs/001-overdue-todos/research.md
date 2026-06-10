# Research: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Date**: 2026-06-10  
**Phase**: 0 (Outline & Research)

## Research Tasks

### 1. JavaScript Date Comparison Best Practices

**Question**: What's the most reliable way to compare dates in JavaScript for determining if a date is in the past?

**Findings**:
- **Decision**: Use `Date` object comparison with `<` operator after normalizing to start of day
- **Rationale**: 
  - Native `Date` object is well-supported across all browsers
  - Comparing date objects directly works reliably: `new Date(pastDate) < new Date()`
  - To ignore time component: normalize both dates to midnight using `setHours(0,0,0,0)`
  - No external libraries needed (aligns with Simplicity principle)
- **Alternatives Considered**:
  - Moment.js: Deprecated and adds 67KB bundle size
  - date-fns: Modern but adds dependency; native Date sufficient for this use case
  - Unix timestamp comparison: Works but less readable than Date objects
- **Implementation Pattern**:
  ```javascript
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };
  ```

### 2. Relative Time Formatting in React

**Question**: How to format relative time displays ("3 days ago", "yesterday") without external libraries?

**Findings**:
- **Decision**: Implement simple relative time formatter with day/week/month grouping
- **Rationale**:
  - Intl.RelativeTimeFormat API is well-supported (94% browser coverage)
  - Provides localized relative time strings automatically
  - No dependencies, part of ECMAScript Internationalization API
- **Alternatives Considered**:
  - Manual string concatenation: More control but requires handling pluralization
  - Intl.RelativeTimeFormat: Best balance of simplicity and internationalization support
  - timeago.js library: Unnecessary dependency for simple relative time
- **Implementation Pattern**:
  ```javascript
  const getRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDiff = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (Math.abs(daysDiff) < 7) {
      return rtf.format(daysDiff, 'day'); // "yesterday", "2 days ago"
    } else if (Math.abs(daysDiff) < 28) {
      return rtf.format(Math.floor(daysDiff / 7), 'week'); // "1 week ago"
    } else {
      return rtf.format(Math.floor(daysDiff / 30), 'month'); // "2 months ago"
    }
  };
  ```

### 3. ARIA Labels for Dynamic Content

**Question**: What's the best way to add ARIA labels to React components for screen reader accessibility?

**Findings**:
- **Decision**: Use `aria-label` attribute on todo card container div
- **Rationale**:
  - `aria-label` provides accessible name without changing visual presentation
  - Combines status and content in one label: "Overdue: Buy groceries"
  - React fully supports ARIA attributes as standard props
  - Follows WAI-ARIA best practices for labeling interactive elements
- **Alternatives Considered**:
  - `aria-describedby`: More complex, requires separate element for description
  - Visually hidden text: Works but adds DOM elements unnecessarily
  - `title` attribute: Not read by all screen readers, insufficient for accessibility
- **Implementation Pattern**:
  ```javascript
  <div 
    className={`todo-card ${isOverdue ? 'overdue' : ''}`}
    aria-label={isOverdue ? `Overdue: ${todo.title}` : todo.title}
  >
    {/* todo content */}
  </div>
  ```

### 4. CSS Styling Patterns for Conditional States

**Question**: How to apply conditional styling (overdue danger colors) while preserving hover/focus states?

**Findings**:
- **Decision**: Use CSS class modifier pattern with layered specificity
- **Rationale**:
  - BEM-style modifier classes (`.todo-card--overdue`) keep styles organized
  - Base styles apply to all cards, modifiers override specific properties
  - Hover/focus pseudo-classes apply after base/modifier, maintaining interactivity
  - Existing theme.css already uses this pattern
- **Alternatives Considered**:
  - Inline styles: Less maintainable, harder to override with hover/focus
  - CSS-in-JS: Adds complexity/dependencies; project uses plain CSS
  - CSS variables: Good for theming but overkill for binary state (overdue/not)
- **Implementation Pattern**:
  ```css
  /* Base card styling */
  .todo-card {
    border: 1px solid var(--border-color);
    background: var(--surface-color);
  }
  
  /* Overdue modifier */
  .todo-card--overdue {
    border-color: var(--danger-color);
    color: var(--danger-color);
  }
  
  /* Hover applies regardless of overdue state */
  .todo-card:hover {
    background: var(--hover-bg);
  }
  ```

### 5. Graceful Error Handling for Invalid Dates

**Question**: How to handle invalid or malformed date values without showing errors to users?

**Findings**:
- **Decision**: Use `isNaN(new Date(value))` check; treat invalid as no due date
- **Rationale**:
  - Invalid dates become `Invalid Date` object; `isNaN()` detects this reliably
  - Failing silently (treat as no due date) prevents user confusion
  - Aligns with Simplicity principle: no error messages or validation UI needed
  - Backend should validate dates, but frontend must handle gracefully if issues slip through
- **Alternatives Considered**:
  - Display "Invalid date" message: Confuses users, doesn't help them fix the issue
  - Try to repair dates: Complex regex/parsing logic, error-prone
  - Throw errors/log to console: Doesn't improve UX, just fills console
- **Implementation Pattern**:
  ```javascript
  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };
  
  const isOverdue = (dueDate) => {
    if (!isValidDate(dueDate)) return false; // Treat invalid as no due date
    // ... rest of comparison logic
  };
  ```

## Summary

All research questions resolved with pragmatic, simple solutions that avoid external dependencies and align with the project's constitution principles:

- **Simplicity**: Native JavaScript Date API, Intl.RelativeTimeFormat, standard ARIA attributes
- **No Dependencies**: All solutions use browser-native APIs
- **Test-Friendly**: Pure functions for date comparison and formatting are easy to unit test
- **Maintainable**: Standard patterns (BEM CSS, ARIA labels) familiar to React developers
- **Accessible**: ARIA labels ensure screen reader support from the start

**Ready for Phase 1**: Design & Contracts
