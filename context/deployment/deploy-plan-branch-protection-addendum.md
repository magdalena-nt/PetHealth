# Deployment plan amendment: branch protection

Date: 2026-11-20

This amendment supersedes the branch-protection requirements in `deploy-plan.md`. The original plan remains an unchanged historical snapshot. Read both documents when executing the deployment; all other requirements and approval gates remain in effect.

## Decision and risk

The owner cannot enforce branch protection on the current private GitHub repository and has removed it as a deployment prerequisite. Do not change repository visibility or GitHub plans to satisfy the original requirement. Do not remove any unrelated existing protections without owner approval.

Use feature branches and pull requests into `master` as a manual practice, not an enforced restriction. GitHub does not prevent authorized users from pushing directly, force-pushing, or deleting `master` in the absence of applicable protection. Cloudflare Workers Builds deploys updates to `master`, including direct pushes, not just PR merges. Restrict repository access and avoid direct or force pushes and deletion as an operational practice; these are not technical guarantees. If an unintended update occurs, stop pushes and disable or disconnect Builds before recovery as described in the original plan.

## Overrides to the original plan

- **Requirements, scope and gates:** Remove the requirement to enforce PR-only updates, block direct or force pushes and branch deletion, and prohibit bypass actors. Continue to prepare changes through a feature branch and PR, run the prescribed manual checks, and obtain the existing approvals before merges and production automation.
- **Manual Setup, section 2:** Omit the branch-protection setup, availability and enforcement checks, and the instruction to stop when protection is unavailable. The owner's reported state is that no branch-protection rules are configured. Continue to confirm repository access, disable GitHub Actions before any planned push, inspect and preserve any unrelated existing rules or required checks, and resolve conflicts only with owner approval.
- **Manual Setup, section 6:** Replace references to a protected PR merge and enforced PR protection with an approved PR merge performed as a manual practice. Before connecting Builds, still confirm the approved revision on `master`, disabled Actions, Worker settings, preview validation and manual checks as specified in the original plan. Connecting Builds may deploy immediately; obtain the separate required approval first.
- **Technical Design:** The diagram's `master` update is unprotected. Replace the PR-protection enforcement instructions with the manual PR practice above while retaining Actions shutdown, workflow removal, inspection of existing rules and checks, and the other original safeguards.
- **Support and recovery:** Do not stop merely because branch protection is unavailable. If an unintended direct push or other unexpected update occurs, stop pushes, disable or disconnect Builds, and follow the original recovery and approval procedures; do not force-push or reset as a workaround.
- **Testing:** Remove the direct-push rejection test and all claims that branch protection or rejection has been verified. Do not test by pushing to `master` merely to demonstrate the absence of protection. Retain all other local, hosted and deployment validation.
- **Delivery Steps:** In Step 1, omit protection setup, enforcement and direct-push rejection checks; retain the account-access, Actions shutdown, workflow-removal and feature-branch tasks. In Step 5, document the manual PR practice, the lack of enforced branch protection and the risk that any `master` update can deploy; do not describe the branch or merge as protected. In Step 6, retain the original checks, owner actions and explicit production approvals without requiring branch protection.