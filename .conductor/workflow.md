# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **Test-Driven Development:** Write unit tests before implementing functionality
4. **High Code Coverage:** Aim for >80% code coverage for all modules
5. **User Experience First:** Every decision should prioritize user experience
6. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for watch-mode tools (tests, linters) to ensure single execution.

## MCP Tools

### MCP Servers (always check before acting)

| Server | When to use |
| -------- | ------------- |
| **Serena** (`mcp_serena_*`) | All code navigation, symbol search, and editing. Use `find_symbol`, `get_symbols_overview`, `replace_symbol_body`, and `replace_content` instead of reading/writing entire files. Always activate the project first via `mcp_serena_activate_project`. |
| **Context7** (`mcp_context7_*`) | Fetch up-to-date documentation for any library before implementing. Always call `resolve-library-id` first, then `get-library-docs`. Consult Context7 for NodeJS, TypeScript, and Jest APIs. |
| **Sequential Thinking** (`mcp_sequential-th_sequentialthinking_*`) | Complex architectural decisions, debugging multi-system issues, or comparing approaches. Use before implementation when the solution is not immediately obvious. |

### MCP Usage Rules

- **Always check Context7** for library-specific API details before writing library-dependent code.
- **Always use Serena** for navigating and editing the codebase — never guess at file paths or symbol names.
- **Always use Sequential Thinking** for decisions with significant trade-offs or unclear root causes before writing any code.
- **Never read entire files** when Serena's symbolic tools (`get_symbols_overview`, `find_symbol`) can give you what you need.
- **Prioritize Context7 over general knowledge** when there is any conflict — library APIs change between versions.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Write Failing Tests (Red Phase):**
   - Create a new test file for the feature or bug fix.
   - Write one or more unit tests that clearly define the expected behavior and acceptance criteria for the task.
   - **CRITICAL:** Run the tests and confirm that they fail as expected. This is the "Red" phase of TDD. Do not proceed until you have failing tests.

4. **Implement to Pass Tests (Green Phase):**
   - Write the minimum amount of application code necessary to make the failing tests pass.
   - Run the test suite again and confirm that all tests now pass. This is the "Green" phase.

5. **Refactor (Optional but Recommended):**
   - With the safety of passing tests, refactor the implementation code and the test code to improve clarity, remove duplication, and enhance performance without changing the external behavior.
   - Rerun tests to ensure they still pass after refactoring.

6. **Verify Coverage:** Run coverage reports using the project's chosen tools. Target: >80% coverage for new code.

7. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

8. **Commit Code Changes:**
   - **CRITICAL:** Unless the user has explicitly requested to start implementing in "auto mode" (no commit confirmation), you must:
     1. Display a summary of all changes made.
     2. Propose a clear, concise commit message (e.g., `feat(install): Add dry-run support for copilot platform`).
     3. **PAUSE** and ask the user for permission to commit.
   - Once confirmed (or if in auto mode), stage all code changes related to the task and perform the commit.

9. **Attach Task Summary with Git Notes:**
   - **Step 9.1: Get Commit Hash:** Obtain the hash of the *just-completed commit* (`git log -1 --format="%H"`).
   - **Step 9.2: Draft Note Content:** Create a detailed summary for the completed task. Include the task name, a summary of changes, a list of all created/modified files, and the core "why" for the change.
   - **Step 9.3: Attach Note:** Use the `git notes` command to attach the summary to the commit.

     ```bash
     git notes add -m "<note content>" <commit_hash>
     ```

10. **Get and Record Task Commit SHA:**
    - **Step 10.1: Update Plan:** Read `plan.md`, find the line for the completed task, update its status from `[~]` to `[x]`, and append the first 7 characters of the commit hash.
    - **Step 10.2: Write Plan:** Write the updated content back to `plan.md`.

11. **Commit Plan Update:**
    - Stage the modified `plan.md` file.
    - Commit with a message like `conductor(plan): Mark task 'Add transformName support' as complete`.

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** Executed immediately after a task is completed that also concludes a phase in `plan.md`.

