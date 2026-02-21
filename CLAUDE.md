# Claude Code Instructions

## Critical Rules

### Never Delete Files Without Asking

**Even with bypass permissions enabled, ALWAYS ask before deleting:**

- Untracked files that were NOT created during this working session
- Any files/folders that existed before you started working

**NEVER run these commands without explicit user approval:**

- `git clean -fd` - Permanently deletes untracked files (bypasses Recycle Bin)
- `git clean -f` - Same as above
- `git reset --hard` - Discards all uncommitted changes
- `rm -rf` on directories you didn't create this session

**Before reverting/undoing work:**

1. Run `git status` to see what's tracked vs untracked
2. Run `git clean -fdn` (dry run) to LIST what would be deleted
3. Identify which files YOU created this session vs pre-existing user files
4. Show the user the list of PRE-EXISTING files that would be affected
5. ASK for confirmation before proceeding
6. Only delete files you created; leave user's pre-existing files alone

**Safe alternatives:**

- To undo tracked file changes only: `git checkout .` (leaves untracked files alone)
- To undo a specific file: `git checkout -- <file>`
- To unstage: `git reset HEAD <file>`

### Why This Matters

On 2026-02-20, I deleted the user's `prototype/`, `screenshots/`, `docs/`, and `DESIGN.md` folders by running `git clean -fd` without checking what untracked files existed. These files were permanently lost. This was careless and avoidable.

## Project-Specific Notes

- User prefers buttons (X/heart) over swipe gestures for the discover interface
- Check `prototype/` and `screenshots/` folders for design references before implementing UI
