# Architecture

## Product Flow

1. User lands on public home page.
2. User logs in or signs up.
3. User chooses a plan.
4. Free plan allows only 2 monthly similarity/spell checks.
5. Paid user creates a project.
6. Smart Thesis Builder generates only the next step:
   - structure
   - chapter outlines
   - small draft chunk
7. User edits and saves chapters.
8. Autosave creates chapter updates and optional version snapshots.
9. Similarity checker explains flagged lines with short suggestions.
10. Premium users export final reviewed work.

## Data Model

- `User`: account, role, premium access.
- `Project`: academic workspace.
- `Chapter`: editable document sections.
- `Version`: snapshot history for rollback.
- `PlanHistory`: paid plan records.
- `UsageEvent`: real usage and live tracking.
- `PasswordResetToken`: forgot password flow.

## Access Rules

- `FREE`: 2 checks per month, similarity/spell only.
- `AI_TOOL`: prompt editing and writing tools.
- `SIMILARITY_CHECK`: expanded checking tools.
- `COMBO`: AI tools plus checks plus project saving.
- `PREMIUM`: full paper builder, editor, version history, and exports.

Master admin is created from `MASTER_ADMIN_EMAIL` and `MASTER_ADMIN_PASSWORD`, with the default intended email set to `charanjaydeep712@gmail.com`.

## Production Notes

- Replace placeholder AI suggestion logic with a provider service that enforces rate limits and logs usage.
- Add payment gateway webhook verification before activating paid plans.
- Add email provider integration for password reset delivery.
- Store uploaded data/sample files in object storage and keep database metadata only.
- Add row-level ownership checks to every project mutation before release.
