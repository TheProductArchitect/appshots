import { describe, it, expect } from 'vitest';
import { EXPORT_DIMENSIONS, DEVICE_LABELS } from './constants';

describe('EXPORT_DIMENSIONS', () => {
  it('every dimension has valid fields', () => {
    for (const dim of EXPORT_DIMENSIONS) {
      expect(dim.id, `${dim.id} missing id`).toBeTruthy();
      expect(dim.name, `${dim.id} missing name`).toBeTruthy();
      expect(dim.width, `${dim.id} width must be > 0`).toBeGreaterThan(0);
      expect(dim.height, `${dim.id} height must be > 0`).toBeGreaterThan(0);
      expect(['ios', 'android'], `${dim.id} invalid platform`).toContain(dim.platform);
      expect(['iphone', 'android', 'ipad'], `${dim.id} invalid device`).toContain(dim.device);
      expect(['icon', 'screenshot', 'feature_graphic'], `${dim.id} invalid type`).toContain(dim.type);
    }
  });

  it('no duplicate ids', () => {
    const ids = EXPORT_DIMENSIONS.map(d => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('required iOS screenshot sizes are present', () => {
    const ids = EXPORT_DIMENSIONS.map(d => d.id);
    expect(ids).toContain('ios-69');   // 6.9" — required by Apple for modern submissions
    expect(ids).toContain('ios-55');   // 5.5" — legacy size, still listed but not required
    expect(ids).toContain('ios-ipad'); // 12.9" iPad — required for iPad apps
  });

  it('required Android sizes are present', () => {
    const ids = EXPORT_DIMENSIONS.map(d => d.id);
    expect(ids).toContain('android-icon');    // Play Store app icon
    expect(ids).toContain('android-feature'); // Feature graphic
    expect(ids).toContain('android-phone');   // Phone screenshot
  });

  it('icons are square', () => {
    for (const dim of EXPORT_DIMENSIONS.filter(d => d.type === 'icon')) {
      expect(dim.width, `${dim.id} icon must be square`).toBe(dim.height);
    }
  });

  it('feature graphic is landscape', () => {
    const fg = EXPORT_DIMENSIONS.find(d => d.type === 'feature_graphic');
    expect(fg, 'feature_graphic must exist').toBeDefined();
    expect(fg!.width, 'feature graphic must be wider than tall').toBeGreaterThan(fg!.height);
  });

  it('screenshots are portrait or landscape (not square)', () => {
    for (const dim of EXPORT_DIMENSIONS.filter(d => d.type === 'screenshot')) {
      expect(dim.width, `${dim.id} screenshot should not be square`).not.toBe(dim.height);
    }
  });

  it('iOS app icon meets minimum size', () => {
    const icon = EXPORT_DIMENSIONS.find(d => d.id === 'ios-icon');
    expect(icon, 'ios-icon must exist').toBeDefined();
    expect(icon!.width).toBeGreaterThanOrEqual(1024);
    expect(icon!.height).toBeGreaterThanOrEqual(1024);
  });

  it('Android feature graphic is exactly 1024x500', () => {
    const fg = EXPORT_DIMENSIONS.find(d => d.id === 'android-feature');
    expect(fg, 'android-feature must exist').toBeDefined();
    expect(fg!.width).toBe(1024);
    expect(fg!.height).toBe(500);
  });

  it('iPhone 6.1" (16) is present and correct', () => {
    const dim = EXPORT_DIMENSIONS.find(d => d.id === 'ios-61');
    expect(dim, 'ios-61 must exist').toBeDefined();
    expect(dim!.width).toBe(1179);
    expect(dim!.height).toBe(2556);
    expect(dim!.platform).toBe('ios');
    expect(dim!.device).toBe('iphone');
    expect(dim!.type).toBe('screenshot');
  });

  it('iPhone 4.7" (SE 3rd gen) is present and correct', () => {
    const dim = EXPORT_DIMENSIONS.find(d => d.id === 'ios-47');
    expect(dim, 'ios-47 must exist').toBeDefined();
    expect(dim!.width).toBe(750);
    expect(dim!.height).toBe(1334);
    expect(dim!.platform).toBe('ios');
    expect(dim!.device).toBe('iphone');
    expect(dim!.type).toBe('screenshot');
  });

  it('iPad mini 6 is present and correct', () => {
    const dim = EXPORT_DIMENSIONS.find(d => d.id === 'ios-ipad-mini');
    expect(dim, 'ios-ipad-mini must exist').toBeDefined();
    expect(dim!.width).toBe(1488);
    expect(dim!.height).toBe(2266);
    expect(dim!.platform).toBe('ios');
    expect(dim!.device).toBe('ipad');
    expect(dim!.type).toBe('screenshot');
  });

  it('ios-55 is not marked required (legacy size)', () => {
    const dim = EXPORT_DIMENSIONS.find(d => d.id === 'ios-55');
    expect(dim, 'ios-55 must exist').toBeDefined();
    expect(dim!.required).toBe(false);
  });

  it('iPhone sizes are in descending order of screen height', () => {
    const iphoneSizes = EXPORT_DIMENSIONS.filter(
      d => d.device === 'iphone' && d.type === 'screenshot'
    );
    for (let i = 1; i < iphoneSizes.length; i++) {
      expect(iphoneSizes[i].height).toBeLessThanOrEqual(iphoneSizes[i - 1].height);
    }
  });
});

describe('DEVICE_LABELS', () => {
  it('has a label for every device category', () => {
    expect(DEVICE_LABELS.iphone).toBe('iPhone');
    expect(DEVICE_LABELS.android).toBe('Android');
    expect(DEVICE_LABELS.ipad).toBe('iPad');
  });
});
