import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Contribute",
  description:
    "AppShots is a free, open-source App Store screenshot generator. " +
    "Learn how to contribute — no backend, no sign-up, just open source.",
};

const GITHUB_URL = "https://github.com/TheProductArchitect/appshots";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-5 sm:px-8 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="text-sm font-bold text-gray-900 lowercase tracking-tight">
          ← appshots.
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-gray-400 hover:text-gray-900 lowercase transition-colors"
        >
          github ↗
        </a>
      </nav>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-16">

        {/* Hero */}
        <section>
          <h1 className="text-4xl font-bold text-gray-900 lowercase tracking-tight mb-4">
            about appshots.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
            A free, open-source tool for generating App Store and Google Play
            screenshots. No account. No backend. Everything runs in your browser.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-6">
            principles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "browser-only",
                body: "All rendering and export happens on your device. Your screenshots never touch a server.",
              },
              {
                title: "zero cost",
                body: "Free forever. No freemium tiers, no watermarks, no usage limits.",
              },
              {
                title: "minimal surface",
                body: "One page, one purpose. Features that reduce friction are welcome; features that add it are not.",
              },
              {
                title: "open source",
                body: "MIT licensed. Fork it, extend it, or submit a PR. The code is the product.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-800 lowercase mb-2">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-6">
            tech stack
          </h2>
          <div className="space-y-3">
            {[
              ["Next.js 16", "App Router, static export — deploys to GitHub Pages with no server"],
              ["Canvas API", "All device frames and compositing are drawn on <canvas> at export time"],
              ["Tailwind CSS 4", "Utility-first styles, no CSS files"],
              ["TypeScript", "Strict mode throughout"],
              ["Vitest", "Unit tests for export dimensions and compliance rules"],
              ["JSZip + file-saver", "In-browser ZIP packaging for batch exports"],
            ].map(([name, desc]) => (
              <div key={name} className="flex gap-4 items-start">
                <span className="text-sm font-semibold text-gray-800 lowercase w-36 flex-shrink-0">{name}</span>
                <span className="text-sm text-gray-400 leading-relaxed">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contribute */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-6">
            how to contribute
          </h2>

          <div className="space-y-4 mb-10">
            {[
              {
                step: "1",
                title: "fork & clone",
                code: `git clone https://github.com/TheProductArchitect/appshots.git\ncd appshots && npm install\nnpm run dev   # http://localhost:3000`,
              },
              {
                step: "2",
                title: "make your change",
                body: "The rendering engine is in src/lib/canvasRenderer.ts. The UI is mostly src/app/page.tsx and src/components/. Run npm run build before opening a PR — TypeScript errors block CI.",
              },
              {
                step: "3",
                title: "open a pull request",
                body: "One concern per PR. Fill in the PR template. CI runs automatically: type-check → tests → build → dependency security scan. All checks must pass.",
              },
            ].map(({ step, title, code, body }) => (
              <div key={step} className="flex gap-5">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {step}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 lowercase mb-2">{title}</p>
                  {code && (
                    <pre className="text-xs bg-gray-950 text-gray-300 rounded-xl px-4 py-3 overflow-x-auto leading-relaxed">
                      {code}
                    </pre>
                  )}
                  {body && <p className="text-sm text-gray-500 leading-relaxed">{body}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4">good ideas to work on</p>
            <ul className="space-y-2">
              {[
                "New device frame styles (Vision Pro, Android foldable, Wear OS)",
                "New export dimensions as stores update their requirements",
                "Better drag-to-reorder on creative cards",
                "Accessibility improvements",
                "Performance improvements to canvas rendering",
              ].map(item => (
                <li key={item} className="text-sm text-gray-500 flex gap-2">
                  <span className="text-gray-300">—</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 pt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm lowercase transition-all"
          >
            view on github ↗
          </a>
          <a
            href={`${GITHUB_URL}/issues/new/choose`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-200 hover:border-gray-400 text-gray-700 font-bold text-sm lowercase transition-all"
          >
            open an issue
          </a>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-700 lowercase transition-colors"
          >
            ← back to appshots
          </Link>
        </section>

      </main>

      <footer className="border-t border-gray-50 py-6 text-center">
        <p className="text-xs text-gray-300 lowercase">
          mit licensed · open source · built in the browser
        </p>
      </footer>
    </div>
  );
}
