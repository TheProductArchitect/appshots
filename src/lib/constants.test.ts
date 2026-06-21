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
    // App Store requires at least one of these
    expect(ids).toContain('ios-69');   // 6.9" — required by Apple
    expect(ids).toContain('ios-55');   // 5.5" — required by Apple
    expect(ids).toContain('ios-ipad'); // 12.9" iPad — required
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
});

describe('DEVICE_LABELS', () => {
  it('has a label for every device category', () => {
    expect(DEVICE_LABELS.iphone).toBe('iPhone');
    expect(DEVICE_LABELS.android).toBe('Android');
    expect(DEVICE_LABELS.ipad).toBe('iPad');
  });
});
