# Contributing to AppShots

Thanks for wanting to improve AppShots. This is a zero-backend, browser-only tool — contributions that maintain that constraint are most welcome.

## Ground rules

- **No backend.** All rendering, state, and export must run in the browser. No API calls to external services.
- **No new dependencies without discussion.** Open an issue first if you want to add a package.
- **Keep it minimal.** AppShots is deliberately simple. Features should reduce friction, not add it.
- **One concern per PR.** Small, focused pull requests are easier to review and faster to ship.

## Getting started

```bash
git clone https://github.com/TheProductArchitect/appshots.git
cd appshots
npm install
npm run dev        # http://localhost:3000
npm run build      # must pass before opening a PR
```

## Architecture in 30 seconds

```
src/
  app/            Next.js app router (page.tsx is the whole UI)
  components/     React components — CreativeCard is the main editing unit
  lib/
    types.ts          shared TypeScript types
    constants.ts      all export dimensions with compliance notes
    canvasRenderer.ts draws creatives — this is the core rendering engine
    exportUtils.ts    packages canvas output into a ZIP
public/           static assets (robots.txt, og-image.svg)
.github/
  workflows/
    deploy.yml    builds + deploys to GitHub Pages on push to main
    ci.yml        runs on every PR — must pass before merging
```

The key file is `canvasRenderer.ts`. All rendering logic (device frames, text layout, background images, feature graphics) lives there. If you're adding a new template or device type, start there.

## How to submit a PR

1. Fork the repo and create a branch: `git checkout -b feat/your-thing`
2. Make your changes. Run `npm run build` and fix any type errors.
3. Open a PR against `main`. Fill in the PR template.
4. The CI workflow will run automatically — it must pass.
5. A maintainer will review within a few days.

## What we're looking for

**Good bets:**
- New device frame styles (Vision Pro, Android foldable, etc.)
- New export formats or dimensions as stores update requirements
- Accessibility improvements
- Performance improvements to canvas rendering
- Better drag-to-reorder on creative cards

**Not a good fit (please discuss first):**
- Adding a server, database, or any auth flow
- Large UI framework changes
- Features that require an API key or account

## Questions?

Open an issue with the `question` label. We'll respond promptly.
