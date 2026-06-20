import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Screenshot, DeviceCategory, TemplateType } from './types';
import { EXPORT_DIMENSIONS } from './constants';
import { renderCreative } from './canvasRenderer';

export async function exportCategory(
  screenshots: Screenshot[],
  logo: string | null,
  template: TemplateType,
  device: DeviceCategory,
  selectedDimensionIds: string[]
): Promise<{ ios: JSZip; android: JSZip }> {
  const ios = new JSZip();
  const android = new JSZip();

  const dims = EXPORT_DIMENSIONS.filter(
    d => d.device === device && selectedDimensionIds.includes(d.id)
  );

  for (let i = 0; i < screenshots.length; i++) {
    const shot = screenshots[i];
    const safeName = shot.headline
      ? shot.headline.replace(/[^a-z0-9]/gi, '_').slice(0, 24).replace(/_+$/, '')
      : `screen_${i + 1}`;

    for (const dim of dims) {
      const canvas = document.createElement('canvas');
      canvas.width = dim.width;
      canvas.height = dim.height;

      await renderCreative(
        canvas, shot, logo, template, device,
        dim.type === 'feature_graphic'
      );

      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) continue;

      const folder = dim.platform === 'ios' ? ios : android;
      const typePrefix = dim.type === 'icon' ? 'icon' : dim.type === 'feature_graphic' ? 'feature' : dim.name.replace(/ /g, '_');
      folder.file(`${device}/${typePrefix}_${safeName}.png`, blob);
    }
  }

  return { ios, android };
}

export async function exportAllCategories(
  categories: Record<DeviceCategory, { screenshots: Screenshot[]; template: TemplateType }>,
  logo: string | null,
  selectedDimensionIds: string[]
): Promise<void> {
  const zip = new JSZip();
  const ios = zip.folder('iOS')!;
  const android = zip.folder('Android')!;

  for (const device of ['iphone', 'android', 'ipad'] as DeviceCategory[]) {
    const cat = categories[device];
    if (cat.screenshots.length === 0) continue;

    const { ios: catIos, android: catAndroid } = await exportCategory(
      cat.screenshots, logo, cat.template, device, selectedDimensionIds
    );

    // Merge into main zip
    const iosFiles = catIos.files;
    for (const [path, file] of Object.entries(iosFiles)) {
      ios.file(path, await file.async('blob'));
    }
    const androidFiles = catAndroid.files;
    for (const [path, file] of Object.entries(androidFiles)) {
      android.file(path, await file.async('blob'));
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'AppStoreAssets.zip');
}

export async function exportSingleCategory(
  screenshots: Screenshot[],
  logo: string | null,
  template: TemplateType,
  device: DeviceCategory,
  selectedDimensionIds: string[]
): Promise<void> {
  const zip = new JSZip();
  const ios = zip.folder('iOS')!;
  const android = zip.folder('Android')!;

  const { ios: catIos, android: catAndroid } = await exportCategory(
    screenshots, logo, template, device, selectedDimensionIds
  );

  for (const [path, file] of Object.entries(catIos.files)) {
    ios.file(path, await file.async('blob'));
  }
  for (const [path, file] of Object.entries(catAndroid.files)) {
    android.file(path, await file.async('blob'));
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `AppStoreAssets_${device}.zip`);
}
