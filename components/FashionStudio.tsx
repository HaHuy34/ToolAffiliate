
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Gender, Background, GenerationConfig, GeneratedImage, StudioMode } from '../types';

interface FashionStudioProps {
  onGenerationComplete: (image: GeneratedImage) => void;
}

const CLOTHING_BACKGROUNDS: Background[] = [
  'AI tự chọn (Tối ưu nhất)',
  'studio trắng sạch',
  'phòng ngủ trong nhà',
  'đường phố ngoài trời',
  'khu phố phong cách Hàn Quốc',
  'chợ Tết',
  'sân trường',
  'sân chơi trẻ em',
  'nền pastel tối giản'
];

const FOOTWEAR_BACKGROUNDS: Background[] = [
  'AI tự chọn (Tối ưu nhất)',
  'vỉa hè ngoài trời',
  'lối đi công viên',
  'hành lang trường học',
  'mặt sân chơi',
  'sàn studio sạch',
  'nền lifestyle tối giản'
];

const FashionStudio: React.FC<FashionStudioProps> = ({ onGenerationComplete }) => {
  const [mode, setMode] = useState<StudioMode>('CLOTHING');
  const [config, setConfig] = useState<{ gender: Gender; background: Record<StudioMode, Background> }>({
    gender: 'GIRL',
    background: {
      CLOTHING: 'studio trắng sạch',
      FOOTWEAR: 'vỉa hè ngoài trời'
    }
  });

  // Tách biệt ảnh tải lên cho từng chế độ
  const [uploadedImages, setUploadedImages] = useState<Record<StudioMode, string | null>>({
    CLOTHING: null,
    FOOTWEAR: null
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeSwitch = (newMode: StudioMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImages(prev => ({
        ...prev,
        [mode]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const pickRandomBackground = () => {
    // Thay đổi logic: Thay vì chọn ngẫu nhiên trong list, ta chọn option AI Tự Chọn
    setConfig(prev => ({
      ...prev,
      background: { ...prev.background, [mode]: 'AI tự chọn (Tối ưu nhất)' }
    }));
  };

  const generateImage = async () => {
    const currentImage = uploadedImages[mode];
    if (!currentImage) {
      setError(
        `Vui lòng tải lên hình ảnh ${
          mode === 'CLOTHING' ? 'quần áo' : 'giày dép'
        } trước khi tạo ảnh.`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.API_KEY
      });

      const base64Data = currentImage.split(',')[1];
      const mimeType = currentImage.split(';')[0].split(':')[1];

      let prompt = '';
      const currentBg = config.background[mode];
      
      // Logic xử lý prompt cho bối cảnh
      const backgroundInstruction = currentBg === 'AI tự chọn (Tối ưu nhất)'
        ? 'BỐI CẢNH: Bạn được toàn quyền sáng tạo! Hãy chọn một bối cảnh (studio, ngoại cảnh, lifestyle...) chuyên nghiệp và ấn tượng nhất ĐỂ LÀM NỔI BẬT sản phẩm này. Bối cảnh phải hòa hợp với phong cách của mẫu, có ánh sáng cao cấp và làm cho sản phẩm trông thật đắt tiền, thu hút.'
        : `BỐI CẢNH: ${currentBg}`;

      if (mode === 'CLOTHING') {
        prompt = `
Tạo một hình ảnh thời trang thương mại chân thực của MỘT TRẺ EM đang mặc sản phẩm quần áo được tải lên.
NHÂN VẬT: Một trẻ em duy nhất, 8–12 tuổi. Khuôn mặt baby Hàn Quốc: mềm mại, dễ thương, mắt hiền, mũi nhỏ, da trẻ em mịn.
GIỚI TÍNH: ${config.gender}
CƠ THỂ: Tỷ lệ trẻ 8–12 tuổi, đầu to hơn người lớn, chân KHÔNG dài kiểu người mẫu, tư thế tự nhiên.
QUẦN ÁO (CỰC KỲ QUAN TRỌNG): Mặc CHÍNH XÁC bộ quần áo đã tải lên. Giữ nguyên 100% thiết kế gốc: màu sắc, họa tiết, chất liệu, đường may. Không redesign, không stylize. Fit đúng cơ thể trẻ em, nếp vải tự nhiên.
${backgroundInstruction}
CHẤT LƯỢNG: Ảnh thương mại chân thực, độ phân giải cao, ánh sáng tự nhiên, không watermark, không chữ, không logo.
AN TOÀN: Rõ ràng là trẻ em, không tạo dáng gợi cảm, không trang điểm.
        `;
      } else {
        prompt = `
Tạo một hình ảnh thời trang thương mại chân thực tập trung vào CHÂN VÀ BÀN CHÂN của MỘT TRẺ EM đang mang sản phẩm giày dép được tải lên.
NHÂN VẬT: Trẻ em 8–12 tuổi. CHỈ hiển thị chân và bàn chân. Không lộ mặt, không lộ thân trên.
CHÂN & DA: Chân trẻ em thon gọn, tỷ lệ đúng độ tuổi. Da mịn, không cơ bắp, không gân. Tư thế đứng hoặc bước đi nhẹ nhàng.
GIÀY DÉP (CỰC KỲ QUAN TRỌNG): Giữ nguyên 100% thiết kế giày gốc: đế, màu sắc, chất liệu, đường may. Không thay đổi, không thêm phụ kiện. Giày fit đúng kích thước chân trẻ em. Đặt chân chạm đất tự nhiên có bóng đổ thật. Không méo giày, không giày lơ lửng.
${backgroundInstruction}
CHẤT LƯỢNG: Ảnh thương mại chân thực, nét căng, focus vào giày, có thể xóa phông nhẹ. Không chữ, không watermark, không logo.
AN TOÀN: Rõ ràng là chân trẻ em, không góc máy nhạy cảm, an toàn thương mại.
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType
              }
            },
            {
              text: prompt
            }
          ]
        }
      });

      let generatedBase64: string | null = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!generatedBase64) throw new Error('Không tìm thấy ảnh trong kết quả trả về');

      setResult(generatedBase64);
      onGenerationComplete({
        url: generatedBase64,
        prompt,
        timestamp: Date.now(),
        mode: mode
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra trong quá trình tạo ảnh.');
    } finally {
      setLoading(false);
    }
  };

  const currentBackgrounds = mode === 'CLOTHING' ? CLOTHING_BACKGROUNDS : FOOTWEAR_BACKGROUNDS;
  const currentImage = uploadedImages[mode];

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mx-auto shadow-inner border border-gray-200">
        <button
          onClick={() => handleModeSwitch('CLOTHING')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === 'CLOTHING' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <i className="fas fa-tshirt"></i>
          STUDIO QUẦN ÁO
        </button>
        <button
          onClick={() => handleModeSwitch('FOOTWEAR')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === 'FOOTWEAR' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <i className="fas fa-shoe-prints"></i>
          STUDIO GIÀY DÉP
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1. Tải ảnh {mode === 'CLOTHING' ? 'quần áo' : 'giày dép'}
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${currentImage ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
              >
                {currentImage ? (
                  <>
                    <img src={currentImage} className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-sm font-medium">Đổi ảnh khác</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                      <i className={`fas ${mode === 'CLOTHING' ? 'fa-shirt' : 'fa-boot'} text-gray-400 text-2xl`}></i>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Bấm để tải ảnh</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 10MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
            </div>

            {mode === 'CLOTHING' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. Giới tính nhân vật
                </label>
                <div className="flex gap-4">
                  {(['BOY', 'GIRL'] as Gender[]).map(gender => (
                    <button
                      key={gender}
                      onClick={() => setConfig(prev => ({ ...prev, gender }))}
                      className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${config.gender === gender ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {gender === 'BOY' ? 'BÉ TRAI' : 'BÉ GÁI'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {mode === 'CLOTHING' ? '3. Chọn bối cảnh' : '2. Chọn nền / mặt sàn'}
                </label>
                <button 
                  onClick={pickRandomBackground}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                >
                  <i className="fas fa-dice"></i>
                  Ngẫu nhiên
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currentBackgrounds.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setConfig(prev => ({ 
                      ...prev, 
                      background: { ...prev.background, [mode]: bg } 
                    }))}
                    className={`text-xs p-2 rounded-lg border text-left transition-all ${config.background[mode] === bg ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={loading || !currentImage}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${loading || !currentImage ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]'}`}
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  TẠO ẢNH {mode === 'CLOTHING' ? 'THỜI TRANG' : 'GIÀY DÉP'}
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
          </div>

          {/* Result Preview Area */}
          <div className="bg-gray-50 rounded-2xl border flex flex-col overflow-hidden min-h-[500px]">
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{mode} PREVIEW</span>
              <div className="flex items-center gap-3">
                {result && !loading && (
                  <>
                    <button 
                      onClick={() => setShowPreview(true)}
                      className="text-gray-500 hover:text-blue-600 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <i className="fas fa-expand-alt"></i>
                      Xem ảnh
                    </button>
                    <div className="h-3 w-px bg-gray-200"></div>
                    <a 
                      href={result} 
                      download={`k-fashion-${mode.toLowerCase()}-${Date.now()}.png`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1.5"
                    >
                      <i className="fas fa-download"></i>
                      Lưu
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {loading ? (
                <div className="text-center p-8">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Đang thiết kế hình ảnh...</h3>
                  <p className="text-sm text-gray-500 max-w-[240px] mx-auto italic">
                    {mode === 'CLOTHING' 
                      ? "Đang khớp quần áo vào cơ thể trẻ em và tinh chỉnh khuôn mặt chuẩn Hàn..."
                      : "Đang gắn giày vào chân trẻ em với ánh sáng và bóng đổ chân thực..."}
                  </p>
                </div>
              ) : result ? (
                <div className="relative group w-full h-full p-4 flex items-center justify-center">
                  <img 
                    src={result} 
                    className="max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300" 
                    onClick={() => setShowPreview(true)}
                  />
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setShowPreview(true)}
                      className="bg-white/90 backdrop-blur shadow-lg w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all hover:scale-110"
                    >
                      <i className="fas fa-search-plus"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center px-8 text-gray-400">
                  <i className={`fas ${mode === 'CLOTHING' ? 'fa-image' : 'fa-shoe-prints'} text-5xl mb-4 opacity-20`}></i>
                  <p className="text-sm italic">Ảnh tạo ra sẽ hiển thị tại đây</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showPreview && result && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 transition-all duration-300"
          onClick={() => setShowPreview(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors z-10 p-2"
            onClick={() => setShowPreview(false)}
          >
            <i className="fas fa-times"></i>
          </button>
          
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
             <img 
              src={result} 
              alt="Full View" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm scale-in-center"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            <a 
              href={result} 
              download={`k-fashion-${mode.toLowerCase()}-hd.png`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl transition-all hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fas fa-download"></i>
              Tải ảnh chất lượng cao
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionStudio;
