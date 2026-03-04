# Product Guidelines

## Prose Style

- **Tone**: Direct, professional, and instructional. No fluff or filler phrases.
- **Voice**: Imperative for instructions ("Use the setup prompt to…", "Run once per project").
  Declarative for descriptions ("This creates the `.conductor/` directory with…").
- **Formality**: Technical but approachable. Assume a developer audience; no need to over-explain fundamentals.
- **Emphasis**: Use **bold** to highlight key terms, action words, and critical warnings. Use `code formatting` for all file names, directories, commands, flags, and values.
- **Sentence length**: Prefer short, scannable sentences. Break long explanations into bullet points or numbered steps.
- **Emojis**: Avoid in documentation and prompt files. Acceptable only in CLI output where they aid scannability (e.g., `✓`, spinners).

## Branding

- **Product name**: "Universal Conductor Prompts" in long form; `conductor-for-all` in CLI/package contexts.
- **Tagline**: *"Measure twice, code once."*
- **Package name**: `@kurokeita/conductor-for-all`
- **CLI binary**: `conductor-install`
- **Naming conventions**:
  - Prompt/command files: `conductor-<verb>.md` (kebab-case)
  - Generated context files: `<noun>.md` (kebab-case, no prefix)
  - Track directories: `<track_id>/` (kebab-case slug)
  - JSON state files: `<noun>_state.json` (snake_case)
  - TypeScript source: camelCase variables, PascalCase interfaces/types
  - Git commit types: conventional commits (`feat`, `fix`, `docs`, `chore`, `conductor(plan)`, etc.)

## UX Principles

- **Safety first**: All destructive or write operations must support a `--dry-run` flag that previews changes without writing.
- **Resume over restart**: Any multi-step process must persist state so it can resume after interruption without repeating completed work.
- **Progressive disclosure**: Present defaults first; offer customization only when the user opts in (Interactive vs. Autogenerate pattern).
- **Explicit confirmation**: Pause and await user confirmation at the end of each collaborative step before writing files or moving forward.
- **Actionable next steps**: Every terminal state (completion, error, halt) must tell the user exactly what to do next.
- **Platform-agnostic content**: Prompt file content must not contain agent-specific syntax. Platform differences are handled by the installer, not the prompts.

## Error Handling

- **Be specific**: Error messages must name the missing file, invalid value, or failed operation.
  - ✓ `Unknown platform(s): foobar. Valid: antigravity, copilot, copilotCli, windsurf`
  - ✗ `Invalid input.`
- **Be actionable**: Always tell the user what to do to resolve the error.
  - ✓ `Project context is not set up. Please run the **setup** prompt first.`
  - ✗ `Context missing.`
- **Fail loudly, exit cleanly**: Use `process.exit(1)` on unrecoverable CLI errors after logging with `p.log.error(...)`. Never swallow errors silently unless explicitly documented (e.g., removing a file that may not exist).
- **Warn, don't crash**: For non-critical issues (e.g., a platform directory doesn't exist during uninstall), log a warning and skip gracefully.
