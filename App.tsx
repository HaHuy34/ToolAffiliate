
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

  const deleteHistoryItem = (timestamp: number) => {
    setHistory(prev => prev.filter(item => item.timestamp !== timestamp));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StudioHeader />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <FashionStudio onGenerationComplete={addToHistory} />
        </div>
        <div className="lg:w-80">
          <HistoryPanel 
            history={history} 
            onDeleteItem={deleteHistoryItem} 
            onClearAll={clearHistory}
          />
        </div>
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>&copy; 2026 - Tool Affiliate Fashion By HuyHa</p>
      </footer>
    </div>
  );
};

export default App;
