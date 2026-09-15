import React, { useState, useEffect, useRef, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import Gallery from './components/Gallery';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'savedDrawings';

function App() {
  // Core Drawing States
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  // Undo / Redo availability
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  // Persistence State
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const canvasRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Show momentary toast feedback
  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Load saved drawings from Local Storage on initial mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedDrawings(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse saved drawings from localStorage:', err);
    }
  }, []);

  // Clear Canvas Handler
  const handleClear = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
      showToast('Canvas cleared');
    }
  }, [showToast]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  }, []);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  }, []);

  // Save to Local Storage Handler
  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;

    // Get current data URL via global helper or canvas ref
    const dataUrl = (window.getCanvasDataURL ? window.getCanvasDataURL() : canvasRef.current.getDataURL());
    if (!dataUrl) return;

    try {
      let existing = [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existing = parsed;
        }
      }

      // Append new drawing as specified in the requirements
      const updated = [...existing, dataUrl];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedDrawings(updated);
      showToast('Artwork saved to gallery!');
    } catch (err) {
      console.error('Failed to save artwork to localStorage:', err);
      showToast('Error saving artwork');
    }
  }, [showToast]);

  // Export PNG Handler
  const handleExport = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = (window.getCanvasDataURL ? window.getCanvasDataURL() : canvasRef.current.getDataURL());
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `canvascraft-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('PNG image downloaded!');
  }, [showToast]);

  // Load Drawing from Gallery onto Active Canvas
  const handleSelectDrawing = useCallback((dataUrl) => {
    if (canvasRef.current) {
      canvasRef.current.loadDrawing(dataUrl);
      showToast('Artwork restored to canvas');
    }
  }, [showToast]);

  // Delete individual drawing from gallery
  const handleDeleteDrawing = useCallback((index) => {
    try {
      const updated = savedDrawings.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedDrawings(updated);
      showToast('Artwork removed from gallery');
    } catch (err) {
      console.error('Failed to delete artwork:', err);
    }
  }, [savedDrawings, showToast]);

  // Clear entire gallery
  const handleClearAllDrawings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedDrawings([]);
      showToast('Gallery cleared');
    } catch (err) {
      console.error('Failed to clear gallery:', err);
    }
  }, [showToast]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid intercepting input elements
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key.toLowerCase() === 'p') {
        setTool('pen');
      } else if (e.key.toLowerCase() === 'e') {
        setTool('eraser');
      } else if (e.key.toLowerCase() === 'l') {
        setTool('line');
      } else if (e.key.toLowerCase() === 'r') {
        setTool('rectangle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSave]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between z-30 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Studio</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-400 hidden sm:inline">Active Tool: <strong className="capitalize text-slate-700">{tool}</strong></span>
        </div>

        {/* Action status toast */}
        {toastMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full shadow-md animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hardware Accelerated Canvas</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Area (Toolbar + Canvas) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Toolbar */}
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyState.canUndo}
          canRedo={historyState.canRedo}
          onSave={handleSave}
          onExport={handleExport}
        />

        {/* Center Drawing Canvas Canvas */}
        <main className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-100">
          <Canvas
            ref={canvasRef}
            tool={tool}
            color={color}
            brushSize={brushSize}
            onHistoryChange={setHistoryState}
          />
        </main>
      </div>

      {/* Bottom Gallery Dock */}
      <Gallery
        drawings={savedDrawings}
        onSelectDrawing={handleSelectDrawing}
        onDeleteDrawing={handleDeleteDrawing}
        onClearAll={handleClearAllDrawings}
      />
    </div>
  );
}

export default App;
