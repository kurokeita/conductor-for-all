# Implementation Plan: Display Version in CLI

## Phase 1: Foundation & Version Extraction
- [x] Task: Project Activation
    - [ ] Run `mcp_serena_activate_project`
- [ ] Task: Create Test Suite for Version Display
    - [ ] **Write Tests**: Create `test/version.test.ts` (or equivalent) to verify `-v/--version` and help output.
    - [ ] **CRITICAL**: Run tests and confirm they fail.
- [ ] Task: Update `bin/install.ts` to Import Version
    - [ ] Read `package.json` to extract the version string dynamically.
    - [ ] **Implement**: Add logic to `bin/install.ts` to import or read the version.

## Phase 2: CLI Integration
- [ ] Task: Configure Commander Version
    - [ ] **Implement**: Call `.version()` on the `commander` instance with the extracted version and support for `-v, --version`.
    - [ ] **Verify**: Run `pnpm dev -- --version` and `pnpm dev -- --help`.
- [ ] Task: Display Version in Interactive Mode
    - [ ] **Implement**: Update the `p.intro()` or initial header in `bin/install.ts` to include a small footer with the version number using `pc.dim()`.
    - [ ] **Verify**: Run `pnpm dev` and check the initial UI.

## Phase 3: Finalization & Verification
- [ ] Task: Refactor & Quality Gate
    - [ ] Ensure `pnpm build` succeeds.
    - [ ] Check linting with `pnpm run lint`.
- [ ] Task: Manual Verification — 'Display Version in CLI'
    - [ ] Verify `-v` flag output.
    - [ ] Verify `--version` flag output.
    - [ ] Verify version footer in interactive mode.
