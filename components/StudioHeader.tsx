
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
            K-FASHION <span className="text-blue-600">MINI STUDIO</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-blue-600 transition-colors">Commercial Pro</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Guidelines</a>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            PREVIEW MODE
          </span>
        </div>
      </div>
    </header>
  );
};

export default StudioHeader;
