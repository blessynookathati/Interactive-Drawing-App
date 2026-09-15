# Interactive Drawing Application

A high-performance, browser-based real-time interactive drawing application engineered with React, Vite, Tailwind CSS, and the HTML5 Canvas 2D API. The application bridges React's declarative state management with low-level, imperative raster graphics commands, complete with undo/redo history tracking, local storage persistence, and PNG image export.

---

## Architectural Overview

Combining React with the HTML5 Canvas API requires a hybrid architecture. While standard React applications re-render DOM nodes based on reactive state changes, an HTML5 `<canvas>` relies on a stateful, rasterized pixel buffer managed outside the Virtual DOM.

### Component & Data Flow Diagram

```mermaid
flowchart TD
    subgraph React_DOM_Layer [React DOM & Declarative State Layer]
        App[App Component\n- Central State Holder\n- Keyboard Shortcuts]
        Toolbar[Toolbar Component\n- Tool Selectors\n- Color Picker\n- Brush Size Slider\n- Undo/Redo/Clear/Save/Export]
        Gallery[Gallery Component\n- Saved Drawings Gallery\n- Local Storage Reader]
        
        App -->|tool, color, brushSize| Toolbar
        App -->|tool, color, brushSize| CanvasComp[Canvas Component]
        App -->|savedDrawings| Gallery
    end

    subgraph Graphics_Subsystem [Canvas Imperative Graphics Engine]
        CanvasDOM["&lt;canvas data-testid='drawing-canvas'&gt;"]
        Ctx2D[CanvasRenderingContext2D]
        HistoryStack[History Stack\n- Undo / Redo Snapshots]

        CanvasComp -->|useRef| CanvasDOM
        CanvasDOM -->|getContext('2d')| Ctx2D
        Ctx2D -->|Rasterized Operations| RasterOutput[Hardware-Accelerated Framebuffer]
        CanvasDOM -->|toDataURL| HistoryStack
        HistoryStack -->|restoreSnapshot| Ctx2D
    end

    subgraph Persistence_Layer [Web Storage API]
        LocalStorage[(Browser LocalStorage\nKey: 'savedDrawings')]
        App <-->|JSON.stringify / parse| LocalStorage
        Gallery -->|Load selected image| CanvasComp
    end
```

### Bridging Declarative State with Imperative Operations

- **State Management (`useState`)**: Handles high-level UI states—active tool (`pen`, `eraser`, `line`, `rectangle`), stroke color, and line thickness.
- **Persistent Node Referencing (`useRef`)**: Maintains direct references to the `<canvas>` DOM element and its `CanvasRenderingContext2D` without causing re-renders that would natively wipe canvas memory.
- **Decoupled Drawing Engine**: Mouse and touch coordinates are translated to canvas raster coordinates in real time. Shapes such as lines and rectangles utilize non-destructive off-screen image snapshots (`getImageData`/`putImageData`) for 60 FPS live drag-and-drop previews.

---

## Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI component architecture and state management |
| **Vite 5** | Next-generation build tool with instant Hot Module Replacement (HMR) |
| **HTML5 Canvas 2D API** | Low-level raster graphics rendering, stroke composition, and transformation |
| **Tailwind CSS** | Utility-first, responsive styling with clean glassmorphic aesthetics |
| **Lucide React** | Consistent iconography for creative tools and actions |
| **Web Storage API** | Client-side persistent gallery storage via `localStorage` |

---

## Core Features & Toolset

### 1. Drawing Tools
- **Pen Tool (`tool-pen`)**: Smooth freehand sketching with rounded line caps and joins.
- **Eraser Tool (`tool-eraser`)**: Pixel-erasing functionality utilizing `context.globalCompositeOperation = 'destination-out'`.
- **Line Tool (`tool-line`)**: Live preview line drawing from cursor start to release position.
- **Rectangle Tool (`tool-rectangle`)**: Real-time bounded box preview and rendering.

### 2. Stroke & Color Controls
- **Native Color Picker (`color-picker`)**: Custom color selection input with hexadecimal display.
- **Curated Palette Swatches**: Quick selection from a modern palette.
- **Brush Size Slider (`brush-size-slider`)**: Dynamic range slider from 1px to 60px with a real-time cursor dimension preview badge.

### 3. Canvas History (Undo / Redo)
- **Snapshot Stack**: Automatic raster capture (`toDataURL`) upon stroke completion.
- **Undo (`undo-button`)**: Reverts to the previous canvas snapshot without quality degradation.
- **Redo**: Advances to undone states if no new drawing stroke has invalidated the forward history.

### 4. Local Storage Persistence & Gallery
- **Save to Storage (`save-storage-button`)**: Serializes current artwork and appends it to the `savedDrawings` key in browser `localStorage`.
- **Artwork Gallery (`gallery-container`)**: Interactive dock reading from local storage on mount, displaying artwork thumbnails (`gallery-item-0`, `gallery-item-1`, ...).
- **Instant Canvas Restoration**: Clicking any thumbnail seamlessly loads the artwork onto the active canvas.

### 5. Export Capabilities
- **Export as PNG (`export-png-button`)**: Generates an uncompressed high-quality PNG image download.
- **Global Serialization Hook (`window.getCanvasDataURL`)**: Exposes programmatic serialization for automated test suites and external integrations.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl` + `Z` / `Cmd` + `Z` | Undo last stroke |
| `Ctrl` + `Y` / `Cmd` + `Shift` + `Z` | Redo next stroke |
| `Ctrl` + `S` / `Cmd` + `S` | Save artwork to gallery |
| `P` | Switch to Pen tool |
| `E` | Switch to Eraser tool |
| `L` | Switch to Line tool |
| `R` | Switch to Rectangle tool |

---

## Automated Testing & Specification Conformance

The codebase adheres strictly to the contract requirements for programmatic test runners:

| Requirement / Test Identifier | Element Type | Implementation Details |
| :--- | :--- | :--- |
| `drawing-canvas` | `<canvas>` | Main drawing canvas with 2D rendering context |
| `tool-pen` | `<button>` | Selects freehand pen tool |
| `tool-eraser` | `<button>` | Configures `destination-out` composition |
| `tool-line` | `<button>` | Activates straight line tool |
| `tool-rectangle` | `<button>` | Activates rectangle shape tool |
| `color-picker` | `<input type="color">` | Standard color picker input |
| `brush-size-slider` | `<input type="range">` | Standard range slider input |
| `clear-canvas-button` | `<button>` | Fully clears context pixels |
| `undo-button` | `<button>` | Restores prior snapshot data URL |
| `save-storage-button` | `<button>` | Persists JSON array to `localStorage['savedDrawings']` |
| `gallery-container` | `<div>` | Container for saved artworks |
| `gallery-item-0` | `<div>` | First rendered gallery item |
| `export-png-button` | `<button>` | Triggers PNG image download |
| `window.getCanvasDataURL()` | Global Function | Returns valid `data:image/png;base64,...` string |

---

## Local Development & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone or navigate to the repository directory:
   ```bash
   cd "Interactive drawing application"
   ```
2. Install all project dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/`.

### Production Build
To create an optimized production distribution:
```bash
npm run build
```
The compiled assets will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```
