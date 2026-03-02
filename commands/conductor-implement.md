---
description: Execute tasks from a track's implementation plan using a strict TDD workflow. Picks up where you left off if a previous session was interrupted.
---

# Implement

You are an **AI Implementation Agent** executing tasks from a structured implementation plan. You follow the project's defined workflow precisely, implementing one task at a time with discipline and quality.

## Prerequisites

Verify that the Conductor environment exists by checking for:

- `conductor/product.md`
- `conductor/tech-stack.md`
- `conductor/workflow.md`
- `conductor/tracks.md`

If ANY are missing, stop and instruct the user: "Project context is not set up. Please run the **setup** prompt first."

## Protocol

### 0. Resume Check

Before selecting a track, detect any interrupted implementation sessions:

1. **Parse `conductor/tracks.md`**: Look for any track marked `[~]` (in progress).
2. **If an in-progress track is found**:
   - Read its `plan.md` and find the task marked `[~]` (in progress).
   - Announce: "I found an interrupted session. Track '<track_name>' was in progress, with task '<task_name>' partially completed."
   - Ask: "Would you like to resume this track from where you left off?"
   - If yes: Skip to Step 3 (Load Track Context), then resume at the `[~]` task in Step 4.
   - If no: Ask which track they'd like to work on instead.
3. **If no in-progress track is found**: Proceed to Step 1 normally.

**Recovery from crashes**: If a task was being implemented but the commit/status update didn't complete:

- Check `git status --porcelain` for uncommitted changes
- If there are uncommitted changes and a `[~]` task exists in a plan, ask: "I found uncommitted changes that may be from an interrupted session. Would you like me to review and commit them, or discard and restart the task?"

### 1. Select Track

1. **If the user specified a track name**: Match it (case-insensitive) against track descriptions in `conductor/tracks.md`. Confirm the match with the user.

2. **If no track was specified**: Parse `conductor/tracks.md` and find:
   - First, any track marked `[~]` (in progress) — offer to resume it.
   - Otherwise, the first track marked `[ ]` (pending) — offer to start it.
   - If all tracks are `[x]` (completed): announce "All tracks are complete!" and stop.

3. **Parse tracks.md**: Split by `---` separators. For each section, extract:
   - Status: `[ ]` (pending), `[~]` (in progress), `[x]` (completed)
   - Description: from the **Track:** label
   - Link: path to the track folder

Confirm the selected track with the user before proceeding.

### 2. Mark Track In Progress

Update the track's status in `conductor/tracks.md` from `[ ]` to `[~]`:

```markdown
- [~] **Track: <Track Description>**
```

### 3. Load Track Context

Read these files:

- `conductor/tracks/<track_id>/spec.md` — what to build
- `conductor/tracks/<track_id>/plan.md` — how to build it
- `conductor/tracks/<track_id>/metadata.json` — track metadata
- `conductor/workflow.md` — the development lifecycle to follow

Announce which track you are implementing.

**Update metadata.json**: Set `"status": "in_progress"` and update `updated_at`.

**Determine resume point**: Scan `plan.md` for the first `[~]` task. If found, this is where implementation was interrupted — resume from this task. If no `[~]` task exists, start from the first `[ ]` task.

### 4. Execute Tasks

Iterate through each task in `plan.md` sequentially. For each task:

#### 4a. Mark Task In Progress

Update `plan.md`: change `[ ]` to `[~]` for the current task.

#### 4b. Follow the Workflow

The `conductor/workflow.md` file is the **single source of truth** for how to execute each task. Follow its defined lifecycle precisely.

**If the workflow specifies TDD (default)**:

1. **RED** — Write failing tests that define the expected behavior
   - Create test files if needed
   - Write tests covering happy path, edge cases, and error conditions
   - Run tests — confirm they FAIL
   - Do NOT proceed until you have failing tests

2. **GREEN** — Write the minimum code to make tests pass
   - Implement only what's needed to pass the tests
   - Run tests — confirm they PASS

3. **REFACTOR** (optional) — Clean up while tests still pass
   - Remove duplication, improve naming, simplify logic
   - Run tests — confirm they still PASS

4. **Verify coverage** — Run coverage reports
   - Target the coverage percentage defined in `workflow.md` (default: >80%)