1. **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2. **Ensure Test Coverage for Phase Changes:**
   - **Step 2.1: Determine Phase Scope:** Find the starting point by reading `plan.md` for the previous phase's checkpoint SHA. If none exists, scope is all changes since the first commit.
   - **Step 2.2: List Changed Files:** Execute `git diff --name-only <previous_checkpoint_sha> HEAD`.
   - **Step 2.3: Verify and Create Tests:** For each code file in the list, verify a corresponding test file exists. If missing, create one that validates the functionality described in this phase's tasks.

3. **Execute Automated Tests with Proactive Debugging:**
   - Announce the exact shell command before running (e.g., `CI=true pnpm test`).
   - Execute the command. If tests fail, attempt to fix a **maximum of two times**. If still failing after two attempts, stop and ask the user for guidance.

4. **Propose a Detailed, Actionable Manual Verification Plan:**
   - Analyze `product.md`, `product-guidelines.md`, and `plan.md` to determine the user-facing goals of the completed phase.
   - Generate step-by-step verification instructions with commands and expected outcomes.

5. **Await Explicit User Feedback:**
   - Ask the user: "Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed."
   - **PAUSE** and await the user's response. Do not proceed without an explicit confirmation.

6. **Create Checkpoint Commit:**
   - **CRITICAL:** Unless the user has explicitly requested "auto mode," you must:
     1. Display the changes to be included in the checkpoint.
     2. Propose a checkpoint commit message (e.g., `conductor(checkpoint): Checkpoint end of Phase X`).
     3. **PAUSE** and ask the user for permission to create the checkpoint commit.
   - Once confirmed (or if in auto mode), stage all changes (or use an empty commit if none) and perform the commit.

7. **Attach Auditable Verification Report using Git Notes:**
   - Draft a verification report including the automated test command, the manual verification steps, and the user's confirmation.
   - Attach the report to the checkpoint commit using `git notes`.

8. **Get and Record Phase Checkpoint SHA:**
   - **Step 8.1: Get Commit Hash:** `git log -1 --format="%H"`
   - **Step 8.2: Update Plan:** Find the completed phase heading in `plan.md` and append the first 7 characters: `[checkpoint: <sha>]`.
   - **Step 8.3: Write Plan:** Write the updated content back to `plan.md`.

9. **Commit Plan Update:**
   - Stage the modified `plan.md`.
   - Commit with a message like `conductor(plan): Mark phase '<PHASE NAME>' as complete`.

10. **Announce Completion:** Inform the user that the phase checkpoint has been created.

### Quality Gates

Before marking any task complete, verify:

- [ ] All tests pass
- [ ] Code coverage meets requirements (>80%)
- [ ] Code follows project's code style guidelines
- [ ] All public functions/methods are documented (JSDoc comments)
- [ ] TypeScript strict mode — no `any`, types explicitly declared
- [ ] No linting or static analysis errors
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities introduced

## Development Commands

### Setup

```bash
pnpm install
```

### Daily Development

```bash
# Run installer in interactive mode (dev)
pnpm dev

# Run installer with flags
pnpm dev -- --platform copilot --dry-run

# Build dist/
pnpm build

# Lint and format check
pnpm run lint

# Auto-fix formatting
pnpm run format
```

### Testing

> ⚠️ No test framework is currently configured. When one is added, update this section and `tech-stack.md`.

```bash
# Placeholder — replace with actual test command once framework is set up
# e.g.: CI=true pnpm test
```

### Before Committing

```bash
# Build to verify compilation succeeds
pnpm build
```

## Commit Guidelines

### Message Format

<!-- markdownlint-disable MD040 -->
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```
<!-- markdownlint-enable MD040 -->

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks
- `conductor(plan)`: Track planning updates
- `conductor(checkpoint)`: Phase checkpoint commits
- `conductor(setup)`: Project context initialization

### Examples

```bash
git commit -m "feat(install): Add transformName support for per-platform filename rewriting"
git commit -m "fix(install): Ensure subdirectory is created before copying skill files"
git commit -m "chore: Bump version to 1.0.2"
```

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Unit tests written and passing
3. Code coverage meets project requirements (>80%)
4. TypeScript compiles without errors (`pnpm build`)
5. All public functions documented with JSDoc
6. Implementation notes added to `plan.md`
7. Changes committed with proper conventional commit message
8. Git note with task summary attached to the commit
