export type DemoTake = {
  id: string;
  title: string;
  caption: string;
  beatMs: number;
  durationMs: number;
  createdAt: string;
  mimeType: string;
  video: Blob;
  poster?: Blob;
};

export type CaptureStatus = 'idle' | 'requesting' | 'recording' | 'processing' | 'review';
