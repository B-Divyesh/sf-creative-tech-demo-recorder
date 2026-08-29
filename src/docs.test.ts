import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('visitor documentation', () => {
  it('describes recording storage in plain browser language', async () => {
    const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

    expect(readme).toContain('Imports a JSON backup and keeps saved recordings in browser storage.');
    expect(readme).toContain('The demo and real workspaces store recordings separately in your browser.');
    expect(readme).not.toContain('IndexedDB');
  });

  it('keeps the catalog description verb-first and within 120 characters', async () => {
    const description = (await readFile(new URL('../.factory/catalog-description.txt', import.meta.url), 'utf8')).trim();

    expect(description).toMatch(/^Record\b/);
    expect(description.length).toBeLessThanOrEqual(120);
  });

  it('keeps one independently runnable browser test for every registered claim', async () => {
    const claims = JSON.parse(await readFile(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as Array<{ id: string; test: string }>;
    const claimTests = await readFile(new URL('../tests/claims.spec.ts', import.meta.url), 'utf8');
    const tags = [...claimTests.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);

    expect(new Set(tags).size).toBe(tags.length);
    expect(tags.sort()).toEqual(claims.map((claim) => claim.id).sort());
    for (const claim of claims) {
      expect(claim.test).toBe(`npm run test:e2e -- --grep @claim:${claim.id}`);
    }
  });

  it('uses an allocated port for browser tests and pins the installed browser version', async () => {
    const packageConfig = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };

    expect(packageConfig.scripts['test:e2e']).toBe('node tools/run-e2e.mjs');
    expect(packageConfig.devDependencies['@playwright/test']).toBe('1.58.2');
  });
});
