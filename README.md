# ThesisMate

ThesisMate is a professional AI-assisted academic writing workspace for thesis and report drafting. It is designed around step-by-step human review: users generate structure, then chapter outlines, then small editable draft chunks.

## Features 

- Public home page explaining the product before login.
- Login/sign-up flow before showing the user workspace.
- Plan-based feature access:
  - Free: 2 similarity/spell checks per month only.
  - Paid plans: AI editing, paper builder, project saving, exports depending on plan.
- Smart Thesis Builder with topic, domain, objective, keywords, optional data file, and optional sample file input.
- Smart Editor with formatting controls, AI sidebar actions, table/figure/flowchart placeholders, autosave-ready model, and export actions.
- Project system with chapters, autosave snapshots, and version history.
- Email/password authentication, profile edit, password reset entry point, delete account confirmation, plan history, and usage history schema.
- Pricing plans: AI Tool ₹250, Similarity Check ₹250, Combo ₹399, Premium ₹2500.
- Premium unlock model for full editor, thesis builder, and export system.
- Export endpoints for PDF, DOCX, Markdown, and HTML.
- Admin APIs for users, premium grants/revokes, password reset, and real-time metrics.
- WebSocket live user tracking and API usage tracking.
- Similarity and AI-likeness checker with expandable line-by-line explanations.

## User Flow

1. User visits the home page and understands the platform.
2. User logs in or signs up.
3. User selects a free or paid plan.
4. Free user can run 2 monthly similarity/spell checks only.
5. Paid user can create a paper by entering:
   - paper title
   - topic description
   - domain
   - keywords
   - required format
   - whether the user provides outline or ThesisMate creates it
   - figure/table/flowchart descriptions and placement notes
6. ThesisMate creates the outline first.
7. User approves or edits the outline.
8. ThesisMate creates the paper section by section.
9. User edits manually or gives prompts to the editor.
10. User runs checks and exports the final document.

The platform should never promise guaranteed `0% plagiarism`, `0% AI detection`, or bypassing detection systems. It can help reduce similarity risk, improve originality, and explain AI-like patterns.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Lucide icons.
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Socket.IO.
- Security: Helmet, CORS controls, rate limiting, bcrypt password hashing, JWT sessions.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set `DATABASE_URL` and `JWT_SECRET`.

For the master admin account, set:

```bash
MASTER_ADMIN_EMAIL="charanjaydeep712@gmail.com"
MASTER_ADMIN_PASSWORD="your-secure-password"
```

The password is hashed before storage and should not be hardcoded in source files.

3. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

4. Start backend:

```bash
npm run server:dev
```

5. Start frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend runs at `http://localhost:4000`.

## Deployment

Recommended production setup:

- Frontend: Vercel, Netlify, or any static host from `npm run build`.
- Backend: Render, Railway, Fly.io, or a VPS Node process.
- Database: Managed PostgreSQL.

Production steps:

1. Set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.
2. Run `npm run db:generate`.
3. Run Prisma migrations against production database.
4. Build frontend with `npm run build`.
5. Build backend with `npm run server:build`.
6. Serve frontend static assets and run `npm start` for the API.

## Ethics and Safety

The product does not claim plagiarism guarantees or AI detection bypassing. Similarity and AI-likeness outputs are writing-assistance signals only. Users should verify citations, sources, and institutional requirements before submission.
