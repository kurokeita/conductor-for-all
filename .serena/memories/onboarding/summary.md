# Project Onboarding: Conductor for All

## Project Purpose

`conductor-for-all` is a CLI tool and a collection of universal, agent-agnostic prompts that bring the **Conductor** Context-Driven Development (CDD) workflow to any AI coding assistant. It helps install and transform these prompts for various platforms like GitHub Copilot, Gemini CLI, Windsurf, etc.

## Tech Stack

- **Language:** TypeScript 5.x (strict mode, ESM-only)
- **Runtime:** Node.js >= 18
- **Package Manager:** pnpm 10.x
- **CLI Framework:** `commander`
- **Interactive UI:** `@clack/prompts`, `picocolors`
- **Build System:** `tsup`
- **Execution:** `tsx` for development

## Codebase Structure

- `bin/install.ts`: Main entry point for the installation CLI.
- `bin/platforms/`: Platform-specific transformation logic.
- `commands/`: Core Conductor prompt templates (Markdown).
- `.conductor/`: Project context files (product, tech-stack, workflow, tracks).
- `dist/`: Compiled JavaScript assets.

## Code Style and Conventions

- **Indentation:** 2 spaces.
- **Semicolons:** Generally avoided, but some files might have them (follow local style).
- **ESM:** The project uses native ES modules (`"type": "module"`).
- **TypeScript:** Strict mode, types explicitly declared, no `any`.
- **Commit Messages:** Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `conductor(plan):`).
- **JSDoc:** All public functions/methods must be documented.

## Development Workflow

- **Plan-Driven:** All work must be tracked in `plan.md`.
- **TDD:** Write unit tests before implementing functionality (Red -> Green -> Refactor).
- **Code Coverage:** Aim for >80% coverage for new code.
- **Commit Process:**
  - Manual confirmation required unless "auto mode" is requested.
  - Propose commit message and show changes before committing.
  - Attach task summary using `git notes` after each commit.
- **Phase Checkpoints:** Mandatory verification and checkpointing protocol at the end of each phase.

## Development Commands

- `pnpm install`: Install dependencies.
- `pnpm dev`: Run interactive installer in development mode.
- `pnpm build`: Build the project using `tsup`.
- `pnpm test`: (Placeholder) Run tests when a framework is added.
- `git log -1 --format="%H"`: Get last commit hash.
- `git notes add -m "<note>" <hash>`: Attach git notes.

## MCP Usage Rules

- **Serena:** Use for all code navigation, symbol search, and editing.
- **Context7:** Fetch documentation for libraries before implementation.
- **Sequential Thinking:** Use for complex architectural decisions or debugging.
