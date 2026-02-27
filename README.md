social_publish

Multi-provider publishing skill for OpenClaw.

Purpose
-------
Build a reusable OpenClaw skill to publish media and posts to LinkedIn and YouTube (upload videos, create posts, share links). Expose a simple agent-facing command (e.g. /publish) with options for provider selection and scheduling.

Repository layout
-----------------
- skill/
  - SKILL.md          # skill manifest and usage docs
  - src/              # implementation code (node)
  - tests/            # unit/integration tests
  - examples/         # example calls and scripts
- infra/              # deployment or config helpers
- docs/               # design notes and API contracts

Workflow
--------
1. Add credentials to 1Password (item template provided in SKILL.md).
2. Implement provider adapters for LinkedIn and YouTube.
3. Expose agent-callable endpoints: publish(post), upload(video), schedule(post).
4. Add a chat slash-command mapping that presents options and collects parameters.
5. Test end-to-end with private (unlisted) YouTube uploads and LinkedIn test posts.

Requirements (what I need from you)
-----------------------------------
Provide the following credentials and details so development and end-to-end testing can proceed. Store secrets in 1Password and share the item title & vault with me when ready.

1) YouTube (recommended: OAuth2 refresh token)
- OAuth2 client_id and client_secret
- A refresh_token for the YouTube account/channel that will perform uploads
- Preferred default upload privacy (public/unlisted/private)
- Quota: estimate of expected monthly uploads (for rate-limiting considerations)

2) LinkedIn (recommended: OAuth2)
- OAuth2 client_id and client_secret for a LinkedIn app with the following permissions:
  - w_member_social (create posts)
  - rw_organization_admin (if posting as an organization)
- A refresh_token or long-lived access token for the account or organization page
- Target audience preferences (public, connections-only, company page)

3) 1Password storage details
- Create items in 1Password named:
  - social-publish/youtube
  - social-publish/linkedin
- Each item should include fields: client_id, client_secret, refresh_token (and optional access_token), api_key (if used)

4) Runtime requirements (Node.js environment)
- Node.js 18+ installed in the workspace
- Yarn or npm for dependency management
- `op` (1Password CLI) available on the dev machine for secret access during tests (we will use it inside tmux)

5) Testing accounts / sandboxes
- For YouTube: ability to upload as Unlisted for testing
- For LinkedIn: a test company page or profile where posts can be made without public impact

Security & access
-----------------
- Do not share secrets in chat. Add them to 1Password and provide item title + vault when ready.
- I will only retrieve secrets using op inside tmux and will not log or persist them in plain text.

Dev plan & timeline
-------------------
- Scaffolding and adapters (Node.js): 2–3 days
- OAuth flow/testing & CLI: 1–2 days
- Integration tests and docs: 1 day

If you confirm, I will start implementing the Node.js skill scaffolding under repositories/social_publish/skill/src and create an initial README there with exact environment variables and command examples.