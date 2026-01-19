
export type Gender = 'BOY' | 'GIRL';

export type StudioMode = 'CLOTHING' | 'FOOTWEAR';

// Updated Background type to use Vietnamese strings as used in the UI and prompt logic
export type Background = 
  | 'AI tự chọn (Tối ưu nhất)'
  | 'studio trắng sạch'
  | 'phòng ngủ trong nhà'
  | 'đường phố ngoài trời'
  | 'khu phố phong cách Hàn Quốc'
  | 'chợ Tết'
  | 'sân trường'
  | 'sân chơi trẻ em'
  | 'nền pastel tối giản'
  | 'vỉa hè ngoài trời'
  | 'lối đi công viên'
  | 'hành lang trường học'
  | 'mặt sân chơi'
  | 'sàn studio sạch'
  | 'nền lifestyle tối giản';

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
