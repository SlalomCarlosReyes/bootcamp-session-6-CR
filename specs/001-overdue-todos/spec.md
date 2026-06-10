# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date."

## Clarifications

### Session 2026-06-10

- Q: Should the feature include accessibility support for users with visual impairments or screen reader users? → A: Basic ARIA labels only (e.g., aria-label="Overdue: Task title")
- Q: What format should be used for relative time displays (e.g., "Due 3 days ago") and when should it transition between time units? → A: Standard relative format with weekly grouping (e.g., "yesterday", "2 days ago", "1 week ago", "3 months ago")
- Q: How should overdue styling interact with other UI states like hover, focus, or selection? → A: Overdue styling as base layer (red text/border remains, standard hover/focus effects apply on top)
- Q: When should date comparisons be performed to determine overdue status, and should results be cached? → A: Calculate on each render (simple, always correct, negligible performance impact for typical todo counts)
- Q: What should happen if a todo has an invalid or malformed date value? → A: Treat as no due date (invalid/null dates display with normal styling, no overdue indication)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

Users with incomplete todos that have passed their due date need immediate visual feedback to identify which tasks require urgent attention. The system displays overdue todos with distinctive visual styling that makes them instantly recognizable without requiring the user to read or compare dates.

**Why this priority**: This is the core value proposition of the feature. Without visual distinction, users cannot quickly identify overdue items, defeating the entire purpose of the feature. This is the MVP.

**Independent Test**: Can be fully tested by creating a todo with a past due date and verifying it displays with overdue styling. Delivers immediate value by helping users prioritize work.

**Acceptance Scenarios**:

1. **Given** a todo item with a due date in the past and completion status is incomplete, **When** the user views the todo list, **Then** the todo item is displayed with danger color styling (red text/border) to indicate it is overdue
2. **Given** a todo item with a due date of today and completion status is incomplete, **When** the user views the todo list, **Then** the todo item is displayed with normal styling (not marked as overdue)
3. **Given** a todo item with a due date in the future and completion status is incomplete, **When** the user views the todo list, **Then** the todo item is displayed with normal styling (not marked as overdue)
4. **Given** a todo item with a due date in the past but completion status is complete, **When** the user views the todo list, **Then** the todo item is displayed with success styling (green) and not marked as overdue
5. **Given** a todo item with no due date, **When** the user views the todo list, **Then** the todo item is displayed with normal styling (no overdue indication)
6. **Given** an overdue todo item, **When** the user hovers over or focuses on the item, **Then** the danger color styling remains visible with standard hover/focus effects applied on top

---

### User Story 2 - Due Date Display Enhancement (Priority: P2)

Users viewing their todo list need to quickly understand not just that a todo is overdue, but also how far past due it is. The system displays the due date with contextual information (e.g., "3 days ago") for overdue items to help users prioritize among multiple overdue tasks.

**Why this priority**: While visual styling (P1) helps identify overdue items, contextual date information helps users understand urgency and prioritize among multiple overdue tasks. This enhances the P1 feature but isn't essential for basic functionality.

**Independent Test**: Can be tested by creating todos with various past due dates and verifying the relative time display (e.g., "2 days ago", "1 week ago"). Adds value by helping users understand urgency levels.

**Acceptance Scenarios**:

1. **Given** a todo with a due date 1 day in the past, **When** the user views the todo list, **Then** the due date displays as "Due yesterday"
2. **Given** a todo with a due date 5 days in the past, **When** the user views the todo list, **Then** the due date displays as "Due 5 days ago"
3. **Given** a todo with a due date 14 days in the past, **When** the user views the todo list, **Then** the due date displays as "Due 2 weeks ago"
4. **Given** a todo with a due date 90 days in the past, **When** the user views the todo list, **Then** the due date displays as "Due 3 months ago"
5. **Given** a todo with a due date in the future, **When** the user views the todo list, **Then** the due date displays as "Due in 3 days" or the actual date
6. **Given** a completed todo that was overdue, **When** the user views the todo list, **Then** the due date displays normally without relative time text

