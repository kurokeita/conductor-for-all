# Style and Conventions: Conductor for All

## Coding Style

- **Indentation:** 2 spaces.
- **Semicolons:** Avoided in new code; follow existing patterns in older files.
- **ESM:** Always use ESM-compliant imports (include `.js` extension in relative paths).
- **TypeScript:**
  - Strict mode enabled.
  - Explicitly declare types for variables and function returns.
  - Avoid use of `any`.
- **Documentation:** Use JSDoc for all exported functions and classes.

## Naming Conventions

- **Files:** kebab-case (e.g., `install.ts`, `copilot.ts`).
- **Variables/Functions:** camelCase (e.g., `getPromptFiles`, `transformContent`).
- **Interfaces/Types:** PascalCase (e.g., `Platform`, `PromptFile`).
- **Constants:** UPPER_SNAKE_CASE (e.g., `PLATFORMS`, `PLATFORM_KEYS`).

## Project-Specific Rules

- **The Plan is the Source of Truth:** Never implement changes without first updating `plan.md`.
- **TDD Mandatory:** Always start with a failing test before writing implementation code.
- **Commit Messages:** Follow Conventional Commits format.
  - `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
  - Conductor-specific: `conductor(plan)`, `conductor(checkpoint)`, `conductor(setup)`.
- **Git Notes:** Every task-related commit must have a summary attached via `git notes`.
