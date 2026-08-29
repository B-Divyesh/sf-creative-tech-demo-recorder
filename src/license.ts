const SLUG = 'creative-tech-demo-recorder';
export const API_BASE = 'https://api.sociobot.in/api/v1';
export const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;

export type Verdict = { valid: boolean; checkedAt: number; reason?: string; expires_at?: string | null };

export const checkoutUrl = `${API_BASE}/products/${SLUG}/checkout`;

function cachedVerdict(): Verdict | null {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) || 'null') as Verdict | null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): boolean {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return false;
  localStorage.setItem(LICENSE_KEY, token);
  // A returned token is only a credential, not proof that the license is active.
  // Remove any verdict from the previous token and wait for Sociobot to verify it.
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function isOptimisticallyUnlocked(): boolean {
  return Boolean(localStorage.getItem(LICENSE_KEY) && cachedVerdict()?.valid);
}

export async function verifyLicense(force = false): Promise<Verdict | null> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return null;
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('License service unavailable');
    const data = (await response.json()) as { valid: boolean; reason?: string; expires_at?: string | null };
    const verdict = { ...data, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    return cached;
  }
}

export async function restoreLicense(token: string): Promise<Verdict> {
  const cleanToken = token.trim();
  if (!cleanToken) return { valid: false, checkedAt: Date.now(), reason: 'invalid' };
  localStorage.setItem(LICENSE_KEY, cleanToken);
  localStorage.removeItem(VERDICT_KEY);
  return (await verifyLicense(true)) || { valid: false, checkedAt: Date.now(), reason: 'unavailable' };
}
