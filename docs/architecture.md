# Architecture

## Product Flow

1. User creates an account or logs in.
2. User creates a project.
3. Smart Thesis Builder generates only the next step:
   - structure
   - chapter outlines
   - small draft chunk
4. User edits and saves chapters.
5. Autosave creates chapter updates and optional version snapshots.
6. Similarity checker explains flagged lines with short suggestions.
7. Premium users export final reviewed work.

## Data Model

- `User`: account, role, premium access.
- `Project`: academic workspace.
- `Chapter`: editable document sections.
- `Version`: snapshot history for rollback.
- `PlanHistory`: paid plan records.
- `UsageEvent`: real usage and live tracking.
- `PasswordResetToken`: forgot password flow.

## Production Notes

- Replace placeholder AI suggestion logic with a provider service that enforces rate limits and logs usage.
- Add payment gateway webhook verification before activating paid plans.
- Add email provider integration for password reset delivery.
- Store uploaded data/sample files in object storage and keep database metadata only.
- Add row-level ownership checks to every project mutation before release.
