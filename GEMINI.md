# Project Context: Conductor for All

`conductor-for-all` is a CLI tool and a collection of universal, agent-agnostic prompts that bring the **Conductor** Context-Driven Development (CDD) workflow to any AI coding assistant (GitHub Copilot, Gemini CLI, Windsurf, Cursor, etc.).

## Project Overview

The project consists of two main parts:

1. **Prompts (`commands/`):** A set of Markdown-based workflows (`setup`, `planning`, `implement`, `review`, `status`) that define a rigorous development lifecycle: `Context → Spec & Plan → Implement → Review`.
2. **CLI Tool (`bin/install.ts`):** A TypeScript-based installer that syncs these prompts to the correct configuration directories for various AI platforms, performing necessary transformations (e.g., converting Markdown to TOML for Gemini CLI or injecting YAML frontmatter for GitHub Copilot).

### Key Technologies

- **Runtime:** Node.js (>=18)
- **Language:** TypeScript
- **CLI Framework:** `commander`
- **Interactive Prompts:** `@clack/prompts`
- **Build System:** `tsup`
- **Execution:** `tsx` for development

## Architecture

- `bin/install.ts`: Main entry point for the installation CLI.
- `bin/platforms/`: Platform-specific logic for mapping installation paths and transforming prompt content.
- `commands/`: The core Conductor prompt templates.
- `dist/`: Compiled JavaScript assets for distribution.

## Building and Running

### Development

- **Run Interactive Installer:** `pnpm dev`
- **Run with Flags:** `pnpm dev -- --platform copilot --dry-run`
- **Build Project:** `pnpm build`

### Installation

- **Install to all platforms:** `pnpm dlx conductor-for-all --all`
- **Install to specific platform:** `pnpm dlx conductor-for-all --platform copilot`
- **Uninstall:** `pnpm dlx conductor-for-all --uninstall`

## Development Conventions

- **Workflow:** The project itself advocates for the Conductor workflow. Use the prompts in `commands/` when developing this project.
- **Commit Messages:** Follow Conventional Commits (e.g., `feat:`, `fix:`, `docs:`).
- **Testing:** While no explicit test suite was found in the root, the README strongly recommends a Test-Driven Development (TDD) approach for all implementations.
- **ES Modules:** The project uses native ESM (`"type": "module"` in `package.json`).
- **Formatting:** Adhere to existing patterns in the codebase (2-space indentation, no semicolons in some parts of the logic but used in others—follow the file's local style).

## Key Files

- `package.json`: Project metadata, dependencies, and scripts.
- `README.md`: Comprehensive documentation on philosophy, installation, and usage.
- `bin/install.ts`: Core installation and platform transformation logic.
- `commands/*.md`: The actual "source of truth" for the AI workflows.
- `tsup.config.ts`: Configuration for the tsup bundler.
- `tsconfig.json`: TypeScript compiler configuration.
