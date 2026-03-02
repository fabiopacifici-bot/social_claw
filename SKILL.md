---
name: social_publish
description: Multi-provider publishing skill for LinkedIn and YouTube (publish posts, upload videos, share links)
user-invokable: true
metadata:
  version: 1.0.0
  commands:
    - /share
---

# Social Publish Skill

## Overview

Multi-provider publishing skill for LinkedIn and YouTube. Provides a unified interface to publish posts, upload videos, share links, and schedule content from OpenClaw agents or via the `/share` chat command.

## Triggers / Slash Commands

### `/share <title>`
Interactive flow: opens options for provider selection (LinkedIn, YouTube, or both), message, media, visibility, and scheduling.

Agent behaviour when `/share` is invoked:
- Parse the provided `<title>` and optional message body.
- Infer `--category` from context (code, infra, learning, admin, general).
- Infer `--project` if a project name appears in the message.
- Set `--priority high` when the user uses urgent language ("urgent", "asap", "critical").
- Present interactive choices and confirm before publishing.

## Providers

- LinkedIn
- YouTube

## Agent-facing API

- `publish(payload)` — Publish a post to selected providers. Payload fields:
  - `title` (string)
  - `body` (string)
  - `media_path` (string, optional)
  - `providers` (array, e.g. ["linkedin","youtube"]) 
  - `schedule_time` (ISO8601 string, optional)
  - `visibility` (e.g. `public`, `unlisted`, `private`)

- `upload_video(file_path, metadata)` — Upload a video to YouTube; returns `{id, url}` on success.

- `list_posts(provider, filters)` — List recent posts/uploads for a provider.

Example publish payload:

```
{
  "title": "New release notes",
  "body": "We shipped v1.2 — highlights...",
  "media_path": "/tmp/cover.png",
  "providers": ["linkedin"],
  "visibility": "public",
  "schedule_time": "2026-03-10T09:00:00+01:00"
}
```

## Auth & Secrets

Store provider credentials in 1Password under the item title `social_publish/<provider>` with fields:
- `client_id`
- `client_secret`
- `refresh_token` (OAuth)
- `access_token` (optional)
- `api_key` (if applicable)

Secrets must be read at runtime using the OpenClaw 1Password skill — do not commit secrets to the repo and never log them.

## Security

- Use minimal OAuth scopes required (upload + manage) for each provider.
- Refresh tokens should be rotated and stored in 1Password.
- Mask or redact sensitive fields in logs.

## Skill Usage

- Agents: `skill.social_publish.publish(payload)`
- CLI/Manual (dry-run): `skill/src/cli publish --dry-run --file payload.json`

## Development notes

- Provider adapters live in `skill/src/providers/` (implement `linkedin` and `youtube` adapters).
- Include a local test harness at `skill/src/cli` that supports `--dry-run` mode and verbose output for debugging.
- Unit and integration tests should mock provider APIs and the 1Password secret retrieval.

## Files & Locations

- Skill entry: `skill/src/index.(js|py)`
- Providers: `skill/src/providers/<provider>.(js|py)`
- CLI test harness: `skill/src/cli`

## Prerequisites

- Python 3.8+ or Node 16+ depending on adapter implementation.
- 1Password CLI available when running publish flows that require secrets.

## Example flows

1) Quick LinkedIn post (immediate): call `publish` with `providers:["linkedin"]` and no `schedule_time`.
2) Upload video to YouTube: call `upload_video(file_path, metadata)` then call `publish` with returned video URL in `body` or `media_path`.

## Testing & Verification

- Use `--dry-run` to validate payloads without contacting provider APIs.
- Mock network calls in unit tests and validate payload mapping for each provider adapter.

## Notes

This SKILL.md now follows the organizational layout used by other mature skills in the workspace: clear Overview, Triggers, Providers, API surface, Auth, Usage, and Development notes. Keep this document updated when adding new features or providers.
