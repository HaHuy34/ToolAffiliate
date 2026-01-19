
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  history: GeneratedImage[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 h-full flex flex-col">
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
        SESSION HISTORY
        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px]">{history.length}</span>
      </h2>
      
      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-12">
          <i className="fas fa-history text-3xl mb-3"></i>
          <p className="text-xs">No recent exports</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {history.map((item) => (
            <div key={item.timestamp} className="group relative rounded-xl overflow-hidden bg-gray-50 border hover:border-blue-300 transition-all cursor-pointer">
              <img src={item.url} alt="History item" className="w-full aspect-square object-cover" />
              <div className="absolute top-2 left-2">
                <span className="bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase backdrop-blur-sm">
                  {item.mode}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={item.url} 
                  download={`k-fashion-history-${item.timestamp}.png`}
                  className="text-[10px] text-white font-bold bg-blue-600/80 hover:bg-blue-600 block text-center py-1 rounded"
                >
                  DOWNLOAD
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Pro Tip</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Switch between Clothing and Footwear studios to generate comprehensive catalog visuals for your brand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
