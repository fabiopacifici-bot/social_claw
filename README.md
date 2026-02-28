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
1. Copy `skill/.env.example` to `skill/.env` and fill in your credentials.
2. Implement provider adapters for LinkedIn and YouTube.
3. Expose agent-callable endpoints: publish(post), upload(video), schedule(post).
4. Add a chat slash-command mapping that presents options and collects parameters.
5. Test end-to-end with private (unlisted) YouTube uploads and LinkedIn test posts.

Requirements
------------

### Runtime

- Node.js 18+
- npm (for dependency installation)

### Dependencies (auto-installed via npm install)

- `dotenv` — loads environment variables from `.env`
- `googleapis` — YouTube Data API v3 (OAuth2 upload)
- `node-fetch` — LinkedIn API HTTP calls

### Environment Variables

Copy `skill/.env.example` to `skill/.env` and fill in your values. Never commit `.env`.

**YouTube**

| Variable                  | Description                                      |
|---------------------------|--------------------------------------------------|
| `YOUTUBE_CLIENT_ID`       | OAuth2 client ID from Google Cloud Console       |
| `YOUTUBE_CLIENT_SECRET`   | OAuth2 client secret                             |
| `YOUTUBE_REFRESH_TOKEN`   | Refresh token for the uploading account/channel  |

**LinkedIn**

| Variable                  | Description                                                    |
|---------------------------|----------------------------------------------------------------|
| `LINKEDIN_ACCESS_TOKEN`   | OAuth2 access token (w_member_social permission required)      |
| `LINKEDIN_OWNER_URN`      | e.g. `urn:li:person:XXXX` or `urn:li:organization:XXXX`       |
| `LINKEDIN_PERSON_ID`      | Alternative to OWNER_URN (used if URN not set)                 |

### Credentials: where to get them

**YouTube**
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create an OAuth2 client ID (Desktop app or Web)
3. Enable YouTube Data API v3
4. Run the OAuth flow once to get a refresh token

**LinkedIn**
1. Create a LinkedIn app at https://developer.linkedin.com
2. Request `w_member_social` permission (and `rw_organization_admin` for company pages)
3. Complete OAuth2 flow to obtain an access token

Dev plan & timeline
-------------------
- Scaffolding and adapters (Node.js): 2–3 days
- OAuth flow/testing & CLI: 1–2 days
- Integration tests and docs: 1 day

If you confirm, I will start implementing the Node.js skill scaffolding under repositories/social_publish/skill/src and create an initial README there with exact environment variables and command examples.