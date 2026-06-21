export type DeviceCategory = 'iphone' | 'android' | 'ipad';
export type TemplateType = 'standard-gradient' | 'clean-mockup';
export type ExportPlatform = 'ios' | 'android';

export interface ExportDimension {
  id: string;
  name: string;
  width: number;
  height: number;
  platform: ExportPlatform;
  type: 'icon' | 'screenshot' | 'feature_graphic';
  device: DeviceCategory;
  required?: boolean;
  notes?: string;
}

export interface Screenshot {
  id: string;
  url: string;
  headline: string;
  subtitle: string;
  bgType: 'solid' | 'gradient' | 'image';
  bgColor1: string;
  bgColor2: string;
  bgImage: string | null;
  textColor: 'light' | 'dark';
  /** Vertical position of the device mockup in the creative: 0 = snug below text, 100 = mostly off screen */
  screenshotOffsetY: number;
  /** Extra zoom applied on top of cover-fill: 100 = none, 200 = 2× */
  screenshotZoom: number;
}

export interface CategoryState {
  screenshots: Screenshot[];
}
