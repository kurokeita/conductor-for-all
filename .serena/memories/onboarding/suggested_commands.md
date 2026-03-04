# Suggested Commands for Conductor for All

## Development

- `pnpm dev`: Run the installer in interactive mode (using `tsx`).
- `pnpm dev -- --platform copilot --dry-run`: Run with flags for testing without side effects.
- `pnpm build`: Compile the TypeScript source code to `dist/` using `tsup`.

## Installation & Maintenance

- `pnpm dlx conductor-for-all --all`: Install prompts for all supported platforms.
- `pnpm dlx conductor-for-all --platform <platform>`: Install for specific platforms (e.g., `copilot`, `gemini`).
- `pnpm dlx conductor-for-all --uninstall`: Remove installed prompts.

## Git & Workflow

- `git status`: Check the state of the working directory.
- `git add . && git commit -m "<message>"`: Stage and commit changes (follow Conventional Commits).
- `git log -n 5`: View the last 5 commit messages.
- `git notes add -m "<summary>" $(git log -1 --format="%H")`: Attach a task summary to the latest commit.
- `git diff HEAD`: Review all changes since the last commit.

## System Utils (Darwin)

- `ls -R`: List files recursively.
- `grep -r "pattern" .`: Search for a pattern recursively.
- `find . -name "*.ts"`: Find files matching a pattern.
- `cat <file>`: Read a file's content.
