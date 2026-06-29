# API Endpoints

## Auth

- `POST /api/auth/register` creates an email/password account.
- `POST /api/auth/login` returns a JWT session.
- `POST /api/auth/forgot-password` creates a reset token entry.
- `PATCH /api/auth/profile` edits name and email.
- `DELETE /api/auth/account` deletes the user when `confirm` is `DELETE`.

## Billing

- `GET /api/billing/plans` returns plan catalog.
- `POST /api/billing/subscribe/:plan` records a plan purchase. Supported plan keys: `FREE`, `AI_TOOL`, `SIMILARITY_CHECK`, `COMBO`, `PREMIUM`.

## Projects

- `GET /api/projects` lists the user's projects with chapters and latest versions.
- `POST /api/projects` creates a project.
- `POST /api/projects/:projectId/chapters` creates a chapter.
- `PATCH /api/projects/chapters/:chapterId` updates chapter content.
- `POST /api/projects/:projectId/versions` saves a project snapshot.

## Thesis Builder

- `POST /api/thesis/structure` generates the first thesis structure step.
- `POST /api/thesis/outlines` generates chapter outlines.
- `POST /api/thesis/draft` generates a small section draft chunk.

The builder intentionally separates steps so users edit before continuing.

## Tools

- `POST /api/tools/similarity` returns line-by-line similarity and AI-likeness explanations.
- `POST /api/tools/spell-check` returns basic spelling review suggestions and counts against the free monthly limit.
- `POST /api/tools/ai-action` records AI usage and returns a review suggestion placeholder.
- `POST /api/tools/export/pdf` downloads PDF.
- `POST /api/tools/export/docx` downloads DOCX.
- `POST /api/tools/export/md` downloads Markdown.
- `POST /api/tools/export/html` downloads HTML.

## Admin

Admin routes require an authenticated user with role `ADMIN`.

- `GET /api/admin/users` lists users and counts.
- `PATCH /api/admin/users/:userId/premium` grants or revokes premium.
- `PATCH /api/admin/users/:userId/reset-password` sets a temporary password.
- `GET /api/admin/metrics` returns active users, AI usage, documents created, and live sessions from stored data.

## WebSockets

Socket.IO runs on the backend server.

- `presence:update` broadcasts active socket count.
- `usage:track` accepts lightweight client usage events.
