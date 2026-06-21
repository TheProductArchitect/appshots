"use client";

import { useState, useCallback } from "react";
import {
  DownloadCloud, Loader2, ImageIcon, ChevronDown, ChevronUp,
  Copy, Smartphone, Tablet, AlertCircle
} from "lucide-react";

import { Screenshot, DeviceCategory, CategoryState } from "@/lib/types";
import { EXPORT_DIMENSIONS, DEVICE_LABELS } from "@/lib/constants";
import { exportSingleCategory, exportAllCategories } from "@/lib/exportUtils";
import { UploadSection } from "@/components/UploadSection";
import { CreativeCard } from "@/components/CreativeCard";
import { ExportCategorySelector } from "@/components/ExportCategorySelector";

// ─── Constants ────────────────────────────────────────────────────────────

const DEVICES: DeviceCategory[] = ['iphone', 'android', 'ipad'];

const DEVICE_ICONS: Record<DeviceCategory, React.ReactNode> = {
  iphone:  <Smartphone size={14} />,
  android: <Smartphone size={14} />,
  ipad:    <Tablet size={14} />,
};

const DEFAULT_BG_COLORS = ['#f0f4ff', '#fdf4ff', '#f0fdf4', '#fff7ed', '#f8fafc', '#eff6ff', '#fef2f2'];

const INITIAL_CATEGORY: CategoryState = { screenshots: [] };

