# Implementation Plan: Copilot Custom Agent Frontmatter Injection

## Phase 1: Core Implementation

- [x] Task: Add `transformContent` to `Platform` interface
  - [x] Add optional `transformContent?: (name: string, content: string) => string` field to `Platform` in `bin/install.ts`
- [x] Task: Implement `injectCopilotFrontmatter` helper
  - [x] Update function to inject `name: <stem>` and `description: <content>` into existing frontmatter
  - [x] Handle case where file has no frontmatter (prepend block)
  - [x] Skip injection if `name:` or `description:` field already present
- [x] Task: Implement TOML converter for `gemini` platform
  - [x] Create `convertToGeminiToml` helper function
  - [x] Parse source file to extract `description` from frontmatter (if present)
  - [x] Generate TOML string with `description` and `prompt` (original content)
- [x] Task: Update `copyFile` to apply `transformContent`
  - [x] Accept optional `transformContent` parameter
  - [x] When provided: read source → transform → write (instead of `copyFileSync`)
  - [x] When absent: preserve existing `copyFileSync` behavior
- [x] Task: Update platform definitions for `copilot`, `copilotCli`, and `gemini`
  - [x] Update `copilot` destination to `.github/agents` and keep `.md` extension
  - [x] Update `copilotCli` destination to `~/.copilot/agents` and keep `.md` extension
  - [x] Update `gemini` destination to `~/.gemini/commands/conductor`
  - [x] Add `renameFile` capability to strip `conductor-` prefix for `gemini` files
  - [x] Update file extension to `.toml` for `gemini`
  - [x] Set `transformContent: injectCopilotFrontmatter` on copilot platforms
  - [x] Set `transformContent: convertToGeminiToml` on the gemini platform
- [x] Task: Assign `transformContent` to `copilot` and `copilotCli` platforms
  - [x] Set `transformContent: injectFrontmatterName` on both platform entries

## Phase 2: Verification

- [x] Task: Build and type-check
  - [x] Run `pnpm build` and confirm zero TypeScript errors
- [x] Task: Smoke test — copilot (IDE)
  - [x] Run `pnpm dev -- --platform copilot --dry-run` and confirm output paths (.github/agents, no extension change)
  - [x] Run `pnpm dev -- --platform copilot` and inspect an installed `.md` file
  - [x] Verify `name:` and `description:` fields appear immediately after opening `---`
- [x] Task: Smoke test — copilotCli
  - [x] Run `pnpm dev -- --platform copilotCli` and inspect an installed `.md` file
  - [x] Verify `name:` and `description:` fields are present and correct
- [x] Task: Smoke test — gemini
  - [x] Run `pnpm dev -- --platform gemini` and inspect the destination `~/.gemini/commands/conductor`
  - [x] Verify `setup.toml`, `planning.toml`, etc. are created (without `conductor-` prefix)
  - [x] Verify the files contain valid TOML with `description` and `prompt` strings
- [x] Task: Smoke test — unaffected platforms
  - [x] Run `pnpm dev -- --platform antigravity` and confirm installed file is byte-for-byte identical to source
- [x] Task: Manual Verification — 'Phase 2'
