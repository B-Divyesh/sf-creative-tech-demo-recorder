import type { DemoTake } from './types';

export function supportedMimeType(): string {
  const options = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  return options.find((mime) => MediaRecorder.isTypeSupported(mime)) || '';
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

export function safeFilename(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'demo-loop';
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function waitFor(target: HTMLMediaElement, event: keyof HTMLMediaElementEventMap): Promise<void> {
  return new Promise((resolve, reject) => {
    target.addEventListener(event, () => resolve(), { once: true });
    target.addEventListener('error', () => reject(new Error('Could not read the captured frame.')), { once: true });
  });
}

export async function makePoster(take: DemoTake, maxWidth: number): Promise<Blob> {
  const video = document.createElement('video');
  const url = URL.createObjectURL(take.video);
  video.src = url;
  video.muted = true;
  video.playsInline = true;
  await waitFor(video, 'loadedmetadata');
  const moment = Math.min(Math.max(take.beatMs / 1000, 0), Math.max(video.duration - 0.05, 0));
  video.currentTime = Number.isFinite(moment) ? moment : 0;
  await waitFor(video, 'seeked');

  const scale = Math.min(1, maxWidth / video.videoWidth);
  const width = Math.max(640, Math.round(video.videoWidth * scale));
  const sourceHeight = Math.round(video.videoHeight * scale);
  const footer = Math.round(width * 0.18);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = sourceHeight + footer;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Poster canvas unavailable.');

  context.fillStyle = '#1D1A17';
  context.fillRect(0, 0, width, canvas.height);
  context.drawImage(video, 0, 0, width, sourceHeight);
  context.fillStyle = '#FFF9EB';
  context.fillRect(0, sourceHeight, width, footer);
  context.fillStyle = '#E94E3D';
  context.fillRect(0, sourceHeight, Math.round(width * 0.022), footer);
  context.fillStyle = '#1D1A17';
  const titleSize = Math.max(24, Math.round(width * 0.037));
  const metaSize = Math.max(14, Math.round(width * 0.017));
  context.font = `700 ${titleSize}px system-ui, sans-serif`;
  context.fillText(take.caption || take.title, Math.round(width * 0.055), sourceHeight + Math.round(footer * 0.48), width * 0.79);
  context.font = `600 ${metaSize}px ui-monospace, monospace`;
  context.fillStyle = '#625B50';
  context.fillText(`INTERACTION BEAT · ${formatTime(take.beatMs)}`, Math.round(width * 0.055), sourceHeight + Math.round(footer * 0.76));
  context.fillStyle = '#006A71';
  context.beginPath();
  context.arc(width - Math.round(width * 0.075), sourceHeight + footer / 2, Math.round(width * 0.026), 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#FFF9EB';
  context.beginPath();
  context.moveTo(width - Math.round(width * 0.085), sourceHeight + footer / 2 - Math.round(width * 0.014));
  context.lineTo(width - Math.round(width * 0.085), sourceHeight + footer / 2 + Math.round(width * 0.014));
  context.lineTo(width - Math.round(width * 0.062), sourceHeight + footer / 2);
  context.fill();
  URL.revokeObjectURL(url);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Poster export failed.')), 'image/png'));
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header = '', encoded = ''] = dataUrl.split(',');
  const type = /data:([^;]+)/.exec(header)?.[1] || 'application/octet-stream';
  const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
  return new Blob([bytes], { type });
}

export async function makeBackup(takes: DemoTake[]): Promise<Blob> {
  const records = await Promise.all(takes.map(async (take) => ({
    ...take,
    video: await blobToDataUrl(take.video),
    poster: take.poster ? await blobToDataUrl(take.poster) : undefined,
  })));
  return new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), takes: records }, null, 2)], { type: 'application/json' });
}

export async function readBackup(file: File): Promise<DemoTake[]> {
  const data = JSON.parse(await file.text()) as { version?: number; takes?: Array<Omit<DemoTake, 'video' | 'poster'> & { video: string; poster?: string }> };
  if (data.version !== 1 || !Array.isArray(data.takes)) throw new Error('That is not a Demo Loop v1 backup.');
  return data.takes.map((take) => ({ ...take, video: dataUrlToBlob(take.video), poster: take.poster ? dataUrlToBlob(take.poster) : undefined }));
}
