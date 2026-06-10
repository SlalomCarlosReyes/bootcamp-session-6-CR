# Contracts: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Date**: 2026-06-10  
**Phase**: 1 (Design & Contracts)

## Contract Changes

**Status**: ✅ **NO NEW CONTRACTS**

This feature does NOT introduce new API endpoints, modify existing endpoints, or change data contracts. All changes are frontend-only (React component rendering logic and CSS styling).

## Existing Contracts (Unchanged)

The feature relies on the existing TODO API contract, which remains unchanged:

### GET /todos

**Response** (unchanged):
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "dueDate": "2026-06-15",
    "completed": false
  }
]
```

**Fields Used by Overdue Feature**:
- `dueDate`: ISO 8601 date string (YYYY-MM-DD) - compared against current date
- `completed`: Boolean - overdue styling only applies to incomplete todos
- `title`: String - included in ARIA label for screen readers

**No Changes Required**: Backend continues returning todos in the same format. Frontend adds client-side computation of `isOverdue` status.

### Other Endpoints

- `POST /todos` - No changes
- `PUT /todos/:id` - No changes
- `DELETE /todos/:id` - No changes

All CRUD operations remain identical. The overdue feature is purely a display enhancement.

## Frontend Component Contracts

While not external API contracts, the following component interfaces are relevant:

### TodoCard Component (Modified)

**Props** (unchanged):
```typescript
{
  todo: {
    id: number;
    title: string;
    dueDate: string | null;
    completed: boolean;
  };
  onUpdate: (id: number, updates: object) => void;
  onDelete: (id: number) => void;
}
```

**Additions** (internal to component):
- Computes `isOverdue(todo)` → boolean
- Computes `relativeTimeText(todo)` → string (P2 feature)
- Applies conditional CSS class based on `isOverdue`
- Sets conditional `aria-label` for accessibility

**No prop changes**: Component interface remains backward compatible.

## Rationale

Overdue indication is a **presentation concern**, not a data or business logic concern:
- Backend doesn't need to know if a todo is "overdue" - that's time-dependent and user-facing
- Date comparison happens on the client using browser's local time (per user requirements)
- Server continues serving raw data; client handles display logic

This separation follows **Single Responsibility Principle** and keeps backend stateless regarding time-sensitive display states.

## Summary

- ✅ No API contracts modified
- ✅ No new endpoints added
- ✅ Backend remains unchanged
- ✅ Frontend component interface remains backward compatible
- ✅ Feature is fully client-side rendering enhancement
