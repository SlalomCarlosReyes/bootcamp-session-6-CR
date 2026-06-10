/**
 * Date utility functions for todo date handling
 * Pure functions with no side effects
 */

/**
 * Check if a date string represents a valid date
 * @param {string} dateStr - ISO 8601 date string (YYYY-MM-DD)
 * @returns {boolean} - True if date is valid, false otherwise
 */
export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  
  // Check for ISO 8601 format (YYYY-MM-DD)
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(dateStr)) return false;
  
  // Verify the date is actually parseable
  const date = new Date(dateStr + 'T00:00:00'); // Force local time interpretation
  return !isNaN(date.getTime());
};

/**
 * Determine if a todo is overdue
 * @param {Object} todo - Todo object with { dueDate, completed }
 * @returns {boolean} - True if todo is overdue, false otherwise
 */
export const isOverdue = (todo) => {
  // Completed todos are never shown as overdue
  if (todo.completed) return false;
  
  // No due date or invalid date means not overdue
  if (!todo.dueDate || !isValidDate(todo.dueDate)) return false;
  
  // Normalize both dates to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(todo.dueDate + 'T00:00:00'); // Force local time
  dueDate.setHours(0, 0, 0, 0);
  
  // Overdue if due date is before today
  return dueDate < today;
};

/**
 * Get relative time text for a date
 * @param {string} dueDate - ISO 8601 date string
 * @returns {string} - Relative time text (e.g., "yesterday", "3 days ago")
 */
export const getRelativeTimeText = (dueDate) => {
  // Return empty string for invalid or null dates
  if (!dueDate || !isValidDate(dueDate)) return '';
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate + 'T00:00:00');
  due.setHours(0, 0, 0, 0);
  
  // Only show relative time for past dates
  if (due >= now) return '';
  
  // Calculate days difference
  const daysDiff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  
  // Use Intl.RelativeTimeFormat for localized relative time
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  // Group by time unit (T034)
  if (daysDiff < 7) {
    // Days (1-6 days ago)
    return rtf.format(-daysDiff, 'day');
  } else if (daysDiff < 28) {
    // Weeks (7-27 days)
    const weeks = Math.floor(daysDiff / 7);
    return rtf.format(-weeks, 'week');
  } else {
    // Months (28+ days)
    const months = Math.floor(daysDiff / 30);
    return rtf.format(-months, 'month');
  }
};
