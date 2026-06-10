# Quickstart: Overdue Todo Items Validation

**Feature**: Overdue Todo Items  
**Date**: 2026-06-10  
**Phase**: 1 (Design & Contracts)  
**Purpose**: End-to-end validation scenarios to prove the feature works correctly

## Prerequisites

- Node.js v16+ installed
- Project dependencies installed: `npm install`
- Both frontend and backend running: `npm run start`
- Browser with developer tools (Chrome/Firefox/Safari)

## Setup Commands

```bash
# From project root
cd /path/to/bootcamp-session-6-CR

# Install dependencies (if not already done)
npm install

# Start both frontend and backend
npm run start
# Backend will run on http://localhost:5000
# Frontend will run on http://localhost:3000
```

## Validation Scenarios

### Scenario 1: Visual Identification of Overdue Todo (P1 - MVP)

**Goal**: Verify that incomplete todos with past due dates display with danger color styling

**Steps**:
1. Open browser to `http://localhost:3000`
2. Create a new todo:
   - Title: "Overdue test task"
   - Due Date: Set to yesterday's date (e.g., if today is June 10, use June 9)
   - Click "Add"
3. Observe the newly created todo in the list

**Expected**:
- ✅ Todo card displays with red border or red text (danger color)
- ✅ Todo is visually distinct from normal todos
- ✅ Hover over the todo - red color persists with hover effect applied on top
- ✅ No error messages or console errors

**Verify** (via Browser DevTools):
- Inspect the todo card element
- Confirm CSS class contains `overdue` or similar modifier class
- Confirm color values match danger colors from UI guidelines:
  - Light mode: `#c62828` (red)
  - Dark mode: `#ef5350` (light red)

### Scenario 2: No False Positives - Today's Date Not Overdue

**Goal**: Verify that todos due today are NOT marked as overdue

**Steps**:
1. Create a new todo:
   - Title: "Task due today"
   - Due Date: Today's date (June 10, 2026)
   - Click "Add"
2. Observe the todo in the list

**Expected**:
- ✅ Todo displays with NORMAL styling (not red)
- ✅ No danger color applied
- ✅ Behaves like a regular incomplete todo

### Scenario 3: Completed Overdue Todo Uses Success Styling

**Goal**: Verify that completing an overdue todo changes styling to success (green), not danger (red)

**Steps**:
1. Using the overdue todo from Scenario 1
2. Click the checkbox to mark it complete
3. Observe the styling change

**Expected**:
- ✅ Todo styling changes from danger (red) to success (green)
- ✅ No overdue styling remains after completion
- ✅ Strikethrough or completion indicator appears (per existing behavior)

### Scenario 4: Relative Time Display (P2 - Enhancement)

**Goal**: Verify that overdue todos show relative time information

**Steps**:
1. Create todos with various past due dates:
   - Yesterday: "Due yesterday"
   - 3 days ago: "Due 3 days ago"
   - 10 days ago: "Due 1 week ago" or "Due 10 days ago"
   - 40 days ago: "Due 1 month ago" or "Due 40 days ago"
2. Observe the due date text for each

**Expected**:
- ✅ Yesterday's todo shows: "Due yesterday" or "Due 1 day ago"
- ✅ 3 days ago shows: "Due 3 days ago"
- ✅ 10 days ago shows: "Due 1 week ago" or similar
- ✅ 40 days ago shows: "Due 1 month ago" or similar
- ✅ Relative time format follows the clarified grouping rules

### Scenario 5: Screen Reader Accessibility

**Goal**: Verify that screen readers can identify overdue todos

**Steps**:
1. Enable screen reader (macOS: VoiceOver, Windows: NVDA, Narrator)
2. Navigate to the todo list
3. Tab through todos or use screen reader navigation
4. Listen for ARIA label announcements

**Expected**:
- ✅ Overdue todos announce as "Overdue: [task title]"
- ✅ Normal todos announce as just "[task title]"
- ✅ Completed todos announce completion status

