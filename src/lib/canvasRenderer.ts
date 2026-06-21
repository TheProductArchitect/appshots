import { Screenshot, DeviceCategory } from './types';

// ─── Image cache ─────────────────────────────────────────────────────────────

const imageCache = new Map<string, HTMLImageElement>();

async function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) return imageCache.get(src)!;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imageCache.set(src, img); resolve(img); };
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

export function clearImageCache(url: string) {
  imageCache.delete(url);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const boxAspect = w / h;
  let dw: number, dh: number, dx: number, dy: number;
  if (imgAspect > boxAspect) {
    dh = h; dw = dh * imgAspect;
    dx = x - (dw - w) / 2; dy = y;
  } else {
    dw = w; dh = dw / imgAspect;
    dx = x; dy = y - (dh - h) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * Draw an image inside a box with cover-fill, then apply additional zoom and
 * vertical crop offset so the user can pick which part of the screenshot to show.
 * @param offsetY  0 = top, 0.5 = center, 1 = bottom
 * @param zoom     1.0 = no extra zoom, 2.0 = 2× zoom
 */
function drawImagePositioned(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number,
  w: number, h: number,
  offsetY = 0.5,
  zoom = 1.0,
) {
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const boxAspect = w / h;

  // Base cover dimensions
  let baseW: number, baseH: number;
  if (imgAspect > boxAspect) {
    baseH = h; baseW = baseH * imgAspect;
  } else {
    baseW = w; baseH = baseW / imgAspect;
  }

  // Apply extra zoom
  const dw = baseW * zoom;
  const dh = baseH * zoom;

  // Always center horizontally
  const dx = x - (dw - w) / 2;

  // Vertical: slide within the overflow range
  const vertSlack = Math.max(0, dh - h);
  const dy = y - vertSlack * offsetY;

  ctx.drawImage(img, dx, dy, dw, dh);
}

function getWrappedLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// ─── Background drawing ────────────────────────────────────────────────────

async function drawBackground(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  screenshot: Screenshot,
) {
  if (screenshot.bgType === 'image' && screenshot.bgImage) {
    try {
      const bgImg = await loadImage(screenshot.bgImage);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.clip();
      drawImageCover(ctx, bgImg, 0, 0, W, H);
      ctx.restore();
      ctx.fillStyle = screenshot.textColor === 'light'
        ? 'rgba(0,0,0,0.32)'
        : 'rgba(255,255,255,0.28)';
      ctx.fillRect(0, 0, W, H);
    } catch {
      ctx.fillStyle = screenshot.bgColor1;
      ctx.fillRect(0, 0, W, H);
    }
  } else if (screenshot.bgType === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, screenshot.bgColor1);
    grad.addColorStop(1, screenshot.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Radial glow always added for gradient backgrounds
    const glow = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H * 0.38, W * 0.72);
    glow.addColorStop(0, 'rgba(255,255,255,0.16)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = screenshot.bgColor1;
    ctx.fillRect(0, 0, W, H);
  }
}

// ─── Device frame drawing ─────────────────────────────────────────────────

function getDeviceSize(W: number, device: DeviceCategory) {
  if (device === 'ipad') {
    const deviceW = W * 0.68;
    return { deviceW, deviceH: deviceW * (2732 / 2048), borderRadius: deviceW * 0.055 };
  }
  const deviceW = W * 0.52;
  return { deviceW, deviceH: deviceW * 2.165, borderRadius: deviceW * 0.11 };
}

function drawDeviceShadowAndFrame(
  ctx: CanvasRenderingContext2D,
  deviceX: number, deviceY: number,
  deviceW: number, deviceH: number,
  r: number,
  scale: number,
) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.48)';
  ctx.shadowBlur = 55 * scale;
  ctx.shadowOffsetY = 26 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  roundedRect(ctx, deviceX, deviceY, deviceW, deviceH, r);
  ctx.fill();
  ctx.restore();
}

