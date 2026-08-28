import { describe, expect, it } from 'vitest';
import { formatTime, safeFilename } from './media';

describe('media helpers', () => {
  it('formats stable recorder timecodes', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(45_999)).toBe('00:45');
    expect(formatTime(61_000)).toBe('01:01');
  });

  it('creates safe useful export names', () => {
    expect(safeFilename('  Dial → Type!  ')).toBe('dial-type');
    expect(safeFilename('🎛️')).toBe('demo-loop');
  });
});
