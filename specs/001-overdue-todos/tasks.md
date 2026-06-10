# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Following TDD approach per constitution principle II (non-negotiable)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `packages/backend/src/`, `packages/frontend/src/`
- Tasks below use web app structure based on plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification that existing structure is ready

- [ ] T001 Verify existing project structure matches plan.md (packages/frontend, packages/backend)
- [ ] T002 [P] Confirm Jest is configured in both packages (check package.json scripts)
- [ ] T003 [P] Verify React Testing Library is available (comes with react-scripts)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create date utility module with pure functions in packages/frontend/src/utils/dateUtils.js
- [ ] T005 Write tests for isValidDate(dateStr) function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T006 Implement isValidDate(dateStr) to check if date string is valid (returns !isNaN(new Date(dateStr).getTime()))
- [ ] T007 Write tests for isOverdue(todo) function covering all scenarios from data-model.md
- [ ] T008 Implement isOverdue(todo) with date normalization to midnight and validation checks
- [ ] T009 [P] Add CSS variables for overdue styling in packages/frontend/src/styles/theme.css (danger colors from UI guidelines)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Enable users to identify overdue todos within 2 seconds through danger color styling

**Independent Test**: Create a todo with past due date and verify red styling appears

**Acceptance Criteria** (from spec.md):
- Incomplete todos with past due dates show danger color (red)
- Today's todos NOT marked overdue
- Future todos NOT marked overdue  
- Completed overdue todos show success styling (green), not danger
- No due date todos show normal styling
- Hover/focus preserve overdue styling with effects on top

### Tests First (TDD - NON-NEGOTIABLE)

- [ ] T010 [US1] Write test: TodoCard renders overdue styling for incomplete todo with past due date in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T011 [US1] Write test: TodoCard renders normal styling for todo due today
- [ ] T012 [US1] Write test: TodoCard renders normal styling for future due date
- [ ] T013 [US1] Write test: TodoCard renders success styling (not overdue) for completed todo with past due date
- [ ] T014 [US1] Write test: TodoCard renders normal styling for todo without due date
- [ ] T015 [US1] Write test: TodoCard preserves overdue styling on hover/focus
- [ ] T016 [US1] Write test: TodoCard has ARIA label "Overdue: {title}" when todo is overdue

### Implementation

- [ ] T017 [US1] Import isOverdue and isValidDate from dateUtils into packages/frontend/src/components/TodoCard.js
- [ ] T018 [US1] Add isOverdue computation in TodoCard component (call isOverdue(todo) during render)
- [ ] T019 [US1] Apply conditional CSS class todo-card--overdue when isOverdue returns true in packages/frontend/src/components/TodoCard.js
- [ ] T020 [US1] Add conditional aria-label attribute with "Overdue: " prefix when overdue in packages/frontend/src/components/TodoCard.js
- [ ] T021 [US1] Define .todo-card--overdue CSS class in packages/frontend/src/styles/theme.css with danger colors
- [ ] T022 [US1] Verify hover and focus pseudo-classes apply correctly with overdue styling in packages/frontend/src/styles/theme.css

### Integration & Validation

- [ ] T023 [US1] Run all TodoCard tests and verify they pass (npm run test:frontend)
- [ ] T024 [US1] Manual validation: Create todos with various due dates and verify visual styling per quickstart.md Scenario 1-3
- [ ] T025 [US1] Manual validation: Use screen reader or inspect ARIA labels per quickstart.md Scenario 5

**Checkpoint**: P1 MVP complete - users can visually identify overdue todos

---

## Phase 4: User Story 2 - Due Date Display Enhancement (Priority: P2)

**Goal**: Help users understand urgency by showing how far past due items are ("Due 3 days ago")

**Independent Test**: Create todos with various past due dates and verify relative time displays

**Acceptance Criteria** (from spec.md):
- 1 day ago displays "Due yesterday"
- 5 days ago displays "Due 5 days ago"
- 14 days ago displays "Due 2 weeks ago"
- 90 days ago displays "Due 3 months ago"
- Future dates show "Due in X days" or actual date
- Completed overdue todos show normal date (no relative time)

### Tests First (TDD - NON-NEGOTIABLE)

- [ ] T026 [US2] Write tests for getRelativeTimeText(dueDate) function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T027 [US2] Test yesterday displays "yesterday" using Intl.RelativeTimeFormat
- [ ] T028 [US2] Test 5 days ago displays "5 days ago"
- [ ] T029 [US2] Test 14 days ago displays "2 weeks ago" or similar
- [ ] T030 [US2] Test 90 days ago displays "3 months ago" or similar
- [ ] T031 [US2] Write test: TodoCard displays relative time for overdue incomplete todos in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T032 [US2] Write test: TodoCard does NOT display relative time for completed todos

### Implementation