---

### Edge Cases

- What happens when a todo becomes overdue while the user is viewing the list (date changes to next day)?
  - The overdue status updates on next page load/refresh; real-time update is not required
- How does the system handle todos with due dates but no time component?
  - Compare dates only (ignore time); a todo due "today" is not overdue until tomorrow
- What happens if the user's system date/time is incorrect?
  - System uses the user's local system date for comparison; incorrect system time will affect overdue detection
- How are completed overdue todos displayed?
  - Completed todos use success styling (green) regardless of due date; overdue styling only applies to incomplete todos
- What happens with todos that have due dates far in the past (e.g., years ago)?
  - Display relative time up to a reasonable limit (e.g., "Due 365+ days ago"), or show the actual date for very old items
- What happens if a todo has an invalid or malformed date value?
  - System treats invalid or null dates as "no due date" and displays the todo with normal styling (no overdue indication); no error message shown to user

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compare each incomplete todo's due date against the current date to determine overdue status
- **FR-002**: System MUST apply danger color styling (red text or red border as defined in UI guidelines) to incomplete todos with due dates in the past
- **FR-003**: System MUST NOT mark todos as overdue if they have no due date
- **FR-004**: System MUST NOT apply overdue styling to completed todos, regardless of their due date
- **FR-005**: System MUST consider a todo overdue only if the due date is before today (due date of today is NOT overdue)
- **FR-006**: System MUST display relative time information (e.g., "Due 3 days ago") for overdue incomplete todos to provide urgency context
- **FR-007**: System MUST use the user's local system date/time for overdue calculations to match user expectations
- **FR-008**: System MUST maintain existing todo list functionality (viewing, editing, deleting, completing) while adding overdue indicators
- **FR-009**: System MUST provide ARIA labels for overdue todos to ensure screen reader accessibility (e.g., aria-label="Overdue: [Task title]")
- **FR-010**: System MUST treat invalid or malformed due date values as "no due date" and display with normal styling (graceful degradation)

### Key Entities

- **Todo Item**: Existing entity with attributes: title, dueDate, completed status. No new entity required; feature enhances display of existing data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing the todo list without reading individual due dates
- **SC-002**: 100% of incomplete todos with past due dates display with danger color styling
- **SC-003**: 0% of todos without due dates or with future due dates are incorrectly marked as overdue
- **SC-004**: Users can distinguish between overdue incomplete todos and completed todos through visual styling alone
- **SC-005**: The todo list displays and responds to user interactions at the same speed as before (no performance degradation)
- **SC-006**: Screen reader users can identify overdue todos through ARIA labels without relying on visual cues

## Assumptions

- Visual styling follows existing UI guidelines for danger colors (red in light mode `#c62828`, light red in dark mode `#ef5350`)
- Overdue styling serves as the base layer; standard hover, focus, and selection effects are applied on top without suppressing the danger color
- Date comparison uses browser's local date/time; no timezone conversion or server-side date handling required
- Overdue status is calculated on each component render for simplicity and correctness; no caching or memoization required for typical todo list sizes
- Overdue status updates on page load/component render; real-time automatic updates (e.g., at midnight) are not required
- The existing todo data model already includes a `dueDate` field; no database schema changes needed
- Users understand relative time formats (e.g., "3 days ago") as standard web conventions
- Relative time format follows standard grouping: "yesterday" for 1 day, "X days ago" for 2-6 days, "X weeks ago" for 7-27 days, "X months ago" for 28+ days
- Invalid or malformed date values are treated as "no due date" for graceful degradation; no validation errors displayed to users
- The feature applies only to the main todo list view; other potential views (filters, searches) are out of scope
- Completed todos always use success styling (green) per existing UI guidelines, regardless of when they were completed relative to due date
