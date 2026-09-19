# ClubOps AI — PS-3

A complete, runnable prototype for the **ClubOps AI** college-club event operations platform described in the PS-3 brief.

## What is included
- Dashboard with event readiness, tasks, volunteers, risks, and recent activity
- Event planning and event CRUD
- Task management with owner, deadline, priority, status and filtering
- Volunteer management and approval status
- Meeting notes/transcript capture and AI action-item extraction
- Risk identification and risk tracking
- Document / knowledge repository UI
- Announcement drafting and review controls
- AI Assistant with event planning, task extraction, risk analysis, and announcement generation
- Settings matching the supplied ClubOps AI screenshots: club, team/roles, AI behavior, meetings/tasks/risks, notifications, knowledge base, appearance/security
- Persistent browser data using localStorage
- Express API endpoint `/api/ai` with a deterministic demo AI adapter; replace the adapter with Gemini/OpenAI/Claude when API credentials are available

## Run
Requirements: Node.js 18+

```bash
npm install
npm start
```

Open: `http://localhost:3000`

## Demo AI integration
The UI works without an API key. The server currently exposes:

`POST /api/ai`

Body:
```json
{
  "action": "meeting | risk | announcement | plan | chat",
  "input": "your prompt",
  "context": {}
}
```

For a production version, replace `demoAI()` in `server.js` with a provider adapter and keep secrets server-side.

## Suggested production upgrades
1. PostgreSQL + Prisma for multi-club persistence.
2. Auth with role-based permissions (Admin, Lead, Volunteer).
3. Object storage for uploaded documents.
4. PDF/DOCX parsing + embeddings + vector search for true RAG.
5. Calendar/email/WhatsApp integrations.
6. Background jobs for reminders and recurring risk scans.
7. Audit log for every AI action and human approval.
8. Tests and CI/CD.
