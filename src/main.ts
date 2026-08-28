import './styles.css';
import { importTakes, listTakes, putTake, removeTake } from './db';
import { captureReturnedLicense, checkoutUrl, isOptimisticallyUnlocked, restoreLicense, verifyLicense } from './license';
import { downloadBlob, formatTime, makeBackup, makePoster, readBackup, safeFilename, supportedMimeType } from './media';
import type { CaptureStatus, DemoTake } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);

function shell(content: string): string {
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Demo Loop home">
        <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="m33 8 9 3-5 8"/><path class="play" d="m20 17 13 7-13 7z"/></svg>
        <span>Demo Loop</span>
      </a>
      <nav aria-label="Primary navigation"><a href="/#recorder">Recorder</a><a href="/#method">Method</a><a href="/#unlock">Loop Pass</a></nav>
    </header>
    <div class="connection-note" id="connection-note" role="status" hidden><span>Offline</span> Your recorder and saved takes still work here.</div>
    ${content}
    <footer class="site-footer">
      <p><strong>Demo Loop</strong> · Your media stays in this browser.</p>
      <nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
      <p class="art-credit">AI-assisted original illustration, made for Demo Loop.</p>
    </footer>
    <div class="toast" id="update-toast" role="status" hidden>Fresh ink is ready. <button type="button" id="reload-app">Update app</button></div>`;
}

function legalPage(kind: 'privacy' | 'terms'): void {
  const privacy = kind === 'privacy';
  const title = privacy ? 'Privacy, in plain ink' : 'Terms of use';
  const body = privacy ? `
    <p class="lede">Demo Loop is built around one rule: your unfinished work is yours.</p>
    <h2>What stays local</h2><p>Screen recordings, microphone audio, captions, beat markers, posters, and project names are stored in your browser using IndexedDB. They are not uploaded to Demo Loop or Sociobot.</p>
    <h2>Screen and microphone access</h2><p>The browser asks only after you press “Choose a tab & record.” Microphone access is requested only if you turn it on. Tracks stop when recording ends or the shared tab closes.</p>
    <h2>Purchases</h2><p>If you buy Loop Pass, checkout and license verification are handled by Sociobot and Dodo, the merchant of record. Demo Loop stores your license token and a cached verification result in local storage. It does not receive your card details.</p>
    <h2>Network requests</h2><p>The installed app can work offline. It contacts the Sociobot billing API only to buy or verify a license. No behavioral analytics, advertising trackers, or third-party font scripts are present.</p>
    <h2>Your control</h2><p>Download individual exports or a complete JSON backup from the Take shelf. Delete a take at any time. Clearing this site’s browser data removes local takes and your saved license token.</p>` : `
    <p class="lede">Use Demo Loop to make honest, compact records of work you have the right to capture.</p>
    <h2>The tool</h2><p>Demo Loop is provided as-is for creating short WebM captures and PNG posters. Browser capture support and codecs vary. It is a portfolio utility, not an archival recording system.</p>
    <h2>Your responsibility</h2><p>You must have permission to record the selected screen, audio, and material. Do not use the tool to capture private, copyrighted, or confidential material without authorization.</p>
    <h2>Loop Pass</h2><p>Loop Pass is a $9 one-time purchase that unlocks unlimited local take history and full-width poster output on this browser after license verification. Sociobot/Dodo is the merchant of record and handles payment support and refunds. A refunded or revoked license stops unlocking paid features. Core recording, WebM export, poster export, backups, and accessibility remain available without purchase.</p>
    <h2>Local storage</h2><p>You are responsible for exporting work you need to keep. Browser storage may be removed by device cleanup, private-browsing rules, or manual site-data deletion.</p>
    <h2>Changes</h2><p>Material changes will be reflected on this page. These terms are effective 28 August 2026.</p>`;

  document.title = `${title} — Demo Loop`;
  app.innerHTML = shell(`<main id="main" class="legal-page"><p class="eyebrow">THE SMALL PRINT / MADE READABLE</p><h1>${title}</h1>${body}<a class="button button-ink" href="/">Return to the recorder</a></main>`);
  wireGlobal();
}

function homePage(): void {
  document.title = 'Demo Loop — Capture the cause. Show the effect.';
  app.innerHTML = shell(`
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow"><span>NEW TAKE</span> / PORTFOLIO PROOF TOOL</p>
          <h1 id="hero-title">Capture the cause.<br><em>Show the effect.</em></h1>
          <p class="hero-lede">Turn a fragile interaction into a credible 20–45 second proof—video, marked beat, caption, and poster—without sending your work to a cloud.</p>
          <div class="hero-actions"><a class="button button-coral" href="#recorder">Make a demo <span aria-hidden="true">↓</span></a><span class="privacy-stamp">LOCAL ONLY<br>NO UPLOAD</span></div>
        </div>
        <figure class="hero-art">
          <picture>
            <source type="image/avif" srcset="/assets/hero-risograph.avif" />
            <source type="image/webp" srcset="/assets/hero-risograph-768.webp 768w, /assets/hero-risograph.webp 1280w" sizes="(max-width: 760px) 100vw, 54vw" />
            <img src="/assets/hero-risograph.webp" width="1280" height="853" alt="A hand presses a handmade arcade button as colorful shapes burst from a nearby prototype screen." fetchpriority="high" decoding="async" />
          </picture>
          <figcaption><span>INPUT</span><i aria-hidden="true"></i><span>VISIBLE RESPONSE</span></figcaption>
        </figure>
      </section>

      <section class="recorder-section" id="recorder" aria-labelledby="recorder-title">
        <div class="section-heading">
          <p class="eyebrow">THE RECORDING BENCH</p>
          <h2 id="recorder-title">One clean take, three moves.</h2>
          <p>Select a tab, mark the interaction as it happens, then export. Screen permission is requested only when you start.</p>
        </div>
        <ol class="station-tabs" aria-label="Recording steps">
          <li class="active" id="step-1"><b>01</b> Capture</li>
          <li id="step-2"><b>02</b> Mark the beat</li>
          <li id="step-3"><b>03</b> Export</li>
        </ol>

        <div class="recorder-grid">
          <form class="setup-panel" id="capture-form">
            <div class="field"><label for="take-title">Take name</label><input id="take-title" maxlength="48" value="Portfolio interaction" autocomplete="off" /></div>
            <div class="field"><label for="take-caption">One-line caption <small><span id="caption-count">0</span>/90</small></label><textarea id="take-caption" maxlength="90" rows="3" placeholder="e.g. Turning the dial bends the projected type."></textarea></div>
            <div class="field"><label for="duration">Maximum length</label><select id="duration"><option value="20">20 seconds</option><option value="30" selected>30 seconds</option><option value="45">45 seconds</option></select></div>
            <label class="check-row" for="use-mic"><input id="use-mic" type="checkbox" /><span><b>Add microphone</b><small>Requested after screen access</small></span></label>
            <button class="button button-coral button-wide" type="submit" id="start-button"><span class="record-dot" aria-hidden="true"></span> Choose a tab & record</button>
            <p class="support-note" id="support-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z"/></svg> Nothing is uploaded. Chrome, Edge, and Firefox provide the strongest WebM support.</p>
          </form>

          <div class="stage-panel" id="stage-panel">
            <div class="stage-topline"><span id="stage-label">READY / NO SIGNAL</span><output id="timer">00:00</output></div>
            <div class="video-stage" id="video-stage">
              <video id="preview" playsinline muted controls hidden></video>
              <div class="empty-signal" id="empty-signal">
                <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="28"/><path d="m34 28 22 12-22 12z"/><path d="M6 40h12M62 40h12M40 6v12M40 62v12"/></svg>
                <strong>Your selected tab will appear here</strong><span>Tip: rehearse the single cause-and-effect moment first.</span>
              </div>
              <div class="recording-badge" id="recording-badge" hidden><i></i> REC</div>
            </div>
            <div class="timeline" id="timeline" aria-label="Interaction timeline">
              <div class="timeline-track"><span id="timeline-progress"></span><i id="beat-notch" hidden></i></div>
              <div class="timeline-labels"><span>START</span><span id="beat-label">BEAT — NOT MARKED</span><span id="end-label">00:30</span></div>
            </div>
            <div class="record-actions" id="record-actions" hidden>
              <button class="button button-yellow" type="button" id="mark-beat">Mark interaction <kbd>M</kbd></button>
              <button class="button button-ink" type="button" id="stop-recording">Finish take <kbd>S</kbd></button>
            </div>
            <div class="review-controls" id="review-controls" hidden>
              <label for="beat-range">Poster frame / interaction beat <output id="beat-time">00:00</output></label>
              <input type="range" id="beat-range" min="0" max="1000" value="500" />
              <div class="export-actions">
                <button class="button button-cyan" type="button" id="export-video">Export WebM</button>
                <button class="button button-yellow" type="button" id="export-poster">Export poster</button>
                <button class="button button-plain" type="button" id="new-take">New take</button>
              </div>
            </div>
            <p class="status-message" id="status-message" role="status" aria-live="polite">Ready when you are.</p>
          </div>
        </div>
      </section>

      <section class="method-section" id="method" aria-labelledby="method-title">
        <div><p class="eyebrow">WHY IT WORKS</p><h2 id="method-title">A demo is a tiny argument.</h2></div>
        <ol>
          <li><span>CAUSE</span><h3>Show the input</h3><p>Keep the cursor, hand, or control visible before the action.</p></li>
          <li><span>BEAT</span><h3>Mark the moment</h3><p>Press M when it happens. That exact frame becomes your poster.</p></li>
          <li><span>EFFECT</span><h3>Hold the result</h3><p>Leave a few seconds after the change so a reviewer can read it.</p></li>
        </ol>
      </section>

      <section class="shelf-section" id="shelf" aria-labelledby="shelf-title">
        <div class="shelf-heading"><div><p class="eyebrow">LOCAL TAKE SHELF</p><h2 id="shelf-title">Your recent proofs</h2></div><div class="backup-actions"><button class="text-button" id="backup-button" type="button">Export backup</button><label class="text-button" for="restore-input">Import backup<input id="restore-input" type="file" accept="application/json" hidden /></label></div></div>
        <div id="take-list" class="take-list"><p class="shelf-empty">Loading local takes…</p></div>
      </section>

      <section class="unlock-section" id="unlock" aria-labelledby="unlock-title">
        <div class="unlock-mark" aria-hidden="true"><span>∞</span></div>
        <div class="unlock-copy"><p class="eyebrow">LOOP PASS / ONE-TIME</p><h2 id="unlock-title">Keep the whole process, not another subscription.</h2><p>Demo Loop is useful for free: record, keep 3 local takes, and export every video, poster, or backup. A $9 Loop Pass adds unlimited local take history and full-width poster output.</p><ul><li>One payment, no recurring fee</li><li>Restore your license on another device</li><li>Core exports always stay free</li></ul></div>
        <div class="license-box"><div class="price"><b>$9</b><span>USD<br>ONE TIME</span></div><a class="button button-coral button-wide" href="${checkoutUrl}" id="buy-link">Buy Loop Pass</a><p id="license-state">No license on this browser.</p><details><summary>Have a license?</summary><form id="license-form"><label for="license-token">Paste license token</label><input id="license-token" required autocomplete="off" /><button class="button button-ink" type="submit">Verify & unlock</button></form></details><small>Checkout by Sociobot/Dodo. <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></small></div>
      </section>
    </main>`);
  wireGlobal();
  void wireRecorder();
}

function wireGlobal(): void {
  const note = document.querySelector<HTMLElement>('#connection-note');
  const update = () => { if (note) note.hidden = navigator.onLine; };
  update();
  addEventListener('online', update);
  addEventListener('offline', update);
  document.querySelector('#reload-app')?.addEventListener('click', () => location.reload());
}

async function wireRecorder(): Promise<void> {
  captureReturnedLicense();
  let unlocked = isOptimisticallyUnlocked();
  let takes = await listTakes().catch(() => [] as DemoTake[]);
  let status: CaptureStatus = 'idle';
  let activeTake: DemoTake | null = takes[0] || null;
  let mediaRecorder: MediaRecorder | null = null;
  let streams: MediaStream[] = [];
  let audioContext: AudioContext | null = null;
  let chunks: BlobPart[] = [];
  let startedAt = 0;
  let beatMs = 0;
  let maxDurationMs = 30_000;
  let timerId = 0;
  let activeUrl = '';

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

  const setMessage = (message: string, error = false) => {
    statusMessage.textContent = message;
    statusMessage.classList.toggle('error', error);
  };

  const setStep = (step: number) => document.querySelectorAll('.station-tabs li').forEach((item, index) => item.classList.toggle('active', index + 1 === step));

  function attachTake(take: DemoTake): void {
    activeTake = take;
    status = 'review';
    if (activeUrl) URL.revokeObjectURL(activeUrl);
    activeUrl = URL.createObjectURL(take.video);
    preview.srcObject = null;
    preview.src = activeUrl;
    preview.muted = false;
    preview.controls = true;
    preview.hidden = false;
    emptySignal.hidden = true;
    recordActions.hidden = true;
    reviewControls.hidden = false;
    recordingBadge.hidden = true;
    stageLabel.textContent = 'TAKE READY / LOCAL';
    timer.textContent = formatTime(take.durationMs);
    endLabel.textContent = formatTime(take.durationMs);
    range.max = String(Math.max(take.durationMs, 1));
    range.value = String(take.beatMs);
    beatTime.textContent = formatTime(take.beatMs);
    beatNotch.hidden = false;
    beatNotch.style.left = `${Math.min(100, take.beatMs / Math.max(take.durationMs, 1) * 100)}%`;
    beatLabel.textContent = `BEAT — ${formatTime(take.beatMs)}`;
    progress.style.width = '100%';
    setStep(3);
    setMessage('Take saved locally. Export both files or adjust the poster frame.');
  }

  async function renderTakes(): Promise<void> {
    const list = element<HTMLElement>('#take-list');
    if (!takes.length) {
      list.innerHTML = '<div class="shelf-empty"><b>No takes yet.</b><span>Your first capture will wait here—even after you close the tab.</span><a href="#recorder">Record the first one ↑</a></div>';
      return;
    }
    list.innerHTML = takes.map((take, index) => {
      const posterUrl = take.poster ? URL.createObjectURL(take.poster) : '';
      return `<article class="take-card" data-id="${take.id}">${posterUrl ? `<img src="${posterUrl}" alt="Poster preview for ${escapeHtml(take.title)}" width="360" height="230" loading="lazy" />` : '<div class="take-placeholder" aria-hidden="true">NO POSTER</div>'}<div><p class="take-number">TAKE ${String(takes.length - index).padStart(2, '0')}</p><h3>${escapeHtml(take.title)}</h3><p>${escapeHtml(take.caption || 'No caption')}</p><span>${formatTime(take.durationMs)} · ${new Date(take.createdAt).toLocaleDateString()}</span></div><div class="take-tools"><button type="button" data-open="${take.id}">Open</button><button type="button" data-delete="${take.id}">Delete</button></div></article>`;
    }).join('');
    list.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((button) => button.addEventListener('click', () => {
      const take = takes.find((item) => item.id === button.dataset.open);
      if (take) { attachTake(take); location.hash = 'recorder'; }
    }));
    list.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((button) => button.addEventListener('click', async () => {
      const take = takes.find((item) => item.id === button.dataset.delete);
      if (!take || !confirm(`Delete “${take.title}” from this browser? This cannot be undone unless you exported a backup.`)) return;
      await removeTake(take.id);
      takes = takes.filter((item) => item.id !== take.id);
      await renderTakes();
      setMessage('Local take deleted.');
    }));
  }

  function stopTracks(): void {
    streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop()));
    streams = [];
    if (audioContext) void audioContext.close();
    audioContext = null;
  }

  function finishRecording(): void {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
    status = 'processing';
    mediaRecorder.stop();
    stopTracks();
    clearInterval(timerId);
    recordActions.hidden = true;
    recordingBadge.hidden = true;
    stageLabel.textContent = 'PROCESSING / LOCAL';
    setMessage('Building your take and poster…');
  }

  function markBeat(): void {
    if (status !== 'recording') return;
    beatMs = Date.now() - startedAt;
    beatNotch.hidden = false;
    beatNotch.style.left = `${Math.min(100, beatMs / maxDurationMs * 100)}%`;
    beatLabel.textContent = `BEAT — ${formatTime(beatMs)}`;
    setStep(2);
    setMessage(`Interaction marked at ${formatTime(beatMs)}. Hold the result, then finish.`);
  }

  async function buildCaptureStream(screen: MediaStream, microphone: MediaStream | null): Promise<MediaStream> {
    const output = new MediaStream(screen.getVideoTracks());
    const audioTracks = [...screen.getAudioTracks(), ...(microphone?.getAudioTracks() || [])];
    if (audioTracks.length === 1) output.addTrack(audioTracks[0]!);
    if (audioTracks.length > 1) {
      audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      audioTracks.forEach((track) => audioContext!.createMediaStreamSource(new MediaStream([track])).connect(destination));
      destination.stream.getAudioTracks().forEach((track) => output.addTrack(track));
    }
    return output;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status === 'requesting' || status === 'recording') return;
    if (!navigator.mediaDevices?.getDisplayMedia || typeof MediaRecorder === 'undefined') {
      setMessage('This browser cannot record a screen tab. Try current Chrome, Edge, or Firefox on desktop.', true);
      return;
    }
    status = 'requesting';
    startButton.disabled = true;
    setMessage('Choose the tab or window you want to show.');
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true });
      streams = [screen];
      let microphone: MediaStream | null = null;
      if (element<HTMLInputElement>('#use-mic').checked) {
        try {
          microphone = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: false });
          streams.push(microphone);
        } catch {
          setMessage('Microphone was unavailable, so this take is recording screen audio only.');
        }
      }
      const capture = await buildCaptureStream(screen, microphone);
      const mimeType = supportedMimeType();
      mediaRecorder = new MediaRecorder(capture, mimeType ? { mimeType, videoBitsPerSecond: 5_000_000 } : { videoBitsPerSecond: 5_000_000 });
      chunks = [];
      beatMs = 0;
      maxDurationMs = Number(element<HTMLSelectElement>('#duration').value) * 1000;
      endLabel.textContent = formatTime(maxDurationMs);
      mediaRecorder.ondataavailable = (chunk) => { if (chunk.data.size) chunks.push(chunk.data); };
      mediaRecorder.onstop = async () => {
        const durationMs = Math.min(Date.now() - startedAt, maxDurationMs);
        const video = new Blob(chunks, { type: mediaRecorder?.mimeType || 'video/webm' });
        const take: DemoTake = {
          id: crypto.randomUUID(),
          title: element<HTMLInputElement>('#take-title').value.trim() || 'Untitled interaction',
          caption: element<HTMLTextAreaElement>('#take-caption').value.trim(),
          beatMs: beatMs || Math.round(durationMs / 2),
          durationMs,
          createdAt: new Date().toISOString(),
          mimeType: video.type,
          video,
        };
        try { take.poster = await makePoster(take, unlocked ? 1920 : 1280); } catch { setMessage('Video is ready, but the browser could not make a poster. You can still export the WebM.', true); }
        const canSave = unlocked || takes.length < 3;
        if (canSave) {
          await putTake(take);
          takes = [take, ...takes.filter((item) => item.id !== take.id)];
          if ('storage' in navigator) void navigator.storage.persist();
          await renderTakes();
        } else {
          setMessage('Take is ready to export. Your free shelf is full, so it will not persist after this tab closes. Delete an old take or unlock unlimited history.', true);
        }
        attachTake(take);
        if (!canSave) setMessage('Take is ready to export. Your 3 saved slots are full; this take stays open until you leave.', true);
      };
      const videoTrack = screen.getVideoTracks()[0];
      if (videoTrack) videoTrack.onended = finishRecording;
      preview.src = '';
      preview.srcObject = screen;
      preview.muted = true;
      preview.controls = false;
      preview.hidden = false;
      await preview.play();
      emptySignal.hidden = true;
      reviewControls.hidden = true;
      recordActions.hidden = false;
      recordingBadge.hidden = false;
      beatNotch.hidden = true;
      progress.style.width = '0%';
      stageLabel.textContent = 'CAPTURING / LOCAL';
      setStep(1);
      status = 'recording';
      startedAt = Date.now();
      mediaRecorder.start(500);
      timerId = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        timer.textContent = formatTime(elapsed);
        progress.style.width = `${Math.min(100, elapsed / maxDurationMs * 100)}%`;
        if (elapsed >= maxDurationMs) finishRecording();
      }, 200);
      setMessage('Recording. Press M at the cause-and-effect moment.');
    } catch (error) {
      stopTracks();
      status = 'idle';
      const message = error instanceof DOMException && error.name === 'NotAllowedError'
        ? 'Nothing was recorded. Choose “Share” in the browser prompt when you are ready.'
        : 'Capture could not start. Close other screen recorders and try again.';
      setMessage(message, true);
    } finally {
      startButton.disabled = false;
    }
  });

  element('#mark-beat').addEventListener('click', markBeat);
  element('#stop-recording').addEventListener('click', finishRecording);
  addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
    if (event.key.toLowerCase() === 'm') markBeat();
    if (event.key.toLowerCase() === 's' && status === 'recording') finishRecording();
  });

  range.addEventListener('input', () => {
    if (!activeTake) return;
    activeTake.beatMs = Number(range.value);
    beatTime.textContent = formatTime(activeTake.beatMs);
    beatLabel.textContent = `BEAT — ${formatTime(activeTake.beatMs)}`;
    beatNotch.style.left = `${activeTake.beatMs / Math.max(activeTake.durationMs, 1) * 100}%`;
    preview.currentTime = activeTake.beatMs / 1000;
  });
  range.addEventListener('change', async () => {
    if (!activeTake) return;
    try {
      activeTake.poster = await makePoster(activeTake, unlocked ? 1920 : 1280);
      if (takes.some((take) => take.id === activeTake?.id)) await putTake(activeTake);
      await renderTakes();
      setMessage('Interaction beat and poster updated.');
    } catch { setMessage('The beat moved, but the poster could not be rebuilt.', true); }
  });

  element('#export-video').addEventListener('click', () => {
    if (!activeTake) return;
    downloadBlob(activeTake.video, `${safeFilename(activeTake.title)}.webm`);
    setMessage('WebM export started. Keep the poster beside it in your portfolio.');
  });
  element('#export-poster').addEventListener('click', async () => {
    if (!activeTake) return;
    if (!activeTake.poster) activeTake.poster = await makePoster(activeTake, unlocked ? 1920 : 1280);
    downloadBlob(activeTake.poster, `${safeFilename(activeTake.title)}-poster.png`);
    setMessage('PNG poster export started.');
  });
  element('#new-take').addEventListener('click', () => {
    activeTake = null;
    status = 'idle';
    preview.pause();
    preview.hidden = true;
    emptySignal.hidden = false;
    reviewControls.hidden = true;
    beatNotch.hidden = true;
    progress.style.width = '0%';
    timer.textContent = '00:00';
    stageLabel.textContent = 'READY / NO SIGNAL';
    setStep(1);
    setMessage('Ready for another take.');
    element<HTMLInputElement>('#take-title').focus();
  });

  const caption = element<HTMLTextAreaElement>('#take-caption');
  caption.addEventListener('input', () => { element('#caption-count').textContent = String(caption.value.length); });
  element<HTMLSelectElement>('#duration').addEventListener('change', (event) => { endLabel.textContent = formatTime(Number((event.target as HTMLSelectElement).value) * 1000); });

  element('#backup-button').addEventListener('click', async () => {
    if (!takes.length) { setMessage('Record a take before exporting a backup.', true); return; }
    setMessage('Packing your local backup…');
    downloadBlob(await makeBackup(takes), `demo-loop-backup-${new Date().toISOString().slice(0, 10)}.json`);
    setMessage('Backup export started. It includes your videos, posters, captions, and beat markers.');
  });
  element<HTMLInputElement>('#restore-input').addEventListener('change', async (event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const restored = await readBackup(file);
      await importTakes(restored);
      takes = await listTakes();
      await renderTakes();
      setMessage(`${restored.length} take${restored.length === 1 ? '' : 's'} restored locally.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'That backup could not be imported.', true); }
    input.value = '';
  });

  const showLicense = (valid: boolean, reason?: string) => {
    unlocked = valid;
    const state = element('#license-state');
    state.textContent = valid ? 'Loop Pass active on this browser.' : reason ? 'License no longer active. Free tools still work.' : 'No license on this browser.';
    state.classList.toggle('unlocked', valid);
    element('#buy-link').textContent = valid ? 'Loop Pass active ✓' : 'Buy Loop Pass';
  };
  showLicense(unlocked);
  void verifyLicense().then((verdict) => { if (verdict) showLicense(verdict.valid, verdict.reason); });
  element<HTMLFormElement>('#license-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = element<HTMLButtonElement>('#license-form button');
    button.disabled = true;
    button.textContent = 'Verifying…';
    const verdict = await restoreLicense(element<HTMLInputElement>('#license-token').value);
    showLicense(verdict.valid, verdict.reason);
    button.disabled = false;
    button.textContent = 'Verify & unlock';
  });

  await renderTakes();
}

const path = location.pathname.replace(/\/$/, '') || '/';
if (path === '/privacy') legalPage('privacy');
else if (path === '/terms') legalPage('terms');
else homePage();

if ('serviceWorker' in navigator) {
  addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            const toast = document.querySelector<HTMLElement>('#update-toast');
            if (toast) toast.hidden = false;
          }
        });
      });
    });
  });
}
