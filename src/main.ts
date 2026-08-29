import './styles.css';
import { clearDemoTakes, importTakes, listTakes, putTake, removeTake, type StorageMode } from './db';
import { captureReturnedLicense, checkoutUrl, isOptimisticallyUnlocked, restoreLicense, verifyLicense } from './license';
import { downloadBlob, formatTime, makeBackup, makePoster, readBackup, safeFilename, supportedMimeType } from './media';
import type { CaptureStatus, DemoTake } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const SITE = 'https://creative-tech-demo-recorder.sociobot.in';
const BUILD = '1.3.1';
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);

type PageMeta = { title: string; description: string; canonical: string };

function setMeta(meta: PageMeta): void {
  document.title = meta.title;
  const values: Record<string, string> = {
    'meta[name="description"]': meta.description,
    'meta[property="og:title"]': meta.title,
    'meta[property="og:description"]': meta.description,
    'meta[property="og:url"]': `${SITE}${meta.canonical}`,
    'meta[name="twitter:title"]': meta.title,
    'meta[name="twitter:description"]': meta.description,
  };
  Object.entries(values).forEach(([selector, value]) => document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value));
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `${SITE}${meta.canonical}`);
}

function shell(content: string, demo = false): string {
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Demo Loop home">
        <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="m33 8 9 3-5 8"/><path class="play" d="m20 17 13 7-13 7z"/></svg>
        <span>Demo Loop</span>
      </a>
      <nav aria-label="Primary navigation"><a href="/demo">Demo</a><a href="/#recorder">Record</a><a href="/privacy">Privacy</a></nav>
    </header>
    ${demo ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span>Changes stay in a separate demo workspace.</span><div><button type="button" id="reset-demo">Reset demo</button><a href="/" id="start-real">Start for real</a></div></aside>` : ''}
    <div class="connection-note" id="connection-note" role="status" hidden><span>Offline</span> The recorder and saved recordings remain available.</div>
    ${content}
    <footer class="site-footer">
      <p><strong>Demo Loop</strong> · Record browser interactions for a portfolio.</p>
      <nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://sociobot.in/" rel="external">Built by Param Factory</a></nav>
      <p class="art-credit">Build ${BUILD} · Original AI-assisted illustration.</p>
    </footer>
    <div class="toast" id="update-toast" role="status" hidden>An update is ready. <button type="button" id="reload-app">Update app</button></div>`;
}

const hero = `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow"><span>PORTFOLIO TOOL</span> / BROWSER RECORDER</p>
      <h1 id="hero-title">Record a browser interaction for your portfolio</h1>
      <p class="hero-lede">For creative-technology students who need a 20–45 second video of a prototype working.</p>
      <div class="hero-actions"><a class="button button-coral" href="/demo">Try it with sample data</a><span class="action-note">Opens a finished recording, poster, and marked beat.</span></div>
      <ul class="hero-facts"><li>Media stays in this browser</li><li>Nothing is uploaded</li><li>Choose 20, 30, or 45 seconds</li></ul>
    </div>
    <figure class="hero-art">
      <picture>
        <source type="image/avif" srcset="/assets/hero-risograph.avif" />
        <source type="image/webp" srcset="/assets/hero-risograph-768.webp 768w, /assets/hero-risograph.webp 1280w" sizes="(max-width: 760px) 100vw, 54vw" />
        <img src="/assets/hero-risograph.webp" width="1280" height="853" alt="A hand presses a handmade controller while shapes react on a prototype screen." fetchpriority="high" decoding="async" />
      </picture>
      <figcaption><span>INPUT</span><i aria-hidden="true"></i><span>VISIBLE RESPONSE</span></figcaption>
    </figure>
  </section>`;

function recorderMarkup(demo: boolean): string {
  return `
    ${demo ? `<section class="demo-intro" aria-labelledby="demo-title"><p class="eyebrow"><span>SAMPLE WORKSPACE</span> / ISOLATED</p><h1 id="demo-title">Review a sample recording</h1><p>See the controller response at the marked beat.</p></section>` : ''}
    <section class="recorder-section${demo ? ' demo-recorder' : ''}" id="recorder" ${demo ? 'aria-label="Sample recording and recording setup"' : 'aria-labelledby="recorder-title"'}>
      ${demo ? '' : `<div class="section-heading">
        <p class="eyebrow">RECORD YOUR INTERACTION</p>
        <h2 id="recorder-title">Record, mark the beat, and export</h2>
        <p>Select a tab or window. Mark the response while recording, then export the video and poster.</p>
      </div>
      <ol class="station-tabs" aria-label="Recording steps">
        <li class="active"><b>01</b> Record</li><li><b>02</b> Mark the beat</li><li><b>03</b> Export</li>
      </ol>`}
      <div class="recorder-grid">
        <form class="setup-panel" id="capture-form">
          <div class="field"><label for="take-title">Recording name</label><input id="take-title" maxlength="48" value="${demo ? 'Kinetic type controller' : 'Portfolio interaction'}" autocomplete="off" /></div>
          <div class="field"><label for="take-caption">One-line caption <small><span id="caption-count">${demo ? '47' : '0'}</span>/90</small></label><textarea id="take-caption" maxlength="90" rows="3" placeholder="Turning the dial bends the projected type.">${demo ? 'Turning the dial stretches the projected letters.' : ''}</textarea></div>
          <div class="field"><label for="duration">Maximum length</label><select id="duration"><option value="20">20 seconds</option><option value="30" selected>30 seconds</option><option value="45">45 seconds</option></select></div>
          <label class="check-row" for="use-mic"><input id="use-mic" type="checkbox" /><span><b>Add microphone</b><small>Requested after screen access</small></span></label>
          <button class="button button-coral button-wide" type="submit" id="start-button"><span class="record-dot" aria-hidden="true"></span> Choose a tab and record</button>
          <p class="support-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z"/></svg> Screen permission starts only after this button. Media does not leave the browser.</p>
        </form>
        <div class="stage-panel" id="stage-panel">
          ${demo ? `<div class="demo-sample-meta"><strong>Kinetic type controller</strong><span>Turning the dial stretches the projected letters.</span></div>` : ''}
          <div class="stage-topline"><span id="stage-label">READY / NO SIGNAL</span><output id="timer">00:00</output></div>
          <div class="video-stage">
            <video id="preview" playsinline muted controls hidden></video>
            <div class="empty-signal" id="empty-signal"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="28"/><path d="m34 28 22 12-22 12z"/><path d="M6 40h12M62 40h12M40 6v12M40 62v12"/></svg><strong>Your selected tab appears here</strong><span>Show the input before the response.</span></div>
            <div class="recording-badge" id="recording-badge" hidden><i></i> REC</div>
          </div>
          <div class="timeline" aria-label="Interaction timeline"><div class="timeline-track"><span id="timeline-progress"></span><i id="beat-notch" hidden></i></div><div class="timeline-labels"><span>START</span><span id="beat-label">BEAT — NOT MARKED</span><span id="end-label">00:30</span></div></div>
          <div class="record-actions" id="record-actions" hidden><button class="button button-yellow" type="button" id="mark-beat">Mark interaction <kbd>M</kbd></button><button class="button button-ink" type="button" id="stop-recording">Finish recording <kbd>S</kbd></button></div>
          <div class="review-controls" id="review-controls" hidden><label for="beat-range">Poster frame / interaction beat <output id="beat-time">00:00</output></label><input type="range" id="beat-range" min="0" max="1000" value="500" /><div class="export-actions"><button class="button button-cyan" type="button" id="export-video">Export WebM</button><button class="button button-yellow" type="button" id="export-poster">Export PNG poster</button><button class="button button-plain" type="button" id="new-take">Record another interaction</button></div></div>
          <p class="status-message" id="status-message" role="status" aria-live="polite">Ready to record.</p>
        </div>
      </div>
    </section>
    <section class="method-section" id="method" aria-labelledby="method-title"><div><p class="eyebrow">HOW IT WORKS</p><h2 id="method-title">Show an interaction clearly</h2></div><ol><li><span>INPUT</span><h3>Show the control</h3><p>Keep the cursor, hand, or control visible before the action.</p></li><li><span>BEAT</span><h3>Mark the response</h3><p>Press M when it happens. That frame becomes the poster.</p></li><li><span>RESULT</span><h3>Hold the result</h3><p>Wait a few seconds so a reviewer can read the change.</p></li></ol></section>
    <section class="shelf-section" id="recordings" aria-labelledby="shelf-title"><div class="shelf-heading"><div><p class="eyebrow">SAVED RECORDINGS</p><h2 id="shelf-title">Recent recordings</h2></div><div class="backup-actions"><button class="text-button" id="backup-button" type="button">Export JSON backup</button><label class="text-button" for="restore-input">Import JSON backup<input id="restore-input" type="file" accept="application/json" hidden /></label></div></div><div id="take-list" class="take-list"><p class="shelf-empty">Loading recordings…</p></div></section>`;
}

const boundaries = `
  <section class="boundaries-section" aria-labelledby="boundaries-title"><p class="eyebrow">PRIVACY AND LIMITS</p><h2 id="boundaries-title">What Demo Loop does not do</h2><ul><li>It does not upload recordings.</li><li>It does not replace an archival video editor.</li></ul><a href="/privacy">Read the privacy details</a></section>`;

const unlock = `
  <section class="unlock-section" id="unlock" aria-labelledby="unlock-title"><div class="unlock-mark" aria-hidden="true"><span>4+</span></div><div class="unlock-copy"><p class="eyebrow">LOOP PASS / ONE-TIME</p><h2 id="unlock-title">Loop Pass removes the three-recording limit</h2><p>The free plan saves three recordings. WebM, PNG, and JSON exports remain available.</p><p>Loop Pass costs $9 once. It saves more than three recordings and exports 1920-pixel posters from large sources.</p><ul><li>$9 one-time checkout through Sociobot</li><li>Restore the license on another device</li><li>No three-recording limit after verification</li></ul></div><div class="license-box"><div class="price"><b>$9</b><span>USD<br>ONE TIME</span></div><a class="button button-coral button-wide" href="${checkoutUrl}" id="buy-link">Buy Loop Pass</a><p id="license-state" role="status">No license on this browser.</p><details><summary>Have a license?</summary><form id="license-form"><label for="license-token">Paste license token</label><input id="license-token" required autocomplete="off" /><button class="button button-ink" type="submit" aria-label="Verify license">Verify license</button></form></details><p class="checkout-note">Checkout starts on Sociobot and opens a Dodo payment page. <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></p></div></section>`;

function homePage(demo: boolean): void {
  setMeta(demo ? { title: 'Demo — Demo Loop', description: 'Try a finished browser interaction recording in an isolated sample workspace.', canonical: '/demo' } : { title: 'Demo Loop — Record browser interactions', description: 'Record a browser prototype, mark its interaction beat, and export a WebM and poster for your portfolio.', canonical: '/' });
  app.innerHTML = shell(`<main id="main">${demo ? '' : hero}${recorderMarkup(demo)}${boundaries}${demo ? '' : unlock}</main>`, demo);
  wirePageChrome(demo);
  void wireRecorder(demo ? 'demo' : 'real', routeController.signal);
}

function legalPage(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  setMeta(privacy ? { title: 'Privacy — Demo Loop', description: 'How Demo Loop stores recordings and license data.', canonical: '/privacy' } : { title: 'Terms — Demo Loop', description: 'Terms for recording, local storage, exports, and Loop Pass.', canonical: '/terms' });
  const body = privacy ? `
    <p class="lede">Your recordings remain under your control.</p><h2>What stays local</h2><p>Recordings, captions, beat markers, and posters use browser storage. Demo Loop does not upload them.</p><h2>Screen and microphone access</h2><p>The browser asks after you choose to record. Microphone access is optional.</p><h2>Purchases</h2><p>Checkout starts on Sociobot and opens a Dodo payment page. Demo Loop stores your license token and last verification result in this browser.</p><h2>Network requests</h2><p>License verification uses the Sociobot API after you add a license.</p><h2>Your control</h2><p>Export a JSON backup or delete a recording.</p>` : `
    <p class="lede">Use Demo Loop only for material you may record.</p><h2>The tool</h2><p>Demo Loop creates short WebM recordings and PNG posters. Browser capture and codec support vary.</p><h2>Your responsibility</h2><p>You need permission to record each screen, sound, and work. Do not capture private or confidential material without permission.</p><h2>Loop Pass</h2><p>Loop Pass costs $9 once. It saves more than three recordings and exports 1920-pixel posters from large sources.</p><p>Checkout starts on Sociobot and opens a Dodo payment page. A revoked license stops paid features.</p><p>Recording, WebM, PNG, and JSON backup exports remain free.</p><h2>Local storage</h2><p>Export work you need to keep. Device cleanup, private browsing, or manual deletion can remove browser storage.</p><h2>Changes</h2><p>These terms are effective 28 August 2026. Material changes will appear on this page.</p>`;
  app.innerHTML = shell(`<main id="main" class="legal-page"><p class="eyebrow">LEGAL</p><h1>${privacy ? 'Privacy' : 'Terms'}</h1>${body}<a class="button button-ink" href="/">Return home</a></main>`);
  wirePageChrome(false);
}

function notFoundPage(): void {
  setMeta({ title: 'Page not found — Demo Loop', description: 'This Demo Loop page does not exist. Return to the recorder or open the sample demo.', canonical: '/404' });
  app.innerHTML = shell(`<main id="main" class="not-found"><p class="eyebrow"><span>ERROR 404</span></p><h1>Page not found</h1><p>The address does not match a Demo Loop page.</p><div><a class="button button-coral" href="/">Return home</a><a class="button button-yellow" href="/demo">Open sample demo</a></div></main>`);
  wirePageChrome(false);
}

function wirePageChrome(demo: boolean): void {
  updateConnectionNote();
  document.querySelector('#reload-app')?.addEventListener('click', () => location.reload());
  if (demo) {
    document.querySelector('#reset-demo')?.addEventListener('click', async () => { await clearDemoTakes(); location.reload(); });
    document.querySelector('#start-real')?.addEventListener('click', async (event) => { event.preventDefault(); await clearDemoTakes(); navigate('/'); });
  }
}

async function seedDemo(): Promise<DemoTake[]> {
  const existing = await listTakes('demo');
  if (existing.length) return existing;
  const [videoResponse, posterResponse] = await Promise.all([fetch('/assets/sample-controller.webm'), fetch('/assets/sample-controller-poster.png')]);
  if (!videoResponse.ok || !posterResponse.ok) throw new Error('Sample media could not be loaded. Reload the demo while online.');
  const sample: DemoTake = { id: 'demo-controller-01', title: 'Kinetic type controller', caption: 'Turning the dial stretches the projected letters.', beatMs: 9_200, durationMs: 24_000, createdAt: '2026-08-28T12:00:00.000Z', mimeType: 'video/webm', video: await videoResponse.blob(), poster: await posterResponse.blob() };
  await putTake('demo', sample);
  return [sample];
}

async function wireRecorder(mode: StorageMode, routeSignal: AbortSignal): Promise<void> {
  const demo = mode === 'demo';
  if (!demo) captureReturnedLicense();
  let unlocked = demo ? false : isOptimisticallyUnlocked();
  let recordings = await (demo ? seedDemo() : listTakes('real')).catch((error) => { document.querySelector('#status-message')!.textContent = error instanceof Error ? error.message : 'Saved recordings could not be opened.'; return [] as DemoTake[]; });
  if (routeSignal.aborted) return;
  let status: CaptureStatus = 'idle';
  let activeRecording: DemoTake | null = demo ? recordings[0] || null : null;
  let mediaRecorder: MediaRecorder | null = null;
  let streams: MediaStream[] = [];
  let audioContext: AudioContext | null = null;
  let chunks: BlobPart[] = [];
  let startedAt = 0;
  let beatMs = 0;
  let maxDurationMs = 30_000;
  let timerId = 0;
  let activeUrl = '';
  let activePosterUrl = '';
  const element = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
  const form = element<HTMLFormElement>('#capture-form');
  const startButton = element<HTMLButtonElement>('#start-button');
  const preview = element<HTMLVideoElement>('#preview');
  const emptySignal = element<HTMLElement>('#empty-signal');
  const recordActions = element<HTMLElement>('#record-actions');
  const reviewControls = element<HTMLElement>('#review-controls');
  const statusMessage = element<HTMLElement>('#status-message');
  const stageLabel = element<HTMLElement>('#stage-label');
  const timer = element<HTMLOutputElement>('#timer');
  const progress = element<HTMLElement>('#timeline-progress');
  const beatNotch = element<HTMLElement>('#beat-notch');
  const beatLabel = element<HTMLElement>('#beat-label');
  const endLabel = element<HTMLElement>('#end-label');
  const recordingBadge = element<HTMLElement>('#recording-badge');
  const range = element<HTMLInputElement>('#beat-range');
  const beatTime = element<HTMLOutputElement>('#beat-time');
  const setMessage = (message: string, error = false) => { statusMessage.textContent = message; statusMessage.classList.toggle('error', error); };
  const setStep = (step: number) => document.querySelectorAll('.station-tabs li').forEach((item, index) => item.classList.toggle('active', index + 1 === step));

  function attachRecording(recording: DemoTake): void {
    activeRecording = recording;
    status = 'review';
    if (activeUrl) URL.revokeObjectURL(activeUrl);
    if (activePosterUrl) URL.revokeObjectURL(activePosterUrl);
    activeUrl = URL.createObjectURL(recording.video);
    activePosterUrl = recording.poster ? URL.createObjectURL(recording.poster) : '';
    preview.srcObject = null; preview.src = activeUrl; preview.poster = activePosterUrl; preview.muted = true; preview.controls = true; preview.hidden = false;
    emptySignal.hidden = true; recordActions.hidden = true; reviewControls.hidden = false; recordingBadge.hidden = true;
    stageLabel.textContent = demo ? 'SAMPLE RECORDING / ISOLATED' : 'RECORDING READY / LOCAL';
    timer.textContent = formatTime(recording.durationMs); endLabel.textContent = formatTime(recording.durationMs);
    range.max = String(Math.max(recording.durationMs, 1)); range.value = String(recording.beatMs); beatTime.textContent = formatTime(recording.beatMs);
    beatNotch.hidden = false; beatNotch.style.left = `${Math.min(100, recording.beatMs / Math.max(recording.durationMs, 1) * 100)}%`;
    beatLabel.textContent = `BEAT — ${formatTime(recording.beatMs)}`; progress.style.width = '100%'; setStep(3);
    setMessage(demo ? 'Sample ready. Play it, move the marked beat, or export both files.' : 'Recording saved locally. Export both files or adjust the poster frame.');
  }

  async function renderRecordings(): Promise<void> {
    const list = element<HTMLElement>('#take-list');
    if (!recordings.length) { list.innerHTML = '<div class="shelf-empty"><b>No recordings yet.</b><span>Your next recording will appear here.</span><a href="#recorder">Record an interaction ↑</a></div>'; return; }
    list.innerHTML = recordings.map((recording, index) => {
      const posterUrl = recording.poster ? URL.createObjectURL(recording.poster) : '';
      return `<article class="take-card" data-id="${recording.id}">${posterUrl ? `<img src="${posterUrl}" alt="Poster for ${escapeHtml(recording.title)}" width="360" height="230" loading="lazy" />` : '<div class="take-placeholder" aria-hidden="true">NO POSTER</div>'}<div><p class="take-number">RECORDING ${String(recordings.length - index).padStart(2, '0')}</p><h3>${escapeHtml(recording.title)}</h3><p>${escapeHtml(recording.caption || 'No caption')}</p><span>${formatTime(recording.durationMs)} · ${new Date(recording.createdAt).toLocaleDateString()}</span></div><div class="take-tools"><button type="button" data-open="${recording.id}">Review ${escapeHtml(recording.title)}</button><button type="button" data-delete="${recording.id}">Delete ${escapeHtml(recording.title)}</button></div></article>`;
    }).join('');
    list.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((button) => button.addEventListener('click', () => { const recording = recordings.find((item) => item.id === button.dataset.open); if (recording) { attachRecording(recording); location.hash = 'recorder'; } }));
    list.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((button) => button.addEventListener('click', async () => { const recording = recordings.find((item) => item.id === button.dataset.delete); if (!recording || !confirm(`Delete “${recording.title}”? Export a backup first if you need it.`)) return; await removeTake(mode, recording.id); recordings = recordings.filter((item) => item.id !== recording.id); await renderRecordings(); setMessage(demo ? 'Sample removed from the demo workspace. Reset the demo to restore it.' : 'Recording deleted.'); }));
  }

  function stopTracks(): void { streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop())); streams = []; if (audioContext) void audioContext.close(); audioContext = null; }
  function finishRecording(): void { if (!mediaRecorder || mediaRecorder.state === 'inactive') return; status = 'processing'; mediaRecorder.stop(); stopTracks(); clearInterval(timerId); recordActions.hidden = true; recordingBadge.hidden = true; stageLabel.textContent = 'PROCESSING / LOCAL'; setMessage('Building the recording and poster…'); }
  function markBeat(): void { if (status !== 'recording') return; beatMs = Date.now() - startedAt; beatNotch.hidden = false; beatNotch.style.left = `${Math.min(100, beatMs / maxDurationMs * 100)}%`; beatLabel.textContent = `BEAT — ${formatTime(beatMs)}`; setStep(2); setMessage(`Interaction marked at ${formatTime(beatMs)}. Hold the result, then finish.`); }
  async function buildCaptureStream(screen: MediaStream, microphone: MediaStream | null): Promise<MediaStream> { const output = new MediaStream(screen.getVideoTracks()); const audioTracks = [...screen.getAudioTracks(), ...(microphone?.getAudioTracks() || [])]; if (audioTracks.length === 1) output.addTrack(audioTracks[0]!); if (audioTracks.length > 1) { audioContext = new AudioContext(); const destination = audioContext.createMediaStreamDestination(); audioTracks.forEach((track) => audioContext!.createMediaStreamSource(new MediaStream([track])).connect(destination)); destination.stream.getAudioTracks().forEach((track) => output.addTrack(track)); } return output; }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status === 'requesting' || status === 'recording') return;
    if (!navigator.mediaDevices?.getDisplayMedia || typeof MediaRecorder === 'undefined') { setMessage('This browser cannot record a screen. Use a computer browser with screen capture and WebM support.', true); return; }
    status = 'requesting'; startButton.disabled = true; setMessage('Choose the tab or window you want to record.');
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true }); streams = [screen];
      let microphone: MediaStream | null = null;
      if (element<HTMLInputElement>('#use-mic').checked) { try { microphone = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: false }); streams.push(microphone); } catch { setMessage('The microphone was unavailable. Screen audio will still be recorded when available.'); } }
      const capture = await buildCaptureStream(screen, microphone); const mimeType = supportedMimeType(); mediaRecorder = new MediaRecorder(capture, mimeType ? { mimeType, videoBitsPerSecond: 5_000_000 } : { videoBitsPerSecond: 5_000_000 });
      chunks = []; beatMs = 0; maxDurationMs = Number(element<HTMLSelectElement>('#duration').value) * 1000; endLabel.textContent = formatTime(maxDurationMs);
      mediaRecorder.ondataavailable = (chunk) => { if (chunk.data.size) chunks.push(chunk.data); };
      mediaRecorder.onstop = async () => {
        const durationMs = Math.min(Date.now() - startedAt, maxDurationMs); const video = new Blob(chunks, { type: mediaRecorder?.mimeType || 'video/webm' });
        const recording: DemoTake = { id: crypto.randomUUID(), title: element<HTMLInputElement>('#take-title').value.trim() || 'Untitled interaction', caption: element<HTMLTextAreaElement>('#take-caption').value.trim(), beatMs: beatMs || Math.round(durationMs / 2), durationMs, createdAt: new Date().toISOString(), mimeType: video.type, video };
        try { recording.poster = await makePoster(recording, unlocked ? 1920 : 1280); } catch { setMessage('The video is ready, but the poster failed. Export the WebM and try another recording.', true); }
        const canSave = demo || unlocked || recordings.length < 3;
        if (canSave) { await putTake(mode, recording); recordings = [recording, ...recordings.filter((item) => item.id !== recording.id)]; if (!demo && 'storage' in navigator) void navigator.storage.persist(); await renderRecordings(); }
        attachRecording(recording);
        if (!canSave) setMessage('The video is ready to export. Three recordings are already saved, so this one will close with this tab.', true);
      };
      const videoTrack = screen.getVideoTracks()[0]; if (videoTrack) videoTrack.onended = finishRecording;
      preview.src = ''; preview.srcObject = screen; preview.muted = true; preview.controls = false; preview.hidden = false; await preview.play();
      emptySignal.hidden = true; reviewControls.hidden = true; recordActions.hidden = false; recordingBadge.hidden = false; beatNotch.hidden = true; progress.style.width = '0%'; stageLabel.textContent = 'RECORDING / LOCAL'; setStep(1); status = 'recording'; startedAt = Date.now(); mediaRecorder.start(500);
      timerId = window.setInterval(() => { const elapsed = Date.now() - startedAt; timer.textContent = formatTime(elapsed); progress.style.width = `${Math.min(100, elapsed / maxDurationMs * 100)}%`; if (elapsed >= maxDurationMs) finishRecording(); }, 200);
      setMessage('Recording. Press M when the prototype responds.');
    } catch (error) { stopTracks(); status = 'idle'; setMessage(error instanceof DOMException && error.name === 'NotAllowedError' ? 'Nothing was recorded. Choose Share in the browser prompt when ready.' : 'Recording could not start. Close other screen recorders and try again.', true); }
    finally { startButton.disabled = false; }
  });

  element('#mark-beat').addEventListener('click', markBeat); element('#stop-recording').addEventListener('click', finishRecording);
  document.addEventListener('keydown', (event) => { if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return; if (event.key.toLowerCase() === 'm') markBeat(); if (event.key.toLowerCase() === 's' && status === 'recording') finishRecording(); }, { signal: routeSignal });
  range.addEventListener('input', () => { if (!activeRecording) return; activeRecording.beatMs = Number(range.value); beatTime.textContent = formatTime(activeRecording.beatMs); beatLabel.textContent = `BEAT — ${formatTime(activeRecording.beatMs)}`; beatNotch.style.left = `${activeRecording.beatMs / Math.max(activeRecording.durationMs, 1) * 100}%`; preview.currentTime = activeRecording.beatMs / 1000; });
  range.addEventListener('change', async () => { if (!activeRecording) return; try { activeRecording.poster = await makePoster(activeRecording, unlocked ? 1920 : 1280); if (recordings.some((recording) => recording.id === activeRecording?.id)) await putTake(mode, activeRecording); await renderRecordings(); setMessage('The marked beat and poster were updated.'); } catch { setMessage('The beat moved, but the poster could not be rebuilt.', true); } });
  element('#export-video').addEventListener('click', () => { if (activeRecording) { downloadBlob(activeRecording.video, `${safeFilename(activeRecording.title)}.webm`); setMessage('WebM export started.'); } });
  element('#export-poster').addEventListener('click', async () => { if (!activeRecording) return; if (!activeRecording.poster) activeRecording.poster = await makePoster(activeRecording, unlocked ? 1920 : 1280); downloadBlob(activeRecording.poster, `${safeFilename(activeRecording.title)}-poster.png`); setMessage('PNG poster export started.'); });
  element('#new-take').addEventListener('click', () => { activeRecording = null; status = 'idle'; preview.pause(); preview.hidden = true; emptySignal.hidden = false; reviewControls.hidden = true; beatNotch.hidden = true; progress.style.width = '0%'; timer.textContent = '00:00'; stageLabel.textContent = 'READY / NO SIGNAL'; setStep(1); setMessage('Ready for another recording.'); element<HTMLInputElement>('#take-title').focus(); });
  const caption = element<HTMLTextAreaElement>('#take-caption'); caption.addEventListener('input', () => { element('#caption-count').textContent = String(caption.value.length); }); element<HTMLSelectElement>('#duration').addEventListener('change', (event) => { endLabel.textContent = formatTime(Number((event.target as HTMLSelectElement).value) * 1000); });
  element('#backup-button').addEventListener('click', async () => { if (!recordings.length) { setMessage('Record an interaction before exporting a backup.', true); return; } downloadBlob(await makeBackup(recordings), `demo-loop-backup-${new Date().toISOString().slice(0, 10)}.json`); setMessage('JSON backup export started.'); });
  element<HTMLInputElement>('#restore-input').addEventListener('change', async (event) => { const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return; try { const restored = await readBackup(file); await importTakes(mode, restored); recordings = await listTakes(mode); await renderRecordings(); setMessage(`${restored.length} recording${restored.length === 1 ? '' : 's'} restored.`); } catch (error) { setMessage(error instanceof Error ? error.message : 'That backup could not be imported.', true); } input.value = ''; });

  if (!demo) {
    const showLicense = (valid: boolean, reason?: string) => { unlocked = valid; const state = element('#license-state'); state.textContent = valid ? 'Loop Pass active on this browser.' : reason ? 'License no longer active. Free recording remains available.' : 'No license on this browser.'; state.classList.toggle('unlocked', valid); element('#buy-link').textContent = valid ? 'Loop Pass active ✓' : 'Buy Loop Pass'; };
    showLicense(unlocked); void verifyLicense().then((verdict) => { if (verdict) showLicense(verdict.valid, verdict.reason); });
    element<HTMLFormElement>('#license-form').addEventListener('submit', async (event) => { event.preventDefault(); const button = element<HTMLButtonElement>('#license-form button'); button.disabled = true; button.textContent = 'Verifying…'; const verdict = await restoreLicense(element<HTMLInputElement>('#license-token').value); showLicense(verdict.valid, verdict.reason); button.disabled = false; button.textContent = 'Verify license'; });
  }
  await renderRecordings(); if (activeRecording) attachRecording(activeRecording);
}