function drawCameraIndicator(
  ctx: CanvasRenderingContext2D,
  deviceX: number, deviceY: number,
  deviceW: number,
  scale: number,
  device: DeviceCategory,
) {
  if (device === 'iphone') {
    // Dynamic Island pill
    const pillW = deviceW * 0.22;
    const pillH = Math.max(8, 19 * scale);
    ctx.fillStyle = '#111827';
    roundedRect(ctx, deviceX + (deviceW - pillW) / 2, deviceY + 8 * scale, pillW, pillH, pillH / 2);
    ctx.fill();
  } else if (device === 'android') {
    // Punch-hole circle
    const camR = Math.max(4, 7 * scale);
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(deviceX + deviceW / 2, deviceY + 18 * scale, camR, 0, Math.PI * 2);
    ctx.fill();
  } else if (device === 'ipad') {
    // Front camera top center
    const camR = Math.max(3, 5 * scale);
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(deviceX + deviceW / 2, deviceY + 12 * scale, camR, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Feature Graphic layout (landscape banner) ────────────────────────────

async function renderFeatureGraphic(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  screenshot: Screenshot,
  logo: string | null,
  screenshotImg: HTMLImageElement,
  logoImg: HTMLImageElement | null
) {
  const textColor = screenshot.textColor === 'light' ? '#ffffff' : '#1d1d1b';
  const pad = W * 0.06;
  const scale = H / 500;

  // Left half: logo + text
  const rightZoneX = W * 0.5;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  let y = H * 0.28;

  if (logoImg) {
    const logoSize = 52 * scale;
    ctx.save();
    roundedRect(ctx, pad, y - logoSize / 2, logoSize, logoSize, 10 * scale);
    ctx.clip();
    ctx.drawImage(logoImg, pad, y - logoSize / 2, logoSize, logoSize);
    ctx.restore();
    y += logoSize / 2 + 18 * scale;
  }

  const headlineSize = Math.max(16, 38 * scale);
  ctx.font = `900 ${headlineSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.fillStyle = textColor;
  const maxTextW = rightZoneX - pad * 1.8;
  const headline = screenshot.headline || 'your headline.';
  const hLines = getWrappedLines(ctx, headline, maxTextW);
  const lineH = headlineSize * 1.22;
  ctx.textBaseline = 'top';
  hLines.forEach((line, i) => ctx.fillText(line, pad, y + i * lineH));
  y += hLines.length * lineH + 8 * scale;

  if (screenshot.subtitle) {
    const subSize = Math.max(11, 20 * scale);
    ctx.font = `500 ${subSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.fillStyle = screenshot.textColor === 'light' ? 'rgba(255,255,255,0.72)' : '#6b7280';
    ctx.fillText(screenshot.subtitle, pad, y);
  }

  // Right half: device mockup (tall, cropped to show top of the app)
  const deviceW = H * 0.48;
  const deviceH = deviceW * 2.165;
  const deviceX = rightZoneX + (W - rightZoneX - deviceW) / 2;
  const deviceY = H - deviceH * 0.55; // show top 55% of device

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = 10 * scale;
  ctx.fillStyle = '#111827';
  const bw = 8 * scale;
  const r = deviceW * 0.11;
  roundedRect(ctx, deviceX - bw, deviceY - bw, deviceW + bw * 2, deviceH + bw * 2, r + bw);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRect(ctx, deviceX, deviceY, deviceW, deviceH, r);
  ctx.clip();
  drawImagePositioned(
    ctx, screenshotImg, deviceX, deviceY, deviceW, deviceH,
    screenshot.screenshotOffsetY / 100,
    screenshot.screenshotZoom / 100,
  );
  ctx.restore();
}

// ─── Main portrait creative renderer ─────────────────────────────────────

async function renderPortraitCreative(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  screenshot: Screenshot,
  logo: string | null,
  screenshotImg: HTMLImageElement,
  logoImg: HTMLImageElement | null,
  device: DeviceCategory
) {
  const scale = W / 1284;
  const pad = W * 0.09;
  const textColor = screenshot.textColor === 'light' ? '#ffffff' : '#1d1d1b';

  let y = H * 0.065;

  // Logo
  if (logoImg) {
    const logoSize = 88 * scale;
    const lx = (W - logoSize) / 2;
    ctx.save();
    roundedRect(ctx, lx, y, logoSize, logoSize, 18 * scale);
    ctx.clip();
    ctx.drawImage(logoImg, lx, y, logoSize, logoSize);
    ctx.restore();
    y += logoSize + 26 * scale;
  }

  // Headline
  const headlineSize = Math.max(18, 62 * scale);
  ctx.font = `900 ${headlineSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const maxTextW = W - pad * 2;
  const headline = screenshot.headline || 'your headline.';
  const headlineLines = getWrappedLines(ctx, headline, maxTextW);
  const lineH = headlineSize * 1.22;
  headlineLines.forEach((line, i) => ctx.fillText(line, W / 2, y + i * lineH));
  y += headlineLines.length * lineH + 12 * scale;

  // Subtitle
  if (screenshot.subtitle) {
    const subSize = Math.max(12, 27 * scale);
    ctx.font = `500 ${subSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.fillStyle = screenshot.textColor === 'light' ? 'rgba(255,255,255,0.72)' : '#6b7280';
    const subLines = getWrappedLines(ctx, screenshot.subtitle, maxTextW);
    subLines.forEach((line, i) => ctx.fillText(line, W / 2, y + i * subSize * 1.4));
    y += subLines.length * subSize * 1.4 + 12 * scale;
  }

  // Device mockup — position slider moves the whole frame up/down
  const { deviceW, deviceH, borderRadius: r } = getDeviceSize(W, device);
  const deviceX = (W - deviceW) / 2;
  const snapY = y + 4 * scale;                       // position 0: snug below text
  const farY  = H - deviceH * 0.45;                  // position 100: mostly off screen
  const deviceY = snapY + Math.max(0, farY - snapY) * (screenshot.screenshotOffsetY / 100);

  drawDeviceShadowAndFrame(ctx, deviceX, deviceY, deviceW, deviceH, r, scale);

  // Clip screenshot into device — always center-fill, zoom applies
  ctx.save();
  roundedRect(ctx, deviceX, deviceY, deviceW, deviceH, r);
  ctx.clip();
  drawImagePositioned(
    ctx, screenshotImg, deviceX, deviceY, deviceW, deviceH,
    0.5,                             // always vertically centered inside the frame
    screenshot.screenshotZoom / 100,
  );
  ctx.restore();

  drawCameraIndicator(ctx, deviceX, deviceY, deviceW, scale, device);
}

// ─── Public API ───────────────────────────────────────────────────────────

export async function renderCreative(
  canvas: HTMLCanvasElement,
  screenshot: Screenshot,
  logo: string | null,
  device: DeviceCategory = 'iphone',
  isFeatureGraphic = false
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  const [screenshotImg, logoImg] = await Promise.all([
    loadImage(screenshot.url),
    logo ? loadImage(logo).catch(() => null) : Promise.resolve(null),
  ]);

  ctx.clearRect(0, 0, W, H);
  await drawBackground(ctx, W, H, screenshot);

  if (isFeatureGraphic) {
    await renderFeatureGraphic(ctx, W, H, screenshot, logo, screenshotImg, logoImg);
  } else {
    await renderPortraitCreative(ctx, W, H, screenshot, logo, screenshotImg, logoImg, device);
  }
}
