<!--
Sync Impact Report
==================
Version Change: 0.0.0 → 1.0.0
Rationale: Initial constitution creation based on existing project documentation

Principles Created:
- I. Code Quality & Maintainability
- II. Test-First Development (NON-NEGOTIABLE)
- III. Comprehensive Testing
- IV. Simplicity & Focus
- V. Design Consistency

Sections Added:
- Technology Stack
- Development Workflow

Templates Status:
✅ .specify/templates/plan-template.md - Aligned with testing and quality principles
✅ .specify/templates/spec-template.md - Aligned with simplicity and requirements principles
✅ .specify/templates/tasks-template.md - Aligned with workflow and testing principles

Follow-up TODOs: None
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Maintainability

Every piece of code MUST follow consistent formatting and organizational standards:
- **Indentation**: 2 spaces for all files (JavaScript, JSON, CSS, Markdown)
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components/classes, UPPER_SNAKE_CASE for constants
- **Single Responsibility**: Each module, component, or function has one well-defined responsibility
- **Import Organization**: External libraries first, internal modules second, styles last - separated by blank lines
- **No Circular Dependencies**: Modules must not create circular import chains
- **Line Length**: Keep code lines under 100 characters for readability

**Rationale**: Consistent code quality enables team collaboration, reduces cognitive load, and prevents technical debt accumulation. Maintainability is achieved through predictable patterns and clear organization.

### II. Test-First Development (NON-NEGOTIABLE)

Test-Driven Development (TDD) is mandatory for all features:
- **Write Tests First**: Tests describe expected behavior before implementation begins
- **Red-Green-Refactor**: Tests must fail first (Red), then pass after implementation (Green), then optimize (Refactor)
- **Behavior Documentation**: Tests serve as living documentation of how the system works
- **No Implementation Without Tests**: Code without corresponding tests will not be accepted

**Rationale**: TDD ensures requirements are understood before coding begins, catches regressions early, and creates a safety net for refactoring. This is non-negotiable because it fundamentally shapes code quality and system reliability.

### III. Comprehensive Testing

Testing MUST be thorough, isolated, and maintainable:
- **Coverage Target**: Maintain 80%+ code coverage across all packages
- **Test Isolation**: Each test is independent with its own setup and cleanup; no shared state
- **Mock External Dependencies**: API calls, timers, and external systems must be mocked
- **Quality Over Quantity**: Focus on testing behavior, not implementation details
- **Test Maintainability**: Use fixtures, helpers, and clear test organization to reduce duplication

**Rationale**: High-quality tests provide confidence in changes, enable fearless refactoring, and catch bugs early. Isolated tests run faster and are more reliable than integration-heavy test suites.

### IV. Simplicity & Focus

Features MUST be simple, focused, and solve real user needs:
- **Minimal Interface**: Clean, minimal UI focused on core functionality only
- **No Premature Features**: Build what's needed now, not what might be needed later (YAGNI principle)
- **Clear Purpose**: Every feature must solve a specific, defined user problem
- **No Feature Creep**: Explicitly define out-of-scope features and resist adding them

**Rationale**: Simplicity reduces maintenance burden, improves user experience, and accelerates development. Feature focus prevents bloat and keeps the application intuitive and performant.

### V. Design Consistency

All UI elements MUST follow the established design system:
- **Material Design Principles**: Clean, card-based layouts with consistent visual hierarchy
- **8px Grid System**: All spacing follows 8px increments (8px, 16px, 24px, 32px, 48px)
- **Color Palette**: Consistent use of defined colors for light and dark modes
- **Typography**: System fonts with defined sizes (28px headings, 16px body, 14px buttons)
- **Accessibility**: Support both light and dark themes for user preference

**Rationale**: Design consistency creates a professional appearance, improves usability through predictable patterns, and reduces decision fatigue for both developers and users.

## Technology Stack

The project MUST use the following technologies as defined in the architecture:
- **Architecture**: Monorepo structure using npm workspaces
- **Frontend**: React for UI components, CSS for styling, Jest for testing
- **Backend**: Node.js and Express.js for API server, Jest for testing
- **Node Version**: v16 or higher required
- **Package Manager**: npm v7 or higher for workspace support
- **Concurrency**: Use concurrently for parallel development processes

**Rationale**: Standardizing the technology stack ensures consistency, leverages team expertise, and simplifies onboarding and maintenance.

## Development Workflow

All development work MUST follow this structured workflow:
1. **Feature Planning**: Define requirements and success criteria upfront
2. **Test Creation**: Write tests that describe expected behavior
3. **Implementation**: Build the feature to pass the tests
4. **Code Review**: Verify adherence to all constitution principles
5. **Immediate Persistence**: All data changes must persist to backend immediately
6. **Coverage Verification**: Ensure 80%+ coverage before merging

**Workspace Commands**:
- `npm install`: Install all dependencies across workspaces
- `npm run start`: Start both frontend and backend concurrently
- `npm test`: Run all tests across both packages
- Package-specific commands available in individual package directories

**Rationale**: A structured workflow ensures quality gates are met, principles are followed, and changes are properly validated before reaching production.

## Governance

This constitution supersedes all other development practices and guidelines:
- **Compliance Required**: All code, features, and changes MUST comply with these principles
- **Amendment Process**: Amendments require documentation of rationale, team approval, and migration plan if existing code is affected
- **Version Control**: Constitution follows semantic versioning (MAJOR.MINOR.PATCH)
  - MAJOR: Breaking changes to principles or removal of core rules
  - MINOR: Addition of new principles or significant guidance expansion
  - PATCH: Clarifications, wording improvements, or non-semantic refinements
- **Review Gate**: Code reviews must verify compliance with constitution principles
- **Documentation**: Refer to `docs/` folder for detailed implementation guidance aligned with these principles

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
