
export type Gender = 'BOY' | 'GIRL';

export type StudioMode = 'CLOTHING' | 'FOOTWEAR';

export type Background = 
  | 'indoor bedroom' 
  | 'clean white studio' 
  | 'outdoor street' 
  | 'Korean-style neighborhood' 
  | 'Tet holiday market' 
  | 'school yard' 
  | 'playground' 
  | 'minimal pastel background'
  | 'outdoor sidewalk'
  | 'park walkway'
  | 'school corridor floor'
  | 'playground ground'
  | 'clean studio floor'
  | 'minimal lifestyle background';

export interface GenerationConfig {
  gender: Gender;
  background: Background;
  clothingImage: string | null;
  mode: StudioMode;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
  mode: StudioMode;
}
