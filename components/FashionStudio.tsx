
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Gender, Background, GenerationConfig, GeneratedImage, StudioMode } from '../types';

interface FashionStudioProps {
  onGenerationComplete: (image: GeneratedImage) => void;
}

const CLOTHING_BACKGROUNDS: Background[] = [
  'clean white studio',
  'indoor bedroom',
  'outdoor street',
  'Korean-style neighborhood',
  'Tet holiday market',
  'school yard',
  'playground',
  'minimal pastel background'
];

const FOOTWEAR_BACKGROUNDS: Background[] = [
  'outdoor sidewalk',
  'park walkway',
  'school corridor floor',
  'playground ground',
  'clean studio floor',
  'minimal lifestyle background'
];

const FashionStudio: React.FC<FashionStudioProps> = ({ onGenerationComplete }) => {
  const [config, setConfig] = useState<GenerationConfig>({
    gender: 'GIRL',
    background: 'clean white studio',
    clothingImage: null,
    mode: 'CLOTHING'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeSwitch = (mode: StudioMode) => {
    setConfig(prev => ({
      ...prev,
      mode,
      background: mode === 'CLOTHING' ? 'clean white studio' : 'outdoor sidewalk'
    }));
    setResult(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, clothingImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!config.clothingImage) {
      setError(`Please upload a ${config.mode === 'CLOTHING' ? 'clothing' : 'footwear'} product image first.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const base64Data = config.clothingImage.split(',')[1];
      const mimeType = config.clothingImage.split(';')[0].split(':')[1];

      let prompt = "";
      
      if (config.mode === 'CLOTHING') {
        prompt = `
          Create a photorealistic commercial fashion image of a single child wearing the uploaded clothing product.
          SUBJECT: One child only, age strictly between 8–12 years old.
          Korean baby-face style: soft youthful facial features, gentle eyes, small nose, smooth child skin. No adult or teenage facial structure.
          GENDER: ${config.gender}
          BODY: Realistic child proportions (8–12 years old), correct head-to-body ratio, no long adult legs, no muscular definition, natural relaxed pose.
          CLOTHING (CRITICAL): Apply the uploaded clothing EXACTLY as provided: preserve 100% original design, same color, pattern, fabric, stitching, no redesign, no stylization, no color change, no added accessories. Correct scaling for a child body, natural fabric folds and gravity.
          BACKGROUND: ${config.background}.
          STYLE & QUALITY: Photorealistic, high-resolution, commercial-ready fashion image, natural lighting matching the background, sharp focus, clean look, no watermark, no text, no logos.
          SAFETY: Child must clearly look 8–12 years old, no adult appearance, no sexualized pose or styling, no makeup.
        `;
      } else {
        prompt = `
          Create a photorealistic commercial fashion image focusing on legs and feet wearing the uploaded footwear product.
          SUBJECT: A single child, age strictly between 8–12 years old. Only legs and feet are visible. No face, no upper body, no full body.
          LEGS & FEET: Slim, beautiful child legs. Natural child leg proportions (8–12 years old). Smooth, healthy child skin. No adult leg length, no muscular definition, no visible veins. Natural standing or walking pose. Relaxed, child-like posture.
          FOOTWEAR (CRITICAL): Apply the uploaded footwear product EXACTLY as provided: preserve 100% original design, same shape, sole, heel height, same color, pattern, material, same stitching, straps, decorations. No redesign, no stylization, no color change, no added accessories.
          Fit the footwear realistically on child feet: correct child foot size and proportions, natural contact with the ground, realistic shadows under the sole, correct perspective, no deformation of the shoes, no floating shoes.
          POSE & MOTION: light walking pose, gentle step, or natural standing. Realistic foot angle. No fashion model pose, no exaggerated movement.
          BACKGROUND: ${config.background}.
          STYLE & QUALITY: photorealistic, high-resolution, commercial-ready footwear image, clean, professional product showcase, natural lighting, sharp focus on shoes and feet, shallow depth of field allowed, no watermark, no text, no logos.
          SAFETY & CONSTRAINTS: child must clearly be 8–12 years old, no adult legs or proportions, no sexualized framing, no suggestive pose, child-safe, wholesome, commercial use.
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let generatedBase64 = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (generatedBase64) {
        setResult(generatedBase64);
        onGenerationComplete({
          url: generatedBase64,
          prompt: prompt,
          timestamp: Date.now(),
          mode: config.mode
        });
      } else {
        throw new Error("No image part found in response");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const currentBackgrounds = config.mode === 'CLOTHING' ? CLOTHING_BACKGROUNDS : FOOTWEAR_BACKGROUNDS;

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit mx-auto shadow-inner border border-gray-200">
        <button
          onClick={() => handleModeSwitch('CLOTHING')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${config.mode === 'CLOTHING' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <i className="fas fa-tshirt"></i>
          CLOTHING STUDIO
        </button>
        <button
          onClick={() => handleModeSwitch('FOOTWEAR')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${config.mode === 'FOOTWEAR' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <i className="fas fa-shoe-prints"></i>
          FOOTWEAR STUDIO
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Side: Upload & Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1. Upload {config.mode === 'CLOTHING' ? 'Clothing' : 'Footwear'} Product
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${config.clothingImage ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
              >
                {config.clothingImage ? (
                  <>
                    <img src={config.clothingImage} alt="Product" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-sm font-medium">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                      <i className={`fas ${config.mode === 'CLOTHING' ? 'fa-shirt' : 'fa-boot'} text-gray-400 text-2xl`}></i>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Click to upload photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
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

            {config.mode === 'CLOTHING' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. Target Subject Gender
                </label>
                <div className="flex gap-4">
                  {(['BOY', 'GIRL'] as Gender[]).map(gender => (
                    <button
                      key={gender}
                      onClick={() => setConfig(prev => ({ ...prev, gender }))}
                      className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${config.gender === gender ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <i className={`fas fa-${gender === 'BOY' ? 'mars' : 'venus'} mr-2`}></i>
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {config.mode === 'CLOTHING' ? '3. Choose Background' : '2. Choose Surface/Background'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentBackgrounds.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setConfig(prev => ({ ...prev, background: bg }))}
                    className={`text-xs p-2 rounded-lg border text-left transition-all ${config.background === bg ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={loading || !config.clothingImage}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${loading || !config.clothingImage ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]'}`}
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  Visualizing...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  Generate {config.mode === 'CLOTHING' ? 'Fashion' : 'Footwear'} Shot
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                <i className="fas fa-exclamation-circle mt-0.5"></i>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right Side: Result Preview */}
          <div className="bg-gray-50 rounded-2xl border flex flex-col overflow-hidden min-h-[500px]">
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{config.mode} Visualizer</span>
              {result && !loading && (
                <a 
                  href={result} 
                  download={`k-fashion-${config.mode.toLowerCase()}-${Date.now()}.png`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1.5"
                >
                  <i className="fas fa-download"></i>
                  Save
                </a>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {loading ? (
                <div className="text-center p-8">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Perfecting the visualization</h3>
                  <p className="text-sm text-gray-500 max-w-[240px] mx-auto italic">
                    {config.mode === 'CLOTHING' 
                      ? "Mapping clothing to child proportions and refining Korean baby-face aesthetics..."
                      : "Precisely fitting footwear to child feet with realistic perspective and contact..."}
                  </p>
                </div>
              ) : result ? (
                <img src={result} alt="Generated Visual" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center px-8 text-gray-400">
                  <i className={`fas ${config.mode === 'CLOTHING' ? 'fa-image' : 'fa-shoe-prints'} text-5xl mb-4 opacity-20`}></i>
                  <p className="text-sm italic">Generated {config.mode.toLowerCase()} visuals will appear here</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <i className="fas fa-shield-halved"></i>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Commercial Standards</h4>
          <p className="text-sm text-blue-800/80 leading-relaxed">
            {config.mode === 'CLOTHING' 
              ? "Our AI ensures age-appropriate child modeling (8-12 years) with realistic proportions and high-fidelity product mapping."
              : "Specialized footwear rendering focuses on realistic contact, shadows, and anatomical correctness for child legs and feet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FashionStudio;
