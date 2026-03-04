# Tech Stack

## Language

- **TypeScript 5.x** (strict mode, ESM-only, target ES2022)
- Runtime: **Node.js >= 18**

## Build

- **tsup** — bundles `bin/install.ts` → `dist/install.js` (ESM, no splitting)
- **tsx** — for local development (`pnpm dev`)

## CLI Dependencies

- **commander** — argument parsing
- **@clack/prompts** — interactive terminal UI (spinners, selects, confirms)
- **picocolors** — terminal color output

## Package Manager

- **pnpm 10.x**

## Distribution

- Published to npm as `@kurokeita/conductor-for-all` (public scoped package)
- Binary entry: `conductor-install` → `./dist/install.js`
- Distributed files: `dist/`, `commands/`

## Supported Platforms

- **Antigravity**: global workflows (`~/.gemini/antigravity/global_workflows`)
- **GitHub Copilot Agents (IDE)**: local agents (`.github/agents`)
- **GitHub Copilot Prompts (IDE)**: local prompts (`.github/prompts/*.prompt.md`)
- **GitHub Copilot CLI Agents**: global agents (`~/.copilot/agents`)
- **GitHub Copilot CLI Skills**: global skills (`~/.copilot/skills/<name>/SKILL.md`)
- **Gemini CLI**: global commands (`~/.gemini/commands/conductor` as `.toml`)
- **Windsurf**: global workflows (`~/.codeium/windsurf/global_workflows`)

## Repository

- GitHub: `kurokeita/conductor-for-all`
- No test framework currently configured
- No linter/formatter currently configured
