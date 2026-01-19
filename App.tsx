
import React, { useState } from 'react';
import StudioHeader from './components/StudioHeader';
import FashionStudio from './components/FashionStudio';
import HistoryPanel from './components/HistoryPanel';
import { GeneratedImage } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const addToHistory = (image: GeneratedImage) => {
    setHistory(prev => [image, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StudioHeader />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <FashionStudio onGenerationComplete={addToHistory} />
        </div>
        <div className="lg:w-80">
          <HistoryPanel history={history} />
        </div>
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>&copy; 2024 K-Fashion Mini Studio. Powered by Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;
