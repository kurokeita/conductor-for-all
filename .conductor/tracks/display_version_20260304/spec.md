# Specification: Display Version in CLI

## Overview
This track adds the capability for the `conductor-install` CLI to display its current version. The version information will be pulled dynamically from `package.json`. It will be shown as a footer when the app starts in interactive mode, and also via standard CLI flags (`-v`, `--version`) and in the `--help` output.

## Type
Feature

## Functional Requirements
- [FR-1]: Pull the version string dynamically from `package.json`.
- [FR-2]: Support `-v` and `--version` flags to print the version and exit.
- [FR-3]: Automatically include the version in the `commander` help output.
- [FR-4]: Display the version as a small footer using `picocolors` when the interactive installer starts.

## Acceptance Criteria
- [ ] Running `conductor-install --version` (or `-v`) prints the correct version from `package.json`.
- [ ] Running `conductor-install --help` displays the version number.
- [ ] Starting the app in interactive mode (no arguments) shows the version at the bottom of the initial intro/header.
- [ ] The version is not hardcoded but imported from the project metadata.

## Out of Scope
- Displaying versions of the individual prompt files.
- Automated version bumping (handled by `semantic-release`).

## Dependencies
- `package.json` (as the source of truth)
- `commander` (for flag handling)
- `picocolors` (for styling the footer)
