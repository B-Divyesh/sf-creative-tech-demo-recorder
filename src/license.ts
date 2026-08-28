const SLUG = 'creative-tech-demo-recorder';
const API_BASE = 'https://pilot-api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;

type Verdict = { valid: boolean; checkedAt: number; reason?: string };

export const checkoutUrl = `${API_BASE}/products/${SLUG}/checkout`;

function cachedVerdict(): Verdict | null {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) || 'null') as Verdict | null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): void {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function isOptimisticallyUnlocked(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  const verdict = cachedVerdict();
  return Boolean(token && verdict?.valid);
}

export async function verifyLicense(force = false): Promise<Verdict | null> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return null;
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('License service unavailable');
    const data = (await response.json()) as { valid: boolean; reason?: string };
    const verdict = { valid: data.valid, reason: data.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    return cached;
  }
}

export async function restoreLicense(token: string): Promise<Verdict> {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  const verdict = await verifyLicense(true);
  if (!verdict) return { valid: false, checkedAt: Date.now(), reason: 'invalid' };
  return verdict;
}
