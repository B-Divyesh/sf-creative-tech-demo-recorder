import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 1 });
await page.setContent('<canvas width="640" height="360" aria-label="Animated controller changing a projected shape field"></canvas>');

const recording = page.evaluate(async () => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const start = performance.now();
  let frame = 0;
  const draw = () => {
    const seconds = (performance.now() - start) / 1000;
    const active = seconds >= 9.2;
    context.fillStyle = '#f3ebd8';
    context.fillRect(0, 0, 640, 360);
    context.fillStyle = '#1d1a17';
    context.fillRect(24, 24, 592, 312);
    context.fillStyle = '#fff9eb';
    context.fillRect(38, 38, 360, 284);
    context.fillStyle = '#006a71';
    for (let index = 0; index < 8; index += 1) {
      const wave = Math.sin(seconds * (active ? 2.1 : .35) + index * .8) * (active ? 38 : 7);
      context.fillRect(62 + index * 38, 166 + wave, 25, active ? 88 : 34);
    }
    context.fillStyle = '#e94e3d';
    context.fillRect(424, 58, 164, 244);
    context.strokeStyle = '#fff9eb';
    context.lineWidth = 7;
    context.beginPath();
    context.arc(506, 180, 55, 0, Math.PI * 2);
    context.stroke();
    context.save();
    context.translate(506, 180);
    context.rotate(active ? Math.min((seconds - 9.2) * .9, 2.5) : Math.sin(seconds) * .08);
    context.fillStyle = '#f2c84b';
    context.fillRect(-8, -48, 16, 58);
    context.restore();
    context.fillStyle = '#f2c84b';
    context.fillRect(38, 308, active ? 360 : Math.min(360, seconds * 39), 14);
    context.fillStyle = '#e94e3d';
    context.fillRect(38 + 360 * (9.2 / 24), 302, 5, 26);
    frame += 1;
    if (frame < 24 * 12) setTimeout(draw, 1000 / 12);
  };
  draw();
  const stream = canvas.captureStream(12);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 260_000 });
  const chunks = [];
  recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
  const stopped = new Promise((resolve) => { recorder.onstop = resolve; });
  recorder.start(1000);
  await new Promise((resolve) => setTimeout(resolve, 24_000));
  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());
  const blob = new Blob(chunks, { type: 'video/webm' });
  return await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.readAsDataURL(blob); });
});

await page.waitForTimeout(9_500);
await page.locator('canvas').screenshot({ path: 'public/assets/sample-controller-poster.png' });
const base64 = await recording;
await writeFile('public/assets/sample-controller.webm', Buffer.from(base64, 'base64'));
await browser.close();
