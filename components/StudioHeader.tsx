
import React from 'react';

const StudioHeader: React.FC = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <i className="fas fa-camera-retro text-lg"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            TOOL AFFILIATE <span className="text-blue-600">FASHION STUDIO</span>
          </h1>
        </div>
        
      </div>
    </header>
  );
};

export default StudioHeader;
