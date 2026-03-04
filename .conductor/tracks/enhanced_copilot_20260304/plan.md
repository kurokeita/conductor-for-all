# Implementation Plan: Enhanced Copilot Integration and Agent Interoperability

## Phase 1: Platform Registry Update

- [x] Task: Update `bin/platforms/index.ts` a91d7f4
  - [x] Update `copilot` path to `.github/agents`.
  - [x] Add `copilotPrompts` (path: `.github/prompts`, ext: `.prompt.md`).
  - [x] Add `copilotSkills` (path: `~/.copilot/skills`, pattern: `<name>/SKILL.md`).
  - [x] **Verify**: Run `pnpm dev -- --dry-run` to see proposed paths.

## Phase 2: Prompt Templates Update

- [ ] Task: Update `commands/*.md`
  - [ ] Add "Network of Agents" section to `conductor-setup.md`, `conductor-planning.md`, `conductor-implement.md`, `conductor-review.md`, and `conductor-status.md`.
  - [ ] **Verify**: Check file content.

## Phase 3: Installer Logic Refinement

- [ ] Task: Subdirectory Handling
  - [ ] Ensure `copyFile` logic correctly handles the directory-per-skill structure.
  - [ ] **Verify**: Dry run output looks correct for skills.

## Phase 4: Finalization

- [ ] Task: Quality Gate
  - [ ] Run `pnpm run lint`.
  - [ ] Run `pnpm test`.
- [ ] Task: Manual Verification — 'Enhanced Copilot Integration'
  - [ ] Verify local installs (`.github/agents`, `.github/prompts`).
  - [ ] Verify global install (`~/.copilot/skills`).
