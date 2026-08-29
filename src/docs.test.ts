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
});
