import React from 'react';
import {
  Pen,
  Eraser,
  Minus,
  Square,
  RotateCcw,
  RotateCw,
  Trash2,
  Save,
  Download,
  Palette,
} from 'lucide-react';

const PRESET_COLORS = [
  '#000000',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ffffff',
];

const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  onClear,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = false,
  onSave,
  onExport,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-white/90 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200 p-4 flex flex-col gap-5 z-20 shadow-sm overflow-y-auto max-h-screen">
      {/* App Branding */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Pen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight leading-none">CanvasCraft</h1>
          <p className="text-xs text-slate-400 mt-0.5">Interactive Drawing Studio</p>
        </div>
      </div>

      {/* Drawing Tools Section */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tools</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="tool-pen"
            onClick={() => setTool('pen')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tool === 'pen'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            }`}
            title="Pen (P)"
          >
            <Pen className="w-4 h-4" />
            <span>Pen</span>
          </button>

          <button
            type="button"
            data-testid="tool-eraser"
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tool === 'eraser'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            }`}
            title="Eraser (E)"
          >
            <Eraser className="w-4 h-4" />
            <span>Eraser</span>
          </button>

          <button
            type="button"
            data-testid="tool-line"
            onClick={() => setTool('line')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tool === 'line'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            }`}
            title="Line (L)"
          >
            <Minus className="w-4 h-4" />
            <span>Line</span>
          </button>

          <button
            type="button"
            data-testid="tool-rectangle"
            onClick={() => setTool('rectangle')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tool === 'rectangle'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            }`}
            title="Rectangle (R)"
          >
            <Square className="w-4 h-4" />
            <span>Rectangle</span>
          </button>
        </div>
      </div>

      {/* Color Picker Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Stroke Color
          </span>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {color.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-sm cursor-pointer group">
            <input
              type="color"
              data-testid="color-picker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-100"
              title="Click to select custom color"
            />
          </div>

          {/* Quick preset color swatches */}
          <div className="flex-1 grid grid-cols-5 gap-1.5">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                style={{ backgroundColor: preset }}
                className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 ${
                  color.toLowerCase() === preset.toLowerCase()
                    ? 'ring-2 ring-indigo-500 ring-offset-1 scale-110 border-white'
                    : 'border-slate-300'
                }`}
                title={preset}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Brush Size Slider Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {tool === 'eraser' ? 'Eraser Size' : 'Brush Thickness'}
          </span>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {brushSize} px
          </span>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <input
            type="range"
            data-testid="brush-size-slider"
            min="1"
            max="60"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            title="Adjust brush size"
          />
          {/* Live Brush Size Dot Preview */}
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-white rounded-lg border border-slate-200">
            <div
              className="rounded-full transition-all"
              style={{
                width: `${Math.min(Math.max(brushSize, 3), 26)}px`,
                height: `${Math.min(Math.max(brushSize, 3), 26)}px`,
                backgroundColor: tool === 'eraser' ? '#94a3b8' : color,
              }}
            />
          </div>
        </div>
      </div>

      {/* History & Actions Section */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">History</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="undo-button"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
            title="Undo last action (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Undo</span>
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
            title="Redo action (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
            <span>Redo</span>
          </button>
        </div>

        <button
          type="button"
          data-testid="clear-canvas-button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-95 transition-all"
          title="Clear canvas"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Canvas</span>
        </button>
      </div>

      {/* Storage & Export Section */}
      <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">File & Save</span>
        <button
          type="button"
          data-testid="save-storage-button"
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 active:scale-95 transition-all"
          title="Save artwork to browser Local Storage"
        >
          <Save className="w-4 h-4" />
          <span>Save to Gallery</span>
        </button>

        <button
          type="button"
          data-testid="export-png-button"
          onClick={onExport}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95 transition-all"
          title="Download drawing as PNG image"
        >
          <Download className="w-4 h-4" />
          <span>Export PNG</span>
        </button>
      </div>
    </aside>
  );
};

export default Toolbar;