let routeController = new AbortController();
function renderRoute(moveFocus = false): void {
  routeController.abort(); routeController = new AbortController();
  const path = location.pathname.replace(/\/$/, '') || '/'; const demo = path === '/demo' || (path === '/' && new URLSearchParams(location.search).get('demo') === '1');
  if (demo || path === '/') homePage(demo); else if (path === '/privacy' || path === '/terms') legalPage(path.slice(1) as 'privacy' | 'terms'); else notFoundPage();
  if (moveFocus) { const heading = document.querySelector<HTMLElement>('h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus(); const announcer = document.querySelector<HTMLElement>('#route-announcer'); if (announcer && heading) announcer.textContent = heading.textContent || document.title; }
  if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView()); else scrollTo(0, 0);
}

function navigate(url: string): void { history.pushState({}, '', url); renderRoute(true); }
function updateConnectionNote(): void { const note = document.querySelector<HTMLElement>('#connection-note'); if (note) note.hidden = navigator.onLine; }
document.addEventListener('click', (event) => { const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]'); if (!link || event.defaultPrevented || link.target || link.hasAttribute('download')) return; const url = new URL(link.href, location.href); if (url.origin !== location.origin || url.pathname === location.pathname && url.search === location.search) return; event.preventDefault(); navigate(`${url.pathname}${url.search}${url.hash}`); });
addEventListener('popstate', () => renderRoute(true)); addEventListener('online', updateConnectionNote); addEventListener('offline', updateConnectionNote);
renderRoute();

if ('serviceWorker' in navigator) addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js').then((registration) => { registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) { const toast = document.querySelector<HTMLElement>('#update-toast'); if (toast) toast.hidden = false; } }); }); }); });
