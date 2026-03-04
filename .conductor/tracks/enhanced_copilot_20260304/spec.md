# Specification: Enhanced Copilot Integration and Agent Interoperability

## Overview
This track enhances the GitHub Copilot integration by supporting additional installation modes (Prompts and Skills) and introducing a cross-agent awareness system ("Network of Agents") to facilitate workflow transitions.

## Type
Feature

## Functional Requirements
- **[FR-1] Update Copilot IDE Agents**: Change installation path to local `.github/agents/`.
- **[FR-2] Add Copilot IDE Prompts**: Support installation to local `.github/prompts/` with `.prompt.md` extension.
- **[FR-3] Add Copilot CLI Skills**: Support installation to global `~/.copilot/skills/<name>/SKILL.md`.
- **[FR-4] Agent Interoperability**: Update core prompts in `commands/` to include a "Network of Agents" section. This section will define the role of other Conductor agents and direct the user to switch when appropriate.
- **[FR-5] Installer Updates**:
    - Update `PLATFORMS` registry with new Copilot modes.
    - Ensure the CLI can handle both local (project-relative) and global (home-relative) destination paths.

## Acceptance Criteria
- [ ] `conductor-install --platform copilot` installs to `./.github/agents/`.
- [ ] `conductor-install --platform copilot-prompts` installs to `./.github/prompts/*.prompt.md`.
- [ ] `conductor-install --platform copilot-skills` installs to `~/.copilot/skills/<agent-name>/SKILL.md`.
- [ ] All 5 Conductor agents contain a section directing users to relevant subsequent agents.
- [ ] `pnpm build` succeeds.
- [ ] Manual verification confirms files are created in the correct structures.

## Out of Scope
- Automated switching via API.
- Support for other IDEs (Cursor, Windsurf) outside of their current implementation.
