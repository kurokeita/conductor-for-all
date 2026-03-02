# Universal Conductor Prompts

**Measure twice, code once.**

Universal, agent-agnostic prompts that bring [Conductor](https://github.com/gemini-cli-extensions/conductor)'s Context-Driven Development workflow to any AI coding agent — GitHub Copilot, Windsurf, Antigravity.

## Philosophy

Instead of just asking an AI to write code, these prompts enforce a consistent, high-quality lifecycle for every task:

<!-- markdownlint-disable MD040 -->
```
Context → Spec & Plan → Implement → Review
```
<!-- markdownlint-enable MD040 -->

By treating project context as a managed artifact alongside your code, you transform your repository into a single source of truth that drives every AI interaction with deep, persistent project awareness.

## Prompts

| Prompt | Purpose | When to Use |
| -------- | --------- | ------------- |
| [setup](commands/conductor-setup.md) | Analyze project, define product/tech/workflow context | Once per project (or to update context) |
| [planning](commands/conductor-planning.md) | Create spec + implementation plan for a feature/bug | Starting new work |
| [implement](commands/conductor-implement.md) | Execute tasks from a plan with TDD workflow | Active development |
| [review](commands/conductor-review.md) | Review completed work against standards | After implementation |
| [status](commands/conductor-status.md) | Show progress overview | Anytime during development |

## Workflow

### 1. Initialize Your Project (Run Once)

Use the **setup** prompt to set up your project context. This creates the `conductor/` directory with:

<!-- markdownlint-disable MD040 -->
```
conductor/
├── index.md                 # Master index of all context files
├── product.md               # Product definition and goals
├── product-guidelines.md    # Design/UX/prose standards
├── tech-stack.md            # Languages, frameworks, tools
├── workflow.md              # Development lifecycle (TDD, commits, etc.)
├── tracks.md                # Registry of all tracks (features/bugs)
└── tracks/                  # Track-specific artifacts
```
<!-- markdownlint-enable MD040 -->

### 2. Plan a Feature or Bug Fix

Use the **planning** prompt to create a new track. The agent will:

- Ask clarifying questions about your feature/bug
- Generate a detailed specification (`spec.md`)
- Generate an actionable implementation plan (`plan.md`)
- Create track artifacts in `conductor/tracks/<track_id>/`

### 3. Implement the Track

Use the **implement** prompt to execute the plan. The agent will:

- Select the next pending task from `plan.md`
- Follow your workflow (TDD by default: Write Tests → Implement → Verify)
- Commit code with conventional commit messages
- Update progress in `plan.md`
- Run phase verification checkpoints

### 4. Review the Work

Use the **review** prompt to verify completed work. The agent will:

- Check compliance with the spec, plan, and style guides
- Run the test suite
- Scan for security issues
- Output a structured review report with severity-rated findings

### 5. Check Progress

Use the **status** prompt anytime to get a dashboard view of:

- Track progress (completed/in-progress/pending)
- Current phase and task
- Recommended next action

## Installation

A built-in CLI syncs all prompts to the right location for each platform.

```bash
# Install to all platforms
pnpm dlx conductor-for-all --all

# Install to specific platform(s)
pnpm dlx conductor-for-all --platform copilot
pnpm dlx conductor-for-all --platform copilot,antigravity

# Preview without writing anything
pnpm dlx conductor-for-all --platform copilot --dry-run

# Remove installed prompts
pnpm dlx conductor-for-all --platform copilot --uninstall

# Interactive mode (no flags)
pnpm dlx conductor-for-all
```

> Works with any package manager: `npx conductor-for-all`, `bunx conductor-for-all`

| Platform | Prompts installed to |
| :--- | :--- |
| `antigravity` | `~/.gemini/antigravity/global_workflows` |
| `copilot` | `.github/prompts` |
| `copilot CLI` | `~/.copilot/skills` |
| `windsurf` | `~/.codeium/windsurf/global_workflows` |

Or clone and run locally:

```bash
git clone https://github.com/kurokeita/conductor-for-all
cd conductor-for-all
pnpm install
pnpm dev           # interactive mode
pnpm dev -- --platform copilot --dry-run
```

## Usage by Agent

### GitHub Copilot (VS Code / CLI)

After running `conductor-for-all --platform copilot`, prompts are installed to `~/.copilot/prompts/` and discoverable globally across all workspaces. Reference them in VS Code chat:

<!-- markdownlint-disable MD040 -->
```
# In VS Code chat
@workspace Use the setup prompt to set up this project
```
<!-- markdownlint-enable MD040 -->

### Windsurf

Copy or symlink the prompt files into your Windsurf configuration, or paste the prompt content directly into a conversation.

### Cursor

Reference the prompt files directly or add them to your `.cursor/rules/` directory.

### Any Other Agent

These are plain Markdown files. You can:

1. **Paste the content** directly into a chat session
2. **Reference the file** if the agent supports file references (e.g., `@file:commands/conductor-planning.md`)
3. **Include in system instructions** if the agent supports custom instructions

## Resume Capability

All prompts support **automatic resume** if a session is interrupted (crash, timeout, context loss, switching agents):

| Prompt | Resume mechanism | State tracked in |
| -------- | ----------------- | ------------------ |
| **setup** | Tracks which setup step was last completed and skips ahead | `conductor/setup_state.json` |
| **planning** | Detects partially created tracks (spec exists but no plan, etc.) | `conductor/tracks/<id>/metadata.json` (`status: "planning"`) |
| **implement** | Detects `[~]` markers in `tracks.md` and `plan.md` to find interrupted tasks; checks for uncommitted changes | `conductor/tracks.md` + `plan.md` markers + `git status` |
| **review** | Detects tracks with reviewing status and incomplete review fix tasks | `conductor/tracks/<id>/metadata.json` (`status: "reviewing"`) |
| **status** | Stateless — always reads current state fresh | N/A |

The resume check runs automatically as **Step 0** of each prompt. If interrupted work is found, the agent will ask whether to resume or start fresh.

## Generated Artifacts

| File | Created By | Purpose |
| ------ | ----------- | --------- |
| `conductor/product.md` | setup | Product vision, users, goals |
| `conductor/product-guidelines.md` | setup | Design/UX/prose standards |
| `conductor/tech-stack.md` | setup | Technical decisions |
| `conductor/workflow.md` | setup | Development lifecycle rules |
| `conductor/tracks.md` | planning | Registry of all tracks |
| `conductor/tracks/<id>/spec.md` | planning | Track specification |
| `conductor/tracks/<id>/plan.md` | planning | Track implementation plan |
| `conductor/setup_state.json` | setup | Resume state for setup process |
| `conductor/tracks/<id>/metadata.json` | planning | Track metadata and resume state |

## Credits

Inspired by [Conductor](https://github.com/gemini-cli-extensions/conductor) by Google — a Gemini CLI extension for Context-Driven Development.

These prompts distill Conductor's methodology into portable, agent-agnostic Markdown that works with any AI coding assistant.
