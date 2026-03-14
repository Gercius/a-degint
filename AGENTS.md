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
- No `console.log` in committed code — remove before pushing

## TypeScript
- No `any` — use `unknown` and narrow, or define a proper type
- Co-locate types with the code that uses them; only promote to shared types when reused
- Prefer `type` over `interface` unless you need declaration merging

## React
- Name components after what they render, not how they're used (`UserAvatar`, not `SidebarProfilePic`)
- Name boolean props with `is`/`has` prefix: `isLoading`, `hasError` (native HTML exceptions like `disabled` aside)
- Omit `={true}` for boolean props: `<Spinner isLoading />` not `<Spinner isLoading={true} />`
- Prefer named exports for components; default exports only at route/page level
- Event handler props use `on` prefix (`onSubmit`); internal handlers use `handle` (`handleSubmit`)
- Calling a hook should not trigger side effects directly — side effects belong inside `useEffect`
- Custom hooks own their logic completely — a component should not need to know how a hook works internally
- Avoid `useEffect` for derived state — compute it inline or with `useMemo`
- Never use indexes as `key` props in dynamic lists; use stable, unique IDs
- Context is for genuinely global state (auth, theme, locale) — not a shortcut to avoid prop drilling one level deep
- Co-locate context, provider, and hook in one file: `auth-context.tsx` exporting `AuthProvider` and `useAuth`

## Components / UI
- Keep components focused — if it needs a long comment to explain what it does, split it
- Separate logic from presentation (custom hooks, utils)
- No hardcoded strings visible to the user — use constants or i18n keys
- Interactive elements must be keyboard-accessible and have appropriate ARIA labels where native semantics fall short

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
- Keep filenames lowercase with hyphens (`some-script.tsx`)
- Test files co-located and mirroring source: `some-script.test.ts`
- Type files when you do promote shared types: `user.types.ts` or `user.d.ts`

## Routing (framework-agnostic)
- Route paths are lowercase kebab-case: `/user-settings`, not `/userSettings`
- Dynamic segments are descriptive: `/users/[userId]`, not `/users/[id]`
- Protect routes at the router level, not inside the page component
- Redirect after mutations (form submit, delete) — don't leave the user on a stale URL

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