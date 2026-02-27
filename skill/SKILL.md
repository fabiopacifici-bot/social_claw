name: social-publish
summary: Multi-provider publishing skill for LinkedIn and YouTube (publish posts, upload videos, share links)
author: Olly (assistant)

Description:
A multi-provider OpenClaw skill that lets agents publish content to social platforms. Provides a unified interface (publish/upload/schedule) and a chat slash-command (/publish) that opens a small option form for provider selection (LinkedIn, YouTube, or both), message, media, visibility, and scheduling.

Providers:
- linkedin
- youtube

APIs (agent-facing)
- publish(payload): Publish a post to selected providers. Payload includes: title, body, media_path, providers[], schedule_time (optional), visibility.
- upload_video(file_path, metadata): Uploads a video to YouTube and returns video URL/id.
- list_posts(provider, filters): Lists recent posts or uploads for a provider.

Auth & secrets
Store provider credentials in 1Password under item title: "social-publish/<provider>" with fields:
- client_id
- client_secret
- refresh_token (for OAuth)
- access_token (optional)
- api_key (if applicable)

Skill usage
- Agents call: skill.social-publish.publish({...})
- Chat slash command: /publish -> interactive options -> confirm -> runs skill.publish

Security
- Secrets are read from 1Password at runtime using the 1Password skill (op) inside a tmux session.
- Do not log secrets. Use minimal scopes (upload + manage) for OAuth tokens.

Development notes
- Implement provider adapters under skill/src/providers/*.js (or .py)
- Include local test harness skill/src/cli for manual publishing tests with dry-run mode.