**Manual Check** (if screen reader not available):
- Inspect overdue todo card element
- Verify `aria-label` attribute exists
- Verify it contains "Overdue: " prefix

### Scenario 6: Invalid Date Graceful Degradation

**Goal**: Verify that invalid dates don't crash the app or show errors

**Steps**:
1. Using browser DevTools Console:
   ```javascript
   // Simulate invalid date by directly manipulating data
   // (This would normally come from backend, but we can test the frontend handling)
   ```
2. Or manually edit a todo in the backend database to have an invalid dueDate
3. Refresh the frontend
4. Observe how the todo with invalid date is displayed

**Expected**:
- ✅ App doesn't crash
- ✅ Todo displays with NORMAL styling (treated as "no due date")
- ✅ No error message shown to user
- ✅ No console errors (or only warnings, not crashes)

### Scenario 7: No Performance Degradation

**Goal**: Verify that the todo list renders and responds at the same speed as before

**Steps**:
1. Create 20-30 todos (mix of overdue, current, future, completed)
2. Scroll through the list
3. Toggle checkboxes to complete/uncomplete todos
4. Hover over various todos

**Expected**:
- ✅ List renders instantly (< 100ms)
- ✅ No lag when hovering or interacting
- ✅ Checkbox toggles respond immediately
- ✅ No performance warnings in React DevTools Profiler

**Measure** (optional):
- Open React DevTools → Profiler
- Record interaction (e.g., toggling checkbox)
- Verify render time < 16ms (60fps threshold)

## Testing Commands

```bash
# Run all tests (frontend + backend)
npm test

# Run only frontend tests
npm run test:frontend

# Run frontend tests in watch mode
npm run test:frontend -- --watch

# Run tests with coverage report
npm run test:frontend -- --coverage
```

**Expected Test Results**:
- ✅ All existing tests pass
- ✅ New tests for overdue detection pass
- ✅ New tests for ARIA labels pass
- ✅ Coverage remains ≥80%

## Troubleshooting

### Issue: Overdue styling not appearing

**Check**:
1. Verify date comparison logic in `TodoCard.js`
2. Check CSS class is being applied: inspect element in DevTools
3. Verify CSS styles exist in `theme.css` for `.todo-card--overdue`
4. Check browser console for JavaScript errors

### Issue: Relative time showing wrong format

**Check**:
1. Verify `Intl.RelativeTimeFormat` is supported (should work in all modern browsers)
2. Check date calculation logic for day/week/month grouping
3. Verify system date/time is correct (feature uses browser's local time)

### Issue: Screen reader not announcing "Overdue"

**Check**:
1. Inspect element - verify `aria-label` attribute exists
2. Verify `aria-label` value includes "Overdue: " prefix
3. Try different screen reader (behavior may vary across tools)
4. Check that element is focusable (has tabindex or is interactive)

## Success Criteria Validation

Use these scenarios to validate the 6 Success Criteria from [spec.md](spec.md):

- **SC-001**: Can identify overdue within 2 seconds → ✅ Scenario 1
- **SC-002**: 100% of overdue todos styled correctly → ✅ Scenarios 1, 2, 3
- **SC-003**: 0% false positives → ✅ Scenario 2
- **SC-004**: Visual distinction between states → ✅ Scenarios 1, 3
- **SC-005**: No performance degradation → ✅ Scenario 7
- **SC-006**: Screen reader accessibility → ✅ Scenario 5

## Next Steps

After validating all scenarios:
1. Run full test suite: `npm test`
2. Check test coverage: `npm run test:frontend -- --coverage`
3. Verify no console errors or warnings
4. Ready for code review and merge

## Reference

- **Spec**: [spec.md](spec.md)
- **Data Model**: [data-model.md](data-model.md)
- **Research**: [research.md](research.md)
- **UI Guidelines**: [../../docs/ui-guidelines.md](../../docs/ui-guidelines.md)
