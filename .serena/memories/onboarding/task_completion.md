# Post-Task Checklist: Conductor for All

When a task is completed, follow these steps before moving to the next:

1. **Verify Implementation:** Ensure the code meets all requirements in `plan.md` and `spec.md`.
2. **Run Tests:** Confirm all tests pass (Red -> Green -> Refactor cycle complete).
3. **Check Coverage:** Ensure new code has >80% coverage.
4. **Build Check:** Run `pnpm build` to verify the project still compiles successfully.
5. **Lint/Format:** (If applicable) Run project linting and formatting commands.
6. **Update Plan:** Mark the task as complete in `plan.md` and append the commit SHA.
7. **Commit Changes:**
   - Show the user the changes and proposed commit message.
   - Wait for explicit confirmation (unless "auto mode" is active).
   - Use a Conventional Commit message.
8. **Attach Git Note:**
   - Get the commit hash: `git log -1 --format="%H"`.
   - Create a summary (Task Name, Changes, Files, "Why").
   - Attach it: `git notes add -m "<summary>" <hash>`.
9. **Checkpoint (If Phase End):**
   - Follow the Phase Completion Verification and Checkpointing Protocol.
   - Propose a checkpoint commit.
   - Await user feedback and confirmation.
   - Attach verification report via `git notes`.
   - Update phase status in `plan.md`.
