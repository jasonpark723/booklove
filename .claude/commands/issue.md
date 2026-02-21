# Issue Management Skill

Manage GitHub issue workflow transitions. Parse the argument to determine the action.

## Argument Format
`<action> <issue-number> [options]`

## Actions

### `start <number>`
Start working on an issue:
1. Assign issue to current user (`gh issue edit <number> --add-assignee @me`)
2. Remove any existing status labels (`needs-review`, `ready`)
3. Add `in-progress` label
4. Create and checkout a new branch: `issue-<number>-<slug>` where slug is derived from issue title (lowercase, hyphens, max 30 chars)
5. Confirm the transition

### `pr <number>`
Create a PR for the issue:
1. Ensure there are commits to push
2. Push current branch to origin with `-u` flag
3. Create PR with `gh pr create` linking to the issue (use "Closes #<number>" in body)
4. Remove `in-progress` label, add `in-review` label
5. Return the PR URL

### `qa-pass <number>`
Mark issue as QA passed:
1. Remove `in-review` label
2. Add `qa` label
3. Confirm ready for merge

### `merge <number>`
Merge the PR and complete the issue:
1. Find PR linked to issue
2. Merge PR with `gh pr merge --squash`
3. Issue auto-closes via "Closes #X" in PR
4. Delete the feature branch locally and remotely
5. Checkout main and pull latest

### `status [number]`
Show issue status:
- If number provided: Show that issue's labels, assignee, linked PRs
- If no number: List all open issues with their status labels

### `review-done <number>`
Mark issue as reviewed and ready for dev:
1. Remove `needs-review` label
2. Add `ready` label

### `ready-check <number>`
Check if an issue is ready to be worked on:
1. Fetch issue details (title, body, labels, comments)
2. Display the issue summary
3. Ask the user to confirm the following checklist:
   - **Requirements gathered**: Are all requirements clearly defined and understood?
   - **No gaps**: Are there any missing details, edge cases, or unknowns that need clarification?
   - **Acceptance criteria complete**: Does the acceptance criteria cover all expected behaviors and edge cases?
4. If all checks pass, confirm the issue is ready for development
5. If any checks fail, list what needs to be addressed before starting work

### `complete <number>`
Complete an issue with direct commit to master (no PR):
1. Ensure there are changes to commit (staged or unstaged)
2. Stage all relevant changes
3. Commit with message referencing the issue (include "Closes #<number>")
4. Push directly to master
5. Close the issue via the commit message
6. Confirm completion

## Label Colors Reference
- `needs-review`: #d876e3 (purple)
- `ready`: #0e8a16 (green)
- `in-progress`: #fbca04 (yellow)
- `in-review`: #1d76db (blue)
- `qa`: #c5def5 (light blue)

## Workflow Summary
```
needs-review → ready → in-progress → (closed)
     ↑           ↑     ↑     ↑           ↑
  (created)  review-done |  start     complete (direct to master)
                         |
                    ready-check (optional)

PR workflow (optional):
  in-progress → in-review → qa → (closed)
       ↑            ↑        ↑       ↑
      pr         (review)  qa-pass  merge
```

## Error Handling
- If issue doesn't exist, show error
- If label already exists on issue, skip silently
- If branch already exists, checkout existing branch
- Always show current state after transition

## Example Usage
```
/issue ready-check 3
/issue start 3
/issue complete 3      # Direct commit to master (recommended for personal projects)
/issue pr 3            # Create PR (for team projects)
/issue qa-pass 3
/issue merge 3
/issue status
/issue status 3
```