function makeDefaultDimSelection(device: DeviceCategory) {
  return EXPORT_DIMENSIONS.filter(d => d.device === device).map(d => d.id);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function deepCopyScreenshots(shots: Screenshot[]): Screenshot[] {
  return shots.map(s => ({ ...s, id: crypto.randomUUID() }));
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [categories, setCategories] = useState<Record<DeviceCategory, CategoryState>>({
    iphone:  { ...INITIAL_CATEGORY },
    android: { ...INITIAL_CATEGORY },
    ipad:    { ...INITIAL_CATEGORY },
  });

  const [activeDevice, setActiveDevice] = useState<DeviceCategory>('iphone');
  const [logo, setLogo] = useState<string | null>(null);

  const [dimSelections, setDimSelections] = useState<Record<DeviceCategory, string[]>>({
    iphone:  makeDefaultDimSelection('iphone'),
    android: makeDefaultDimSelection('android'),
    ipad:    makeDefaultDimSelection('ipad'),
  });

  const [showSizes, setShowSizes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportTarget, setExportTarget] = useState<DeviceCategory | 'all' | null>(null);
  const [globalPosition, setGlobalPosition] = useState(0);
  const [globalZoom, setGlobalZoom] = useState(100);

  // ── Category helpers ───────────────────────────────────────────────────

  const active = categories[activeDevice];

  const updateCategory = useCallback((device: DeviceCategory, patch: Partial<CategoryState>) => {
    setCategories(prev => ({ ...prev, [device]: { ...prev[device], ...patch } }));
  }, []);

  const updateScreenshot = useCallback((device: DeviceCategory, id: string, updates: Partial<Screenshot>) => {
    setCategories(prev => ({
      ...prev,
      [device]: {
        ...prev[device],
        screenshots: prev[device].screenshots.map(s => s.id === id ? { ...s, ...updates } : s),
      },
    }));
  }, []);

  const removeScreenshot = useCallback((device: DeviceCategory, id: string) => {
    setCategories(prev => ({
      ...prev,
      [device]: {
        ...prev[device],
        screenshots: prev[device].screenshots.filter(s => s.id !== id),
      },
    }));
  }, []);

  const addScreenshots = useCallback((device: DeviceCategory, newShots: Screenshot[]) => {
    setCategories(prev => ({
      ...prev,
      [device]: {
        ...prev[device],
        screenshots: [...prev[device].screenshots, ...newShots],
      },
    }));
  }, []);

  const applyToAll = useCallback((updates: { screenshotOffsetY?: number; screenshotZoom?: number }) => {
    setCategories(prev => {
      const next = { ...prev };
      for (const dev of DEVICES) {
        next[dev] = {
          ...prev[dev],
          screenshots: prev[dev].screenshots.map(s => ({ ...s, ...updates })),
        };
      }
      return next;
    });
  }, []);

  const copyFromDevice = useCallback((source: DeviceCategory) => {
    const src = categories[source];
    setCategories(prev => ({
      ...prev,
      [activeDevice]: {
        screenshots: deepCopyScreenshots(src.screenshots),
      },
    }));
  }, [categories, activeDevice]);

  // ── Export ─────────────────────────────────────────────────────────────

  const handleExport = async (target: DeviceCategory | 'all') => {
    setIsExporting(true);
    setExportTarget(target);
    try {
      if (target === 'all') {
        await exportAllCategories(categories, logo, [
          ...dimSelections.iphone,
          ...dimSelections.android,
          ...dimSelections.ipad,
        ]);
      } else {
        await exportSingleCategory(
          categories[target].screenshots, logo,
          target, dimSelections[target]
        );
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
      setExportTarget(null);
    }
  };

  const totalFiles =
    dimSelections[activeDevice].length * active.screenshots.length;
  const otherDevicesWithContent = DEVICES.filter(
    d => d !== activeDevice && categories[d].screenshots.length > 0
  );
  const totalAllFiles =
    DEVICES.reduce((sum, d) => sum + dimSelections[d].length * categories[d].screenshots.length, 0);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-extrabold lowercase tracking-tight text-gray-900">
              app store icons.
            </h1>
            <p className="text-xs text-gray-400 lowercase hidden sm:block">free · open source · zero backend</p>
          </div>

          {totalAllFiles > 0 && (
            <span className="text-xs text-gray-400 lowercase hidden sm:block">
              {totalAllFiles} file{totalAllFiles !== 1 ? 's' : ''} ready
            </span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-8">

        {/* ── Device tabs ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-gray-100">
          {DEVICES.map(dev => {
            const count = categories[dev].screenshots.length;
            return (
              <button
                key={dev}
                onClick={() => setActiveDevice(dev)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold lowercase rounded-t-xl transition-all border-b-2
                  ${activeDevice === dev
                    ? 'border-gray-900 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'}`}
              >
                {DEVICE_ICONS[dev]}
                {DEVICE_LABELS[dev]}
                {count > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeDevice === dev ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Upload ──────────────────────────────────────────────────────── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">1 · upload</p>
          <UploadSection
            screenshots={active.screenshots}
            logo={logo}
            device={activeDevice}
            onScreenshotsAdd={shots => addScreenshots(activeDevice, shots)}
            onLogoChange={setLogo}
          />
        </section>

        {/* ── Settings ────────────────────────────────────────────────────── */}
        {active.screenshots.length > 0 && (
          <section className="border-t border-gray-100 pt-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">2 · style & format</p>

            {/* Global position & zoom — applies to all devices */}
            {totalAllFiles > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 space-y-2">
                <p className="text-xs text-gray-400 lowercase font-semibold">apply to all devices</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">position</span>
                  <input
                    type="range" min={0} max={100} step={1}
                    value={globalPosition}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setGlobalPosition(v);
                      applyToAll({ screenshotOffsetY: v });
                    }}
                    className="flex-1 h-1 accent-gray-800 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 w-6 text-right">{globalPosition}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">zoom</span>
                  <input
                    type="range" min={100} max={200} step={1}
                    value={globalZoom}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setGlobalZoom(v);
                      applyToAll({ screenshotZoom: v });
                    }}
                    className="flex-1 h-1 accent-gray-800 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 w-6 text-right">{globalZoom}%</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Sizes toggle */}
              <button
                onClick={() => setShowSizes(v => !v)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showSizes ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                <span className="lowercase font-semibold">export sizes</span>
                <span className="text-gray-400">
                  ({dimSelections[activeDevice].length} selected)
                </span>
              </button>

              {/* File count */}
              {totalFiles > 0 && (
                <span className="text-xs text-gray-400 lowercase">
                  = <span className="font-bold text-gray-600">{totalFiles} png files</span>
                </span>
              )}

            </div>

            {showSizes && (
              <ExportCategorySelector
                device={activeDevice}
                selectedDimensions={dimSelections[activeDevice]}
                onChange={sel => setDimSelections(prev => ({ ...prev, [activeDevice]: sel }))}
              />
            )}
          </section>
        )}

        {/* ── Creative grid ────────────────────────────────────────────────── */}
        <section className={active.screenshots.length > 0 ? 'border-t border-gray-100 pt-6' : ''}>
          {active.screenshots.length > 0 ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4">3 · edit creatives</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {active.screenshots.map((shot, i) => (
                  <CreativeCard
                    key={shot.id}
                    screenshot={shot}
                    logo={logo}
                    device={activeDevice}
                    index={i}
                    onChange={updates => updateScreenshot(activeDevice, shot.id, updates)}
                    onRemove={() => removeScreenshot(activeDevice, shot.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            /* ── Empty state ───────────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              {otherDevicesWithContent.length > 0 ? (
                <>
                  <Copy className="w-10 h-10 text-gray-200 mb-4" />
                  <p className="text-sm font-semibold text-gray-500 lowercase mb-2">
                    no {DEVICE_LABELS[activeDevice].toLowerCase()} creatives yet.
                  </p>
                  <p className="text-xs text-gray-400 lowercase mb-5">
                    drop screenshots above, or copy from another device.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {otherDevicesWithContent.map(src => (
                      <button
                        key={src}
                        onClick={() => copyFromDevice(src)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold lowercase hover:bg-gray-700 transition-colors"
                      >
                        {DEVICE_ICONS[src]}
                        copy from {DEVICE_LABELS[src]}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-sm font-semibold text-gray-400 lowercase">
                    drop your app screenshots above to get started.
                  </p>
                </>
              )}
            </div>
          )}
        </section>

        {/* ── Compliance notice ─────────────────────────────────────────────── */}
        {active.screenshots.length > 0 && (
          <section className="border-t border-gray-100 pt-6">
            <ComplianceNotice device={activeDevice} selectedIds={dimSelections[activeDevice]} />
          </section>
        )}

        {/* ── Export section ────────────────────────────────────────────────── */}
        {totalAllFiles > 0 && (
          <section className="border-t-2 border-gray-900 pt-8 pb-32">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-6">4 · download</p>

            <div className="space-y-3 mb-8">
              {DEVICES.map(dev => {
                const count = categories[dev].screenshots.length;
                const sizes = dimSelections[dev].length;
                const files = count * sizes;
                const ready = count > 0 && sizes > 0;
                return (
                  <div
                    key={dev}
                    className={`flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-colors
                      ${ready ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50/50'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 ${ready ? 'text-gray-700' : 'text-gray-300'}`}>
                        {DEVICE_ICONS[dev]}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold lowercase ${ready ? 'text-gray-800' : 'text-gray-400'}`}>
                          {DEVICE_LABELS[dev]}
                        </p>
                        {ready ? (
                          <p className="text-xs text-gray-400 lowercase">
                            {count} creative{count !== 1 ? 's' : ''} × {sizes} size{sizes !== 1 ? 's' : ''} = <span className="font-semibold text-gray-600">{files} png files</span>
                          </p>
                        ) : (
                          <p className="text-xs text-gray-300 lowercase">no creatives — set up the {DEVICE_LABELS[dev]} tab</p>
                        )}
                      </div>
                    </div>

                    {ready && (
                      <button
                        onClick={() => handleExport(dev)}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold lowercase transition-all flex-shrink-0 disabled:opacity-50"
                      >
                        {isExporting && exportTarget === dev
                          ? <Loader2 size={14} className="animate-spin" />
                          : <DownloadCloud size={14} />}
                        download
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleExport('all')}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-900 hover:bg-gray-700 text-white font-bold text-base lowercase transition-all active:scale-[0.99] disabled:opacity-60"
            >
              {isExporting && exportTarget === 'all'
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <DownloadCloud className="w-5 h-5" />}
              download all devices
              <span className="font-normal text-gray-400 text-sm">· {totalAllFiles} files</span>
            </button>
          </section>
        )}

      </main>

      {/* ── Sticky bottom bar (visible when content exists) ─────────────────── */}
      {totalAllFiles > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400 lowercase truncate">
              {DEVICES.filter(d => categories[d].screenshots.length > 0).map(d => `${DEVICE_LABELS[d]} (${categories[d].screenshots.length})`).join(' · ')}
            </p>
            <button
              onClick={() => handleExport('all')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold lowercase transition-all flex-shrink-0 disabled:opacity-60"
            >
              {isExporting && exportTarget === 'all'
                ? <Loader2 size={14} className="animate-spin" />
                : <DownloadCloud size={14} />}
              download all · {totalAllFiles} files
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-50 py-6 text-center space-y-2">
        <p className="text-xs text-gray-300 lowercase">
          all processing happens in your browser. no data leaves your device.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/TheProductArchitect/appshots"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-300 hover:text-gray-600 lowercase transition-colors"
          >
            github ↗
          </a>
          <span className="text-gray-200">·</span>
          <a href="/about" className="text-xs text-gray-300 hover:text-gray-600 lowercase transition-colors">
            contribute
          </a>
        </div>
      </footer>
    </div>
  );
}

// ─── Compliance Notice ────────────────────────────────────────────────────

function ComplianceNotice({ device, selectedIds }: { device: DeviceCategory; selectedIds: string[] }) {
  const requiredDims = EXPORT_DIMENSIONS.filter(d => d.device === device && d.required);
  const missingRequired = requiredDims.filter(d => !selectedIds.includes(d.id));

  const platformNotes: Record<DeviceCategory, string[]> = {
    iphone: [
      'PNG or JPEG, max 500 MB per file.',
      'At most 10 screenshots per size class.',
      'No transparency on app icons.',
      '6.9" or 6.7" + 5.5" required in App Store Connect.',
    ],
    android: [
      'PNG or JPEG, no animated GIFs.',
      'Min 320px shortest side, max 3840px longest side.',
      'Feature Graphic (1024×500) required for store listing.',
      'Min 2 phone screenshots required.',
    ],
    ipad: [
      'Use separate screenshots from iPhone — iPad has its own slots.',
      '12.9" iPad Pro screenshots required for iPad-compatible apps.',
      'Landscape optional but recommended.',
    ],
  };

  return (
    <details className="group">
      <summary className="flex items-center gap-2 cursor-pointer list-none text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors lowercase select-none">
        <AlertCircle size={13} className={missingRequired.length > 0 ? 'text-amber-500' : 'text-gray-300'} />
        {missingRequired.length > 0
          ? `${missingRequired.length} required size${missingRequired.length > 1 ? 's' : ''} deselected — compliance notes`
          : 'compliance notes'}
        <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
      </summary>

      <div className="mt-3 rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
        {missingRequired.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700 lowercase mb-1">required sizes not selected:</p>
              {missingRequired.map(d => (
                <p key={d.id} className="text-xs text-amber-600">{d.name} — {d.width}×{d.height}</p>
              ))}
            </div>
          </div>
        )}

        <ul className="space-y-1.5">
          {platformNotes[device].map((note, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-gray-300 flex-shrink-0 mt-0.5">·</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
