# Specification: Refactor Installer CLI

## Overview

Refactor `bin/install.ts` to improve modularity and maintainability. The core logic, platform definitions, helper functions, and CLI actions will be extracted into separate modules. `bin/install.ts` will serve as a clean entry point.

## Type

Refactor

## Functional Requirements

- [FR-1]: Extract type definitions to `bin/types.ts`.
- [FR-2]: Extract version extraction logic to `bin/version.ts`.
- [FR-3]: Extract platform definitions to `bin/platforms/index.ts`.
- [FR-4]: Extract utility functions to `bin/utils.ts`.
- [FR-5]: Extract file operation logic to `bin/file-ops.ts`.
- [FR-6]: Extract CLI actions (`runInteractive`, `execute`) to `bin/actions.ts`.
- [FR-7]: Update `bin/install.ts` to import and orchestrate the extracted components.

## Acceptance Criteria

- [ ] `bin/install.ts` is significantly reduced in size and contains primarily CLI configuration.
- [ ] `pnpm build` succeeds.
- [ ] `pnpm test` (version display tests) continues to pass.
- [ ] Interactive and non-interactive modes function identically to the pre-refactor state.

## Out of Scope

- Changing the functional behavior of the installer.
- Adding new platforms or features.

## Dependencies

- Existing `bin/install.ts` logic.
- `vitest` for regression testing.
