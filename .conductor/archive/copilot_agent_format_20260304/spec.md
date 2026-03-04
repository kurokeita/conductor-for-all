# Specification: Copilot Custom Agent Frontmatter Injection

## Overview

When installing prompts to GitHub Copilot (IDE) or Copilot CLI platforms, the
installer transforms the file content to inject `name:` and `description:` fields into the YAML
frontmatter, producing the custom agent format expected by those platforms.
Source files in `commands/` remain agent-agnostic and are never modified.

## Type

Feature

## Functional Requirements

- [FR-1]: For `copilot` and `copilotCli` platforms, installed files must contain
  `name:` and `description:` frontmatter fields derived from the source file
  (e.g., `conductor-setup.md` → `name: conductor-setup`)
- [FR-2]: For `gemini` platform, installed files must be converted to TOML format
  with `.toml` extension. The TOML file must contain `description` and `prompt`
  fields, where `prompt` contains the original command content. The installed
  filenames must strip the `conductor-` prefix (e.g., `conductor-setup.md` → `setup.toml`).
- [FR-3]: If the source file has no frontmatter, a new frontmatter block is
  prepended with the `name:` and `description:` fields (for copilot/copilotCli).
- [FR-4]: If the source file already has `name:` or `description:` fields, they must not be
  overwritten (for copilot/copilotCli).
- [FR-5]: All other platforms (Antigravity, Windsurf) must continue to receive
  files as exact copies with no content modification
- [FR-6]: Dry-run mode must accurately reflect the transformation (file path
  shown as it would be written) without writing any files

## Non-Functional Requirements

- [NFR-1]: Content transformation must not alter any content outside the
  frontmatter block (for copilot/copilotCli).
- [NFR-2]: Gemini CLI TOML files must be valid TOML format.

## Acceptance Criteria

- [ ] `conductor-setup.md` installed to `.github/agents/conductor-setup.md`
  contains `name: conductor-setup` and `description:` field in frontmatter, and is not renamed.
- [ ] `conductor-setup.md` installed to `~/.copilot/agents/conductor-setup.md`
  contains `name: conductor-setup` and `description:` field in frontmatter, and is not renamed.
- [ ] `conductor-setup.md` installed to `~/.gemini/commands/conductor/setup.toml`
  contains `description` and `prompt` fields, formatted as valid TOML.
- [ ] `conductor-setup.md` installed to Antigravity/Windsurf is byte-for-byte
  identical to the source
- [ ] A source file already containing `name:` is not duplicated or overwritten

## Out of Scope

- Injecting a `mode:` or `tools:` field
- Modifying source files in `commands/`

## Dependencies

- None
