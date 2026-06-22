# AppShots

**Free, open-source App Store & Google Play screenshot generator.**  
No account. No backend. Everything runs in your browser.

🔗 **[appshots live →](https://theproductarchitect.github.io/appshots/)**

---

## What it does

Upload your app screenshots, add a headline and subtitle, pick a background — and export pixel-perfect creatives for every store format in one click.

- iPhone (6.9″ / 6.5″ / 5.5″)
- Android phone
- iPad Pro
- Google Play feature graphic

All rendering happens on-device via the Canvas API. Your screenshots never leave your machine.

## Features

- Device frame mockups (iPhone Dynamic Island, Android punch-hole, iPad)
- Solid, gradient, or custom image backgrounds
- Per-screenshot headline, subtitle, text color, zoom, and vertical position
- "Apply to all" global controls for position and zoom
- Batch ZIP export at store-compliant resolutions
- MIT licensed, zero dependencies on external services

## Getting started

```bash
git clone https://github.com/TheProductArchitect/appshots.git
cd appshots
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

| | |
|---|---|
| Next.js 16 | App Router, `output: "export"` — static site, no server |
| Canvas API | All device frames and compositing drawn at export time |
| Tailwind CSS 4 | Utility-first styles |
| TypeScript | Strict mode throughout |
| JSZip + file-saver | In-browser ZIP packaging |
| GitHub Pages | Hosting via `deploy.yml` — push to `main` and it ships |

## Project structure

```
src/
  app/            Next.js App Router (page.tsx is the whole UI)
  components/     React components — UploadSection, CreativeCard
  lib/
    types.ts          shared TypeScript types
    constants.ts      export dimensions and compliance notes
    canvasRenderer.ts core rendering engine — device frames, text, backgrounds
    exportUtils.ts    packages canvas output into a ZIP
.github/
  workflows/
    deploy.yml    builds and deploys to GitHub Pages on push to main
    ci.yml        type-check → build → dependency scan on every PR
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. Short version:

1. Fork, clone, `npm install`, `npm run dev`
2. Make your change — the rendering engine is in `src/lib/canvasRenderer.ts`
3. Run `npm run build` (must pass — TypeScript errors block CI)
4. Open a PR against `main`

Good bets: new device frames, new export dimensions, accessibility improvements, performance improvements to canvas rendering.

**[→ about & contribution guide](https://theproductarchitect.github.io/appshots/about/)**

## License

MIT
