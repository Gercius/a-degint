# Project Rules
Various web dev rules, reusable across various projects

## General
- Prefer simple, readable solutions over clever ones
- Don't over-engineer — build what's needed, not what might be needed
- Delete dead code rather than commenting it out
- One concern per file/function — split when things grow

## Code Style
- Use consistent naming: `camelCase` for variables/functions, `PascalCase` for components/classes, `SCREAMING_SNAKE_CASE` for constants
- Prefer `const` over `let`; avoid `var`
- Avoid magic numbers — name your constants
- Keep functions small and pure where possible; side effects should be explicit

## TypeScript
- No `any` — use `unknown` and narrow, or define a proper type
- Co-locate types with the code that uses them; only promote to shared types when reused
- Prefer `type` over `interface` unless you need declaration merging

## Components / UI
- Keep components focused — if it needs a long comment to explain what it does, split it
- Separate logic from presentation (custom hooks, utils)
- No hardcoded strings visible to the user — use constants or i18n keys

## Styling
- No inline styles except for truly dynamic values
- Mobile-first breakpoints

## State & Data
- Keep state as local as possible — lift only when necessary
- Server state (API data) and UI state are different — manage them separately
- Never mutate state directly

## API / Async
- All async functions should handle errors explicitly — no silent failures
- Validate external data at the boundary (API responses, form input)
- Use loading/error/success states consistently across the UI

## File Structure
- Feature-based folders over type-based (`/auth` not `/hooks + /components + /utils`)
- Index files for clean imports; avoid barrel files that cause circular deps
- Keep filenames lowercase with hyphens (`user-profile.tsx`), **except component files which use PascalCase (`UserProfile.tsx`, `UserProfile.vue`, `UserProfile.svelte`)**
- Test files co-located and mirroring source: user-profile.test.ts
- Type files when you do promote shared types: user.types.ts or user.d.ts

## Git
- Commits are atomic — one logical change per commit
- Commit messages: imperative present tense (`fix login redirect`, not `fixed` or `fixes`)
- No committing commented-out code, `console.log`, or debug artifacts

## Testing
- Test behaviour, not implementation
- Unit test pure functions and utilities; integration test user flows
- Don't mock what you don't own — prefer real implementations in tests where feasible

## Security
- Never log or expose secrets, tokens, or PII
- Sanitize all user input before rendering or storing
- Don't store sensitive data in `localStorage`