# Paige's Corner Implementation Roadmap

## Live Baseline
- Public marketing pages exist.
- Root app deploys successfully through Cloudflare Worker routes.
- Worker now serves the built Vite app and exposes `/api/status`.
- Auth-backed dashboard shell is live with session protection.
- Public content rails are API-backed and connected to dashboard publishing/moderation.
- Household productivity rails are live in the dashboard for chores, dinner voting, groceries, requests, rewards, and activity feed.

## Immediate priorities

### 1. Public-site foundation
- Shared public shell
- Global footer
- Route-based sunflower lighting
- Navbar login entry point
- Scroll reveal interactions

### 2. Dashboard gate and auth uplift
- Replace demo login redirect with secure session flow
- Persist role and user profile safely
- Add protected route handling
- Add post-login reminder modal

### 3. Family content systems
- Public message board with moderation
- Gallery read/write flow
- Homepage post rail under hero
- Blog authoring for Paige and Dad

### 4. Household productivity systems
- Calendar and reminders
- Chores, rewards, and demerits
- Dinner voting and grocery integration
- Requests board and activity feed

### 5. Realtime family systems
- Chat
- Presence
- Notifications
- Meeting room

### 6. Delight systems
- Bee cursor and sound design
- Gifts and trash prank mechanics
- Garden progression
- Fireworks and achievement moments

## Success criteria
- Every phase must leave the site deployable.
- Public pages must improve visually without regressing performance.
- New systems must fit the existing deployment and repo rules.
- Documentation must stay in sync with the shipped architecture.
