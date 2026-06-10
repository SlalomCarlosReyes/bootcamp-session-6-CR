# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-06-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add visual indicators to help users quickly identify overdue todos without manual date comparison. The feature provides two priority levels: P1 (MVP) applies danger-color styling to incomplete todos past their due date, and P2 (enhancement) adds relative time displays ("Due 3 days ago"). Implementation involves frontend date comparison logic on component render, CSS styling changes, ARIA labels for accessibility, and graceful handling of invalid dates.

## Technical Context

**Language/Version**: JavaScript (Node.js v16+, ES6+)

**Primary Dependencies**: 
- Frontend: React 18.2.0, react-scripts 5.0.1, axios 1.9.0
- Backend: Express 4.18.2, better-sqlite3 11.10.0, cors 2.8.5

**Storage**: SQLite (better-sqlite3) for persistent todo data

**Testing**: Jest 29.7.0 for both frontend and backend; supertest 6.3.3 for backend API tests; React Testing Library (via react-scripts) for frontend

**Target Platform**: Web browsers (desktop-focused per functional requirements)

**Project Type**: Full-stack web application (monorepo with separate frontend/backend packages)

**Performance Goals**: 
- <2 seconds for users to identify overdue todos (per SC-001)
- No performance degradation compared to current todo list (per SC-005)
- Date comparison operations must be negligible (<1ms per todo)

**Constraints**: 
- Browser-only date handling (no server-side date processing)
- Must work with existing todo data model (no schema changes)
- 80%+ test coverage required (per constitution principle III)
- Client-side rendering only (no real-time updates)

**Scale/Scope**: 
- Single-user application
- Typical todo count: <100 items (performance optimized for this scale)
- Two prioritized user stories (P1 MVP, P2 enhancement)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Code Quality & Maintainability** | 2-space indentation, camelCase/PascalCase naming, single responsibility, organized imports | ✅ PASS | Standard React/Express patterns apply |
| **II. Test-First Development** | TDD mandatory: write tests before implementation, red-green-refactor cycle | ✅ PASS | Spec includes 12 acceptance scenarios ready for test conversion |
| **III. Comprehensive Testing** | 80%+ coverage, isolated tests, mocked dependencies | ✅ PASS | Jest configured for both packages; 10 FRs with clear test criteria |
| **IV. Simplicity & Focus** | Minimal UI, no premature features, clear purpose, no feature creep | ✅ PASS | Focused on overdue indication only; P1/P2 prioritization prevents bloat |
| **V. Design Consistency** | Material Design, 8px grid, defined color palette, system fonts, light/dark themes | ✅ PASS | Uses existing danger colors from UI guidelines; no new design patterns |
| **Technology Stack** | React, Express, Jest, npm workspaces, Node v16+ | ✅ PASS | No new technologies; works within existing stack |
| **Development Workflow** | Feature planning → tests → implementation → review → persistence → coverage | ✅ PASS | Following SpecKit workflow (specify → plan → tasks → implement) |

**Gate Result**: ✅ **PASSED** - All constitution principles satisfied. Proceed to Phase 0.

## Phase 0: Research & Outline

**Status**: ✅ **COMPLETE**

**Artifacts Generated**:
- [research.md](research.md) - Technical research on date handling, relative time formatting, ARIA labels, CSS patterns, and error handling

**Key Decisions**:
1. Use native JavaScript `Date` API for comparisons (no external libraries)
2. Use `Intl.RelativeTimeFormat` for relative time displays
3. Use `aria-label` attributes for screen reader accessibility
4. Use BEM-style CSS modifier classes (`.todo-card--overdue`)
5. Gracefully handle invalid dates with `isNaN()` check

**All NEEDS CLARIFICATION Resolved**: ✅ Yes - No unknowns remain

## Phase 1: Design & Contracts

**Status**: ✅ **COMPLETE**

**Artifacts Generated**:
- [data-model.md](data-model.md) - Documents existing Todo entity and client-side derived properties
- [contracts/README.md](contracts/README.md) - Confirms no API contract changes needed
- [quickstart.md](quickstart.md) - End-to-end validation scenarios

**Key Decisions**:
1. No database schema changes - feature uses existing `dueDate` field
2. No backend API changes - all logic is frontend-only
3. Overdue detection via pure functions: `isOverdue()`, `relativeTimeText()`
4. Component interface remains backward compatible

**Agent Context Updated**: ✅ Yes - [.github/copilot-instructions.md](.github/copilot-instructions.md) now references this plan

## Constitution Check (Post-Design Re-evaluation)

*Required by Phase 1 completion*

| Principle | Design Impact | Status | Notes |
|-----------|---------------|--------|-------|
| **I. Code Quality & Maintainability** | Pure functions for date logic, BEM CSS classes | ✅ PASS | Research validates maintainable patterns |
| **II. Test-First Development** | Test fixtures defined in data-model.md | ✅ PASS | 6 test scenarios ready for TDD implementation |
| **III. Comprehensive Testing** | Unit tests for pure functions + component tests | ✅ PASS | High testability: pure functions, no side effects |
| **IV. Simplicity & Focus** | No dependencies, native APIs only | ✅ PASS | Research chose simplest solutions (no Moment.js, no date-fns) |
| **V. Design Consistency** | Uses existing danger colors, BEM patterns | ✅ PASS | Contracts confirm no new design patterns needed |
| **Technology Stack** | React, Jest - no new tech | ✅ PASS | Stays within existing stack |
| **Development Workflow** | Quickstart.md provides validation path | ✅ PASS | Clear testing and validation workflow defined |

**Gate Result**: ✅ **PASSED** - Design artifacts confirm no constitution violations. Ready for `/speckit.tasks`.

## Summary

**Planning Complete**: All design decisions made, no unknowns remain.

**Next Command**: `/speckit.tasks` to generate implementation tasks from this plan.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app setup
│   │   ├── index.js                  # Server entry point
│   │   └── services/
│   │       └── todoService.js        # Todo business logic
│   └── __tests__/
│       └── app.test.js               # API integration tests
│
└── frontend/
    ├── src/
    │   ├── App.js                    # Main React component
    │   ├── components/
    │   │   ├── TodoCard.js          # Individual todo display (MODIFY for overdue styling)
    │   │   ├── TodoList.js          # Todo list container (MODIFY if needed)
    │   │   ├── TodoForm.js          # Todo creation form
    │   │   ├── ConfirmDialog.js     # Delete confirmation
    │   │   ├── ThemeToggle.js       # Light/dark mode toggle
    │   │   └── __tests__/
    │   │       ├── TodoCard.test.js # (ADD overdue styling tests)
    │   │       └── TodoList.test.js # (ADD overdue detection tests)
    │   ├── services/
    │   │   ├── todoService.js       # API client
    │   │   └── __tests__/
    │   │       └── todoService.test.js
    │   └── styles/
    │       └── theme.css            # (MODIFY for overdue danger colors)
    └── public/
        └── index.html
```

**Structure Decision**: Web application (Option 2) with existing monorepo structure. Primary changes will be in `packages/frontend/src/components/TodoCard.js` for overdue detection and styling. No backend changes required since date comparison happens client-side. Testing will focus on frontend components with Jest and React Testing Library.

## Complexity Tracking

No constitution violations - complexity tracking not required.
