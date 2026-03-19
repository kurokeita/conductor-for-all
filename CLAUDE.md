# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build          # compile bin/install.ts → dist/install.js via tsup
pnpm dev            # run install script directly with tsx (no build needed)
pnpm dev -- --platform claudeCode --dry-run  # pass CLI flags
pnpm test           # run all tests with vitest
pnpm lint           # biome check + markdownlint
pnpm format         # biome check --write + markdownlint --fix
```

Run a single test file:

```bash
pnpm test test/platforms.test.ts
```

## Architecture

The project has two independent parts:

### 1. Prompt files (`commands/`)

Plain markdown files with YAML frontmatter (`description:`). These are the actual Conductor workflow prompts shipped to users. They require no build step — the installer reads them at runtime.

### 2. Installer CLI (`bin/` → `dist/install.js`)

A Node.js CLI (tsup-bundled ESM, entry `bin/install.ts`) that copies the prompt files to the correct location for each target platform.

**Data flow:**

```
bin/install.ts          ← CLI entry (commander), interactive or non-interactive
  bin/actions.ts        ← orchestrates install/uninstall loops
    bin/file-ops.ts     ← copyFile / removeFile primitives
    bin/platforms/      ← one file per platform, plus index.ts
```

**Adding a new platform** requires only editing `bin/platforms/index.ts` to add an entry to `PLATFORMS`, and optionally a new `bin/platforms/<platform>.ts` with transform functions if the target format differs from the source markdown.

### Platform transforms

Each platform entry in `PLATFORMS` can define:

- `workflowsPath` — destination directory (supports `~` expansion)
- `transformName?(name)` — renames the file at the destination (e.g., `.md` → `.toml`)
- `transformContent?(srcName, content)` — rewrites file content for the target format

Existing transforms:

| File | What it does |
| --- | --- |
| `claude-code.ts` | Injects `name:` into frontmatter; installs as `<name>/SKILL.md` |
| `codex.ts` | Injects `name:` + `description:` into frontmatter |
| `copilot.ts` | Injects `name:` + `description:` into frontmatter |
| `gemini.ts` | Converts markdown + frontmatter → TOML (`description` + `prompt` fields) |

### Build

tsup bundles `bin/install.ts` into a single `dist/install.js` (ESM, Node 18 target). Runtime dependencies (`@clack/prompts`, `commander`, `picocolors`) are kept external and resolved from `node_modules` at runtime. The `commands/` directory is included in the npm package (`"files"` in `package.json`) alongside `dist/`.

## Code style

- Biome for linting/formatting: tabs, double quotes, no semicolons
- Imports use `.js` extensions (ESM)
- markdownlint for all `.md` files
