import { ExportDimension } from './types';

export const EXPORT_DIMENSIONS: ExportDimension[] = [
  // ─── iPhone ──────────────────────────────────────────────────────────────
  // Apple requires at least one of: 6.9" or 6.7" AND 5.5"
  { id: 'ios-icon',  name: 'App Store Icon',          width: 1024, height: 1024, platform: 'ios', type: 'icon',       device: 'iphone', required: true },
  { id: 'ios-69',    name: 'iPhone 6.9" (16 Pro Max)', width: 1320, height: 2868, platform: 'ios', type: 'screenshot', device: 'iphone', required: true,  notes: 'Required — covers iPhone 16 Pro Max & 16 Plus' },
  { id: 'ios-67',    name: 'iPhone 6.7" (15 Pro Max)', width: 1290, height: 2796, platform: 'ios', type: 'screenshot', device: 'iphone', required: false, notes: 'iPhone 15 Pro Max, 14 Pro Max' },
  { id: 'ios-65',    name: 'iPhone 6.5" (14 Plus)',    width: 1284, height: 2778, platform: 'ios', type: 'screenshot', device: 'iphone', required: false, notes: 'iPhone 14 Plus, 13 Pro Max, 12 Pro Max' },
  { id: 'ios-55',    name: 'iPhone 5.5" (8 Plus)',     width: 1242, height: 2208, platform: 'ios', type: 'screenshot', device: 'iphone', required: true,  notes: 'Required — covers older iPhones still on the store' },

  // ─── iPad ────────────────────────────────────────────────────────────────
  // Apple requires 12.9" if your app targets iPad
  { id: 'ios-ipad-13',  name: 'iPad 13" Pro (M4)',       width: 2064, height: 2752, platform: 'ios', type: 'screenshot', device: 'ipad', required: false, notes: 'iPad Pro 13" (M4, 2024)' },
  { id: 'ios-ipad',     name: 'iPad 12.9" Pro',          width: 2048, height: 2732, platform: 'ios', type: 'screenshot', device: 'ipad', required: true,  notes: 'Required for iPad apps — covers iPad Pro 12.9" (gen 3–6)' },
  { id: 'ios-ipad-11',  name: 'iPad 11" Pro',            width: 1668, height: 2388, platform: 'ios', type: 'screenshot', device: 'ipad', required: false, notes: 'iPad Pro 11" / iPad Air 11"' },
  { id: 'ios-ipad-97',  name: 'iPad 9.7"',               width: 2048, height: 1536, platform: 'ios', type: 'screenshot', device: 'ipad', required: false, notes: 'iPad (5th–6th gen), iPad mini 2–4' },

  // ─── Android ─────────────────────────────────────────────────────────────
  // Feature Graphic (1024×500) is required for a featured store listing
  { id: 'android-icon',    name: 'Play Store Icon',          width: 512,  height: 512,  platform: 'android', type: 'icon',            device: 'android', required: true,  notes: '32-bit PNG; alpha allowed' },
  { id: 'android-feature', name: 'Feature Graphic',          width: 1024, height: 500,  platform: 'android', type: 'feature_graphic', device: 'android', required: true,  notes: 'Required for featured store listing; landscape banner' },
  { id: 'android-phone',   name: 'Phone (16:9)',             width: 1080, height: 1920, platform: 'android', type: 'screenshot',      device: 'android', required: true,  notes: 'Min 2 screenshots required' },
  { id: 'android-tab7',    name: '7" Tablet',                width: 1200, height: 1920, platform: 'android', type: 'screenshot',      device: 'android', required: false },
  { id: 'android-tab10',   name: '10" Tablet',               width: 1600, height: 2560, platform: 'android', type: 'screenshot',      device: 'android', required: false },
];

export const DEVICE_LABELS: Record<string, string> = {
  iphone:  'iPhone',
  android: 'Android',
  ipad:    'iPad',
};
