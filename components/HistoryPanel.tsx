
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  history: GeneratedImage[];
  onDeleteItem: (timestamp: number) => void;
  onClearAll: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onDeleteItem, onClearAll }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          LỊCH SỬ TẠO
          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px]">{history.length}</span>
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <i className="fas fa-trash-alt"></i>
            CLEAR ALL
          </button>
        )}
      </div>
      
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
              
              {/* Badges */}
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase backdrop-blur-sm">
                  {item.mode}
                </span>
              </div>

              {/* Delete Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.timestamp);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-100 backdrop-blur-sm z-10"
                title="Remove from history"
              >
                <i className="fas fa-times text-xs"></i>
              </button>

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
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Gợi ý chuyên gia</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Kết hợp studio <strong>Trang phục</strong> và<strong> Giày dép</strong> để tạo bộ ảnh sản phẩm đồng bộ, chuyên nghiệp cho thương hiệu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
