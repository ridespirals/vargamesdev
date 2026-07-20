export interface AnimationClip {
  id: string;
  /** Texture keys or frame names; for placeholder, a single tint cycle is fine. */
  frames: string[];
  msPerFrame: number;
  loop: boolean;
}

export const placeholderIdleClip: AnimationClip = {
  id: 'idle',
  frames: ['player'],
  msPerFrame: 200,
  loop: true,
};

export const clipsById: Record<string, AnimationClip> = {
  [placeholderIdleClip.id]: placeholderIdleClip,
};
