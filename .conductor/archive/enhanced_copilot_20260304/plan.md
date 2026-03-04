# Implementation Plan: Enhanced Copilot Integration and Agent Interoperability

## Phase 1: Platform Registry Update

- [x] Task: Update `bin/platforms/index.ts` a91d7f4
  - [x] Update `copilot` path to `.github/agents`.
  - [x] Add `copilotPrompts` (path: `.github/prompts`, ext: `.prompt.md`).
  - [x] Add `copilotSkills` (path: `~/.copilot/skills`, pattern: `<name>/SKILL.md`).
  - [x] **Verify**: Run `pnpm dev -- --dry-run` to see proposed paths.

## Phase 2: Prompt Templates Update

- [x] Task: Update `commands/*.md` d1d6062
  - [x] Add "Network of Agents" section to `conductor-setup.md`, `conductor-planning.md`, `conductor-implement.md`, `conductor-review.md`, and `conductor-status.md`.
  - [x] **Verify**: Check file content.

## Phase 3: Installer Logic Refinement

- [x] Task: Subdirectory Handling
  - [x] Ensure `copyFile` logic correctly handles the directory-per-skill structure.
  - [x] **Verify**: Dry run output looks correct for skills.

## Phase 4: Finalization [checkpoint: 7e5cb25]

- [x] Task: Quality Gate
  - [x] Run `pnpm run lint`.
  - [x] Run `pnpm test`.
- [x] Task: Manual Verification — 'Enhanced Copilot Integration'
  - [x] Verify local installs (`.github/agents`, `.github/prompts`).
  - [x] Verify global install (`~/.copilot/skills`).
