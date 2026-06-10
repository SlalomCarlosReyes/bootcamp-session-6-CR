# Data Model: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Date**: 2026-06-10  
**Phase**: 1 (Design & Contracts)

## Overview

This feature does NOT introduce new entities or modify the existing database schema. It enhances the display and client-side processing of existing Todo entities. All overdue detection and styling logic operates on the frontend using the existing `dueDate` field.

## Existing Entity: Todo

**Source**: Backend `todoService.js` and SQLite database

### Fields

| Field | Type | Required | Description | Overdue Feature Usage |
|-------|------|----------|-------------|----------------------|
| `id` | Integer | Yes | Unique identifier | Not used for overdue logic |
| `title` | String (max 255) | Yes | Todo description | Displayed in ARIA label when overdue |
| `dueDate` | ISO 8601 String | No | Due date (YYYY-MM-DD) | **Core field**: Compared against today's date |
| `completed` | Boolean | Yes | Completion status | **Filter**: Overdue styling only for incomplete todos |

### Validation Rules

**Existing** (enforced by backend):
- `title`: Required, max 255 characters
- `dueDate`: Optional, must be valid ISO 8601 date string if provided
- `completed`: Required, defaults to `false`

**Frontend Additions** (for overdue feature):
- `dueDate` validity check: `!isNaN(new Date(dueDate).getTime())`
- Invalid dates treated as "no due date" (graceful degradation per FR-010)

### State Transitions

```
┌─────────────────────────────────────────────┐
│ Todo Created                                 │
│ - completed: false                           │
│ - dueDate: null OR future date              │
│ → Display: Normal styling                   │
└─────────────────────────────────────────────┘
                │
                ├─ Time passes (dueDate < today)
                ↓
┌─────────────────────────────────────────────┐
│ Todo Becomes Overdue                         │
│ - completed: false                           │
│ - dueDate: past date                        │
│ → Display: Danger color styling             │
│ → ARIA: "Overdue: {title}"                  │
└─────────────────────────────────────────────┘
                │
                ├─ User marks complete
                ↓
┌─────────────────────────────────────────────┐
│ Todo Completed (was overdue)                 │
│ - completed: true                            │
│ - dueDate: past date (unchanged)            │
│ → Display: Success styling (green)          │
│ → Overdue styling NOT applied               │
└─────────────────────────────────────────────┘
```

## Client-Side Derived Properties

These properties are computed on the frontend during render; they are NOT stored in the database:

### `isOverdue` (computed)

**Definition**: A todo is overdue if:
1. `completed === false` AND
2. `dueDate` is a valid date AND
3. `dueDate < today` (both dates normalized to midnight)

**Computation**:
```javascript
const isOverdue = (todo) => {
  if (todo.completed) return false;
  if (!todo.dueDate || !isValidDate(todo.dueDate)) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
};
```

**Usage**: Determines CSS class (`.todo-card--overdue`) and ARIA label prefix

### `relativeTimeText` (computed, P2 feature)

**Definition**: Human-readable relative time string for overdue todos

**Computation**: Uses `Intl.RelativeTimeFormat` API:
- 1 day ago → "yesterday"
- 2-6 days → "X days ago"
- 7-27 days → "X weeks ago"
- 28+ days → "X months ago"

**Usage**: Displayed as "Due {relativeTimeText}" for overdue incomplete todos only

## Relationships

No relationships change. The Todo entity remains independent with no foreign keys.

## Database Schema Impact

**Schema Changes**: ✅ **NONE**

The feature operates entirely on existing data. No migrations, no ALTER TABLE statements required.

## Data Flow

```
┌──────────────┐
│   SQLite     │ Todo with dueDate
│   Database   │ stored as ISO 8601
└──────┬───────┘
       │ HTTP GET /todos
       ↓
┌──────────────┐
│   Backend    │ Returns todos as JSON
│   Express    │ (no date processing)
└──────┬───────┘
       │ JSON response
       ↓
┌──────────────┐
│   Frontend   │ axios.get('/todos')
│   Service    │ → Plain JS objects
└──────┬───────┘
       │ Array<Todo>
       ↓
┌──────────────┐
│  TodoList    │ Maps over todos
│  Component   │ → Passes to TodoCard
└──────┬───────┘
       │ Single Todo
       ↓
┌──────────────┐
│  TodoCard    │ ← OVERDUE LOGIC HERE
│  Component   │ 1. Compute isOverdue(todo)
└──────────────┘ 2. Compute relativeTimeText(todo)
                  3. Apply CSS class conditionally
                  4. Set aria-label conditionally
                  5. Render with styling
```

## Testing Data Requirements

### Test Fixtures Needed

1. **Overdue incomplete todo** (past due date, completed=false)
2. **Today's incomplete todo** (dueDate=today, should NOT be overdue)
3. **Future incomplete todo** (future due date, should NOT be overdue)
4. **Overdue completed todo** (past due date, completed=true, should NOT show overdue styling)
5. **No due date todo** (dueDate=null, should NOT be overdue)
6. **Invalid date todo** (dueDate="invalid", should NOT be overdue, graceful degradation)

Example fixture:
```javascript
const testTodos = [
  { id: 1, title: "Overdue task", dueDate: "2026-06-01", completed: false }, // Overdue
  { id: 2, title: "Today's task", dueDate: "2026-06-10", completed: false }, // NOT overdue
  { id: 3, title: "Future task", dueDate: "2026-06-20", completed: false }, // NOT overdue
  { id: 4, title: "Completed overdue", dueDate: "2026-06-01", completed: true }, // NOT styled overdue
  { id: 5, title: "No due date", dueDate: null, completed: false }, // NOT overdue
  { id: 6, title: "Bad date", dueDate: "not-a-date", completed: false }, // NOT overdue (graceful)
];
```

## Summary

- ✅ **No schema changes**: Feature uses existing Todo entity as-is
- ✅ **Client-side only**: All overdue detection happens in React components
- ✅ **Pure functions**: `isOverdue()` and `relativeTimeText()` are testable pure functions
- ✅ **Backward compatible**: Existing todos work without migration
- ✅ **Graceful degradation**: Invalid dates treated as "no due date"
