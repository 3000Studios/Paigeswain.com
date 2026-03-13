# Paige's Corner ChatGPT Build Playbook

## Purpose
This document is the repo-native source of truth for AI coding agents working on Paige's Corner. It translates the long-form Swain Family Portal workbook into practical implementation rules for this codebase.

## Product Promise
Paige's Corner is a digital home for the Swain family. Every feature should reinforce these qualities:

- Loving
- Playful
- Family-centered
- Private and safe
- Mobile-first
- Fast
- Visually magical

The platform combines:

- Public family-facing pages
- A private family portal
- Shared planning tools
- Media and memory sharing
- Games, gifts, and playful interactions

## Non-Negotiables

### Repository discipline
- `main` is the only branch.
- `main` represents live production.
- Changes must keep the repo clean and readable.
- Avoid duplicate folders, placeholder experiments, and dead files.

### Deployment discipline
- Pushes to `main` deploy automatically through GitHub Actions and Wrangler.
- Every change must be safe for production.
- Local verification happens before deploy whenever possible.

### Product discipline
- Never break existing live behavior while adding new features.
- Private routes must remain protected.
- Public pages must feel cohesive and premium, not like separate demos.
- The sunflower world is the core visual system, not an optional flourish.

## Architecture Targets

### Public experience
- Home
- About Us
- Gallery
- Blog
- Message Board
- Global navbar
- Global footer for Paige's books and family links
- Shared responsive sunflower environment with page-specific lighting

### Private experience
- `/family-dashboard`
- Secure authentication and role-aware UI
- Family feed, schedule, chores, dinners, groceries, requests, achievements, art, chat, games, and meeting room

### Platform services
- React + Vite front end
- Cloudflare Worker for production hosting and API edge routing
- MongoDB for long-term app data
- R2 for media storage
- WebSockets / WebRTC for live systems

## Current Build Phases

### Phase 1: Foundation
- Shared public layout
- Global footer
- Stronger sunflower world
- Consistent public page content
- Route-aware page lighting
- Basic dashboard gate

### Phase 2: Auth and family shell
- Real login sessions
- Role-based dashboard shell
- Reminder modal after login
- Dashboard information architecture

### Phase 3: Family core systems
- Message board moderation
- Blog and homepage posts
- Gallery uploads and comments
- Calendar, chores, dinner planner, grocery list

### Phase 4: Realtime and fun systems
- Family chat
- Meeting room
- Gifts, compliments, trash prank
- Notifications and daily digest

### Phase 5: Smart systems
- AI family assistant
- Voice features
- Memory timeline and scrapbook
- Search, tagging, and automation

## Visual Rules
- Use bold, family-friendly typography and rich warmth.
- Prefer layered gradients, glows, depth, translucency, and motion over flat panels.
- Keep interactions soft and joyful, not corporate or sterile.
- On public pages, the backdrop should remain alive but never overpower readability.
- Scroll reveal, fade, and parallax effects should feel intentional and lightweight.

## Security Rules
- Demo-only localStorage auth is acceptable only as a placeholder during scaffolding.
- Production auth must use secure sessions and encrypted password storage.
- Private endpoints require authorization.
- Uploads must be validated for size and file type.

## Delivery Rules For AI Agents
- Make real code changes instead of producing speculative pseudo-code.
- When the full feature set is too large for one pass, deliver the next highest-value vertical slice that keeps production stable.
- Update documentation when the live architecture changes.
- Prefer incremental, deployable improvements over giant rewrites.
