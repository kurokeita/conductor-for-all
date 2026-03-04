# Product Definition

## Overview

**Universal Conductor Prompts** is a CLI installer and prompt collection that brings
Context-Driven Development (CDD) to any AI coding agent — GitHub Copilot, Windsurf,
and Antigravity. It is published as the npm package `@kurokeita/conductor-for-all`.

## Target Users

- Developers using AI coding agents who want a structured, repeatable development workflow
- Teams adopting AI-assisted development and wanting shared context across sessions

## Core Goals

1. Make high-quality, consistent AI-assisted development accessible across all major agents
2. Treat project context (product, tech stack, workflow) as a managed artifact alongside code
3. Enforce a structured lifecycle: Context → Spec & Plan → Implement → Review

## Key Features

- **Installer CLI** (`conductor-install`): copies prompt files to the correct location for
  each target agent platform (Antigravity, GitHub Copilot, GitHub Copilot CLI, Windsurf)
- **Prompt collection** (`commands/`): five prompts — setup, planning, implement, review, status
- **Platform-aware file transformation**: each platform receives files in the format it expects
  (e.g., `.prompt.md` for Copilot, `<name>/SKILL.md` for Copilot CLI)
- **Multi-platform install**: install to one or all platforms in a single command

## Constraints

- Node.js >= 18 required
- Distributed as an ESM-only npm package
- Prompt files must remain agent-agnostic in content (no platform-specific syntax in source)