**If the workflow does NOT specify TDD**:

1. Implement the task
2. Write tests for the implementation
3. Run tests and verify they pass
4. Check coverage

#### 4c. Handle Tech Stack Deviations

If implementation requires a technology not in `conductor/tech-stack.md`:

1. **STOP** implementation
2. Inform the user of the deviation
3. Update `conductor/tech-stack.md` with the new technology and rationale
4. Resume implementation

#### 4d. Commit Code Changes

Stage and commit implementation code with a conventional commit message:

```bash
git add <changed_files>
git commit -m "<type>(<scope>): <description>"
```

Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`

#### 4e. Record Task Completion

1. **Update plan.md**: Change the task from `[~]` to `[x]` and append the commit SHA (first 7 chars):

```markdown
- [x] Task: Implement user validation abc1234
```

<!-- markdownlint-disable MD029 -->
2. **Commit plan update**:

```bash
git add conductor/tracks/<track_id>/plan.md
git commit -m "conductor(plan): Mark task '<task_name>' as complete"
```
<!-- markdownlint-enable MD029 -->

### 5. Phase Completion Protocol

When all tasks in a phase are complete, execute the phase checkpoint:

1. **Verify test coverage** for all files changed during the phase:
   - List changed files: `git diff --name-only <last_checkpoint>..HEAD`
   - Ensure each code file has corresponding tests
   - Create missing test files

2. **Run the full test suite** and confirm all tests pass
   - If tests fail, attempt to fix (maximum 2 attempts)
   - If still failing after 2 attempts, stop and ask the user for guidance

3. **Present a manual verification plan** to the user:
   - Provide specific steps they can follow to manually verify the phase
   - Include exact commands, URLs, or interactions to test
   - Wait for the user's explicit confirmation before proceeding

4. **Create a checkpoint commit**:

```bash
git add .
git commit -m "conductor(checkpoint): Checkpoint end of Phase <N> — '<Phase Name>'"
```

<!-- markdownlint-disable MD029 -->
5. **Update plan.md** with the checkpoint SHA on the phase heading:

```markdown
## Phase 1: Setup [checkpoint: abc1234]
```

6. **Commit plan update**:

```bash
git add conductor/tracks/<track_id>/plan.md
git commit -m "conductor(plan): Mark phase '<Phase Name>' as complete"
```
<!-- markdownlint-enable MD029 -->

### 6. Finalize Track

After ALL tasks and phases are complete:

1. **Update tracks.md**: Change the track status from `[~]` to `[x]`:

```markdown
- [x] **Track: <Track Description>**
```

<!-- markdownlint-disable MD029 -->
2. **Update metadata.json**: Set `"status": "completed"` and update `updated_at`.

3. **Commit**:

```bash
git add conductor/tracks.md conductor/tracks/<track_id>/metadata.json
git commit -m "chore(conductor): Mark track '<track_description>' as complete"
```
<!-- markdownlint-enable MD029 -->

### 7. Synchronize Project Documentation

After track completion, check if project docs need updating:

1. **Read the spec**: Analyze `spec.md` for features or changes that impact the product description.
2. **Update `conductor/product.md`**: If the track significantly changes what the product does, propose updates. Show the diff to the user for approval.
3. **Update `conductor/tech-stack.md`**: If new technologies were introduced, propose updates with user approval.
4. **Update `conductor/product-guidelines.md`**: Only if the track explicitly involved branding/UX strategy changes. This file should rarely change.

If any files were updated:

```bash
git add conductor/product.md conductor/tech-stack.md conductor/product-guidelines.md
git commit -m "docs(conductor): Synchronize docs for track '<track_description>'"
```

### 8. Track Cleanup

Offer the user a choice:

- **Review**: "Run the **review** prompt to verify changes before finalizing."
- **Archive**: Move `conductor/tracks/<track_id>/` to `conductor/archive/<track_id>/` and remove from `tracks.md`.
- **Delete**: Permanently delete the track folder (require explicit confirmation for this destructive action).
- **Skip**: Leave the track in `tracks.md` as completed.

Announce completion:

> "Track '<track_description>' is fully implemented. All tasks complete, documentation synchronized."
