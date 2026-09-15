import React from 'react';
import { Image as ImageIcon, Trash2, FolderOpen, ArrowUpRight } from 'lucide-react';

const Gallery = ({ drawings = [], onSelectDrawing, onDeleteDrawing, onClearAll }) => {
  return (
    <section className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Gallery Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderOpen className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-700 tracking-tight">Saved Artworks Gallery</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
              {drawings.length} {drawings.length === 1 ? 'drawing' : 'drawings'}
            </span>
          </div>

          {drawings.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors flex items-center gap-1"
              title="Clear all saved drawings"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Gallery</span>
            </button>
          )}
        </div>

        {/* Gallery Items Container */}
        <div
          data-testid="gallery-container"
          className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 min-h-[96px]"
        >
          {drawings.length === 0 ? (
            <div className="w-full py-6 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <ImageIcon className="w-6 h-6 mb-1.5 text-slate-300" />
              <p className="text-xs font-medium text-slate-500">No saved drawings yet</p>
              <p className="text-[11px] text-slate-400">Click &quot;Save to Gallery&quot; in the toolbar to store your creations here.</p>
            </div>
          ) : (
            drawings.map((item, index) => {
              const dataUrl = typeof item === 'string' ? item : item.dataUrl || item.url || item.image;
              return (
                <div
                  key={index}
                  data-testid={`gallery-item-${index}`}
                  onClick={() => onSelectDrawing(dataUrl)}
                  className="group relative flex-shrink-0 w-32 h-20 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50/40"
                  title={`Click to load Drawing #${index + 1} onto canvas`}
                >
                  {/* Thumbnail */}
                  <img
                    src={dataUrl}
                    alt={`Saved Drawing ${index + 1}`}
                    className="w-full h-full object-contain p-1 transition-transform group-hover:scale-105"
                  />

                  {/* Overlay Badge */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-900/60 text-[10px] font-mono font-medium text-white backdrop-blur-xs">
                    #{index + 1}
                  </div>

                  {/* Hover prompt */}
                  <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-medium">
                    <span>Load</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Delete button */}
                  {onDeleteDrawing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDrawing(index);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 hover:text-rose-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="Delete this drawing"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