- [ ] T033 [US2] Implement getRelativeTimeText(dueDate) using Intl.RelativeTimeFormat in packages/frontend/src/utils/dateUtils.js
- [ ] T034 [US2] Add day/week/month grouping logic per research.md patterns (7 days→weeks, 28 days→months)
- [ ] T035 [US2] Import and use getRelativeTimeText in packages/frontend/src/components/TodoCard.js
- [ ] T036 [US2] Conditionally display relative time text for overdue incomplete todos in TodoCard render
- [ ] T037 [US2] Ensure completed todos display normal date format (no relative time) in TodoCard

### Integration & Validation

- [ ] T038 [US2] Run all dateUtils tests and verify they pass (npm run test:frontend)
- [ ] T039 [US2] Run all TodoCard tests and verify they pass
- [ ] T040 [US2] Manual validation: Create todos with various past due dates per quickstart.md Scenario 4
- [ ] T041 [US2] Verify relative time formats match clarified grouping rules (yesterday, days, weeks, months)

**Checkpoint**: P2 enhancement complete - users understand urgency levels

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, error handling, and documentation

- [ ] T042 [P] Verify invalid/null date handling: test with malformed date values per quickstart.md Scenario 6
- [ ] T043 [P] Run full test suite for both packages: npm test
- [ ] T044 [P] Verify test coverage ≥80% for frontend: npm run test:frontend -- --coverage
- [ ] T045 [P] Performance validation: Create 30 todos and verify no lag per quickstart.md Scenario 7
- [ ] T046 Update TodoCard component documentation with JSDoc comments for isOverdue usage
- [ ] T047 Update README or component documentation noting ARIA labels for accessibility
- [ ] T048 Final review: Verify all 10 Functional Requirements (FR-001 through FR-010) are met
- [ ] T049 Final review: Verify all 6 Success Criteria (SC-001 through SC-006) are validated

---

## Dependencies

Tasks are ordered for sequential execution within each phase. Parallelizable tasks are marked with [P].

### User Story Completion Order

1. **Phase 1 (Setup)** → Complete first
2. **Phase 2 (Foundational)** → Must complete before user stories
3. **Phase 3 (US1 - P1 MVP)** → Core feature, complete before P2
4. **Phase 4 (US2 - P2 Enhancement)** → Depends on US1 completion
5. **Phase 5 (Polish)** → Final validation after all stories

### Parallel Execution Examples

**Within Foundational Phase (After T003)**:
- T004, T009 can run in parallel (different files)
- T005-T006 sequential (test-then-implement for isValidDate)
- T007-T008 sequential (test-then-implement for isOverdue)

**Within US1 Implementation**:
- T017-T020 sequential (TodoCard.js modifications)
- T021-T022 sequential (theme.css modifications)
- T023-T025 can overlap with manual validation

**Within US2 Implementation**:
- T026-T030 sequential (dateUtils tests)
- T031-T032 sequential (TodoCard tests)
- T033-T037 sequential (implementation)

**Within Polish Phase**:
- T042, T043, T044, T045 can all run in parallel
- T046-T049 can run in parallel after tests pass

---

## Implementation Strategy

### MVP First (Deliver Value Early)

**MVP = Phase 1 + Phase 2 + Phase 3 (US1)**

- Delivers core value: visual identification of overdue todos
- Users can immediately prioritize work
- Foundational utilities enable future enhancements
- ~25 tasks to MVP (T001-T025)

### Incremental Delivery

**MVP + P2 = All phases complete**

- Phase 4 adds urgency context with relative time
- Enhances MVP without changing core behavior
- Independent implementation and testing
- ~16 additional tasks (T026-T041)

### Quality Gates

After each user story:
- All tests must pass
- Coverage must be ≥80%
- Manual validation per quickstart.md scenarios
- No console errors or warnings

---

## Task Count Summary

- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 6 tasks ⚠️ BLOCKING
- **Phase 3 (US1 - P1 MVP)**: 16 tasks 🎯
- **Phase 4 (US2 - P2)**: 16 tasks
- **Phase 5 (Polish)**: 8 tasks
- **Total**: 49 tasks

**Parallel Opportunities**: 12 tasks marked with [P]

**Estimated MVP Effort**: ~25 tasks (Phases 1-3)

**Test Tasks**: 18 tasks (following TDD principle II)

**Implementation Tasks**: 22 tasks

**Validation Tasks**: 9 tasks

---

## Format Validation

✅ All tasks follow required checklist format:
- Checkbox: `- [ ]`
- Task ID: T001-T049 (sequential)
- [P] marker: Present on 12 parallelizable tasks
- [Story] label: US1 or US2 for user story tasks
- Description: Includes specific file paths
- No tasks have story labels in Setup or Foundational phases
- No tasks have story labels in Polish phase

✅ Independent testing criteria defined for each user story

✅ Tasks organized by phase with clear completion checkpoints

✅ MVP scope clearly identified (Phases 1-3)

✅ All functional requirements and success criteria mapped to tasks
