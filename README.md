# 🎨 Interactive Drawing Application

A modern browser-based drawing application built with **React, TypeScript, HTML5 Canvas API, Vite, and Tailwind CSS**.

The application provides an interactive drawing workspace with multiple drawing tools, customizable colors and brush sizes, undo functionality, canvas clearing, browser-based persistence, artwork gallery, and PNG export.

---

## 📖 Overview

The Interactive Drawing Application combines React's declarative UI and state management capabilities with the imperative rendering model of the HTML5 Canvas API.

React manages application-level state such as the selected drawing tool, stroke color, and brush size, while the Canvas API handles the actual pixel-based drawing operations. The application also uses the browser's Local Storage API to persist saved artwork across sessions.

---

## ✨ Features

- 🎨 Interactive HTML5 Canvas drawing
- 🖊️ Pen tool
- 🧹 Eraser tool
- 📏 Line tool
- ▭ Rectangle tool
- 🎨 Color picker
- 📐 Adjustable brush size
- ↩️ Undo previous drawing actions
- 🗑️ Clear entire canvas
- 💾 Save artwork to browser Local Storage
- 🖼️ Saved artwork gallery
- 🔄 Restore previously saved drawings
- 📥 Export artwork as PNG
- 💻 Responsive user interface
- ⚡ High-DPI canvas rendering
- 🧩 Component-based React architecture
- 💾 Client-side data persistence

---

# 🏗️ System Architecture

The application follows a layered architecture consisting of the React UI layer, Canvas rendering layer, and persistence layer.

```text
                         ┌──────────────────────┐
                         │      React App       │
                         │     App Component    │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
             ┌───────────────┐             ┌───────────────┐
             │    Toolbar    │             │     Canvas    │
             │               │             │   Component   │
             │ Tools         │             │               │
             │ Color         │             │ useRef        │
             │ Brush Size    │             │ Canvas API    │
             │ Undo          │             │ Drawing Logic │
             │ Save          │             └───────┬───────┘
             │ Gallery       │                     │
             │ Export        │                     ▼
             └───────────────┘             Canvas Rendering
                     │
                     ▼
              ┌───────────────┐
              │ Local Storage │
              │ Saved Artwork │
              └───────────────┘
```

---

# 🔄 Application Workflow

```text
Application Starts
        │
        ▼
Initialize React State
        │
        ├── Selected Tool
        ├── Stroke Color
        └── Brush Size
        │
        ▼
Initialize Canvas
        │
        ▼
Create 2D Rendering Context
        │
        ▼
User Selects Drawing Tool
        │
        ▼
User Configures Color / Brush Size
        │
        ▼
User Draws on Canvas
        │
        ▼
Canvas Rendering Context
        │
        ▼
Drawing Appears on Canvas
        │
        ├───────────────┐
        │               │
        ▼               ▼
      Undo            Save
        │               │
        ▼               ▼
Restore State      Local Storage
        │               │
        │               ▼
        │           Gallery
        │
        ├───────────────┐
        │               │
        ▼               ▼
      Clear           Export
        │               │
        ▼               ▼
Blank Canvas       PNG Download
```

---

# ⚛️ React and Canvas Integration

One of the main architectural challenges is combining React's declarative state management with Canvas's imperative rendering model.

React manages:

```text
Selected Tool
Stroke Color
Brush Size
Gallery State
Application UI
```

Canvas manages:

```text
Pixels
Drawing Paths
Lines
Shapes
Rendering Context
```

The application uses `useRef` to maintain a persistent reference to the canvas DOM element and its rendering context without triggering React re-renders during drawing.

---

# 🧠 State Management

The main application state is maintained at the App level so that the Toolbar and Canvas components can access the required values.

Example state:

```javascript
const [tool, setTool] = useState("pen");
const [color, setColor] = useState("#000000");
const [brushSize, setBrushSize] = useState(5);
```

### Main State

| State | Purpose |
|---|---|
| `tool` | Stores the currently selected drawing tool |
| `color` | Stores the active stroke color |
| `brushSize` | Controls drawing thickness |
| `history` | Stores previous canvas states |
| `savedDrawings` | Stores saved artwork |
| `isDrawing` | Tracks whether the user is currently drawing |

---

# 🖌️ Canvas Rendering

The Canvas component uses:

```javascript
useRef()
```

to reference the actual `<canvas>` element.

The rendering context is obtained using:

```javascript
canvas.getContext("2d")
```

The CanvasRenderingContext2D API is then used for drawing operations such as:

```text
beginPath()
moveTo()
lineTo()
stroke()
clearRect()
drawImage()
```

This keeps drawing operations outside the React rendering cycle.

---

# 🖱️ Drawing Workflow

The drawing engine responds to user pointer interactions.

```text
Mouse Down
    │
    ▼
Start Drawing
    │
    ▼
Capture Starting Coordinates
    │
    ▼
Mouse Move
    │
    ▼
Draw Between Previous and Current Coordinates
    │
    ▼
Mouse Up / Leave Canvas
    │
    ▼
Finish Stroke
    │
    ▼
Save Canvas Snapshot
```

---

# 📐 Coordinate Handling

Mouse coordinates must be converted into coordinates relative to the canvas.

The application can calculate the position using the canvas bounding rectangle:

```javascript
const rect = canvas.getBoundingClientRect();

const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
```

This provides reliable drawing coordinates even when the canvas is positioned or resized within the page.

---

# 🎨 Drawing Tools

## Pen

The Pen tool draws normally using the selected color and brush size.

```text
globalCompositeOperation = "source-over"
```

---

## Eraser

The Eraser uses the Canvas compositing system to remove existing pixels.

```text
globalCompositeOperation = "destination-out"
```

Switching between the Pen and Eraser changes the canvas rendering behavior without requiring a separate canvas.

---

## Line Tool

The Line tool allows users to draw straight lines between two selected points.

```text
Start Point
     │
     │
     ▼
End Point
```

---

## Rectangle Tool

The Rectangle tool creates rectangular shapes using the Canvas 2D rendering API.

---

# 🎨 Color Picker

A native HTML color input is used to select the active drawing color.

```html
<input type="color" />
```

Required test identifier:

```text
data-testid="color-picker"
```

---

# 📏 Brush Size

A native range input controls the thickness of the active drawing tool.

```html
<input type="range" />
```

Required test identifier:

```text
data-testid="brush-size-slider"
```

---

# ↩️ Undo System

The application maintains a history of canvas states to support undo functionality.

After a drawing stroke is completed:

```text
Canvas
  │
  ▼
canvas.toDataURL()
  │
  ▼
Create Snapshot
  │
  ▼
History Stack
```

When Undo is selected:

```text
Undo Button
     │
     ▼
Remove Latest Snapshot
     │
     ▼
Get Previous Snapshot
     │
     ▼
Create Image
     │
     ▼
drawImage()
     │
     ▼
Restore Canvas
```

This allows the most recent drawing action to be removed while preserving previous artwork.

---

# 🗑️ Clear Canvas

The Clear button completely resets the current drawing surface.

The Canvas API's clearing functionality is used to remove all existing artwork.

Required test identifier:

```text
data-testid="clear-canvas-button"
```

---

# 💾 Local Storage Persistence

The application provides client-side persistence using the browser's Local Storage API.

Saved drawings are serialized into JSON.

```text
Canvas
   │
   ▼
toDataURL()
   │
   ▼
Base64 Image String
   │
   ▼
JSON.stringify()
   │
   ▼
localStorage
```

The saved artwork is stored using:

```text
savedDrawings
```

---

# 🖼️ Artwork Gallery

When the application starts, it reads previously saved drawings from Local Storage.

```text
Application Mount
       │
       ▼
localStorage.getItem()
       │
       ▼
JSON.parse()
       │
       ▼
Saved Drawings
       │
       ▼
Gallery
       │
       ▼
Image Thumbnails
```

Clicking a gallery item restores that drawing to the active canvas.

---

# 📥 PNG Export

The application allows users to export their current artwork as a PNG image.

The process is:

```text
Canvas
   │
   ▼
canvas.toDataURL("image/png")
   │
   ▼
Generate Data URL
   │
   ▼
Create Temporary <a> Element
   │
   ▼
Set Download Filename
   │
   ▼
Trigger Click
   │
   ▼
PNG Download
```

The exported file can be saved directly to the user's device.

---

# 🔗 Canvas Data API

The application exposes a globally accessible function:

```javascript
window.getCanvasDataURL()
```

This function returns the current canvas data URL.

The expected format begins with:

```text
data:image/png;base64,
```

This provides a simple way for automated tests to verify canvas serialization.

---

# 📱 Responsive Design

The interface is designed to work across different screen sizes.

```text
Desktop
   │
   ▼
Large Drawing Workspace

Tablet
   │
   ▼
Adaptive Workspace

Mobile
   │
   ▼
Compact Toolbar
+
Responsive Canvas
```

The layout uses responsive styling so that the drawing workspace remains usable across devices.

---

# ⚡ High-DPI Rendering

To improve drawing quality on high-resolution displays, the canvas internal resolution can be scaled independently from its CSS dimensions.

```text
CSS Width / Height
        │
        ▼
Calculate Device Pixel Ratio
        │
        ▼
Increase Canvas Resolution
        │
        ▼
Scale Rendering Context
        │
        ▼
Sharper Drawing
```

This reduces blurry or pixelated rendering on Retina and other high-DPI displays.

---

# 📂 Project Structure

```text
drawing-app/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Canvas.jsx
│   │   ├── Toolbar.jsx
│   │   ├── Gallery.jsx
│   │   └── ...
│   │
│   ├── hooks/
│   │   └── ...
│   │
│   ├── utils/
│   │   └── ...
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

# 🧩 Component Responsibilities

## App Component

Acts as the central state holder.

Responsibilities:

- Maintain selected tool
- Maintain color
- Maintain brush size
- Coordinate Toolbar and Canvas
- Manage application-level state

---

## Canvas Component

Responsible for all drawing-related functionality.

Responsibilities:

- Canvas initialization
- Canvas reference
- Rendering context
- Mouse interactions
- Drawing paths
- Shape rendering
- Erasing
- Canvas snapshots
- Canvas restoration

---

## Toolbar Component

Responsible for user controls.

Responsibilities:

- Tool selection
- Color selection
- Brush size
- Undo
- Clear
- Save
- Gallery
- Export

---

## Gallery Component

Responsible for displaying saved artwork.

Responsibilities:

- Read saved drawings
- Render thumbnails
- Restore selected drawing
- Manage saved artwork UI

---

# 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- HTML5
- CSS3

### Graphics

- HTML5 Canvas API
- CanvasRenderingContext2D

### Styling

- Tailwind CSS

### Build Tool

- Vite

### Browser APIs

- Local Storage API
- Canvas API
- DOM API

### Development Tools

- Node.js
- npm
- ESLint

### Version Control

- Git
- GitHub

---

# 🔐 Data Persistence

The application uses browser-based storage rather than a backend database.

```text
User Artwork
     │
     ▼
Canvas Data URL
     │
     ▼
JSON Serialization
     │
     ▼
Browser Local Storage
```

This allows saved artwork to remain available after refreshing or reopening the application in the same browser environment.

---

# 🧪 Testing Strategy

The application is designed to support automated and manual testing.

## Canvas Testing

Verify:

- Canvas exists
- Canvas is visible
- Canvas is interactable
- Drawing operations modify canvas pixels

Required identifier:

```text
canvas[data-testid="drawing-canvas"]
```

---

## Tool Testing

Verify the presence and interaction of:

```text
data-testid="tool-pen"
data-testid="tool-eraser"
data-testid="tool-line"
data-testid="tool-rectangle"
```

---

## Color Testing

Verify:

```text
data-testid="color-picker"
```

and ensure the input is interactable.

---

## Brush Size Testing

Verify:

```text
data-testid="brush-size-slider"
```

and ensure changing the slider updates the active brush size.

---

## Clear Testing

The test suite verifies that:

```text
Draw Artwork
     │
     ▼
Canvas Contains Pixels
     │
     ▼
Click Clear
     │
     ▼
Canvas Becomes Blank
```

Required identifier:

```text
data-testid="clear-canvas-button"
```

---

## Undo Testing

The expected flow is:

```text
Draw Shape A
     │
     ▼
Snapshot 1
     │
     ▼
Draw Shape B
     │
     ▼
Snapshot 2
     │
     ▼
Click Undo
     │
     ▼
Restore Snapshot 1
```

Required identifier:

```text
data-testid="undo-button"
```

---

## Local Storage Testing

The Save functionality stores artwork under:

```text
savedDrawings
```

The test verifies that the value is:

- Present
- Valid JSON
- An array
- Contains at least one serialized drawing

Required identifier:

```text
data-testid="save-storage-button"
```

---

## Gallery Testing

The application provides:

```text
data-testid="gallery-container"
```

and individual gallery items such as:

```text
data-testid="gallery-item-0"
```

Selecting a gallery item should restore the corresponding drawing to the canvas.

---

## PNG Export Testing

Required identifier:

```text
data-testid="export-png-button"
```

The global function:

```javascript
window.getCanvasDataURL()
```

must return a valid PNG data URL beginning with:

```text
data:image/png;base64,
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd drawing-app
```

Install dependencies:

```bash
npm install
```

---

## Run the Development Server

```bash
npm run dev
```

Vite will start the development server and provide the local URL in the terminal.

---

# 🏭 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 📋 Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

# 🔄 Complete Data Flow

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Toolbar      │
                    │                 │
                    │ Tool            │
                    │ Color           │
                    │ Brush Size      │
                    └────────┬────────┘
                             │
                             │ Props
                             ▼
                    ┌─────────────────┐
                    │     Canvas      │
                    │                 │
                    │ useRef          │
                    │ Canvas Context  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Drawing Engine  │
                    │                 │
                    │ Lines           │
                    │ Shapes          │
                    │ Eraser          │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
          ┌──────────────┐        ┌──────────────┐
          │   History    │        │ LocalStorage │
          │     Stack    │        │   Gallery    │
          └──────────────┘        └──────────────┘
                 │                       │
                 ▼                       ▼
               Undo                  Restore
                                         
                             │
                             ▼
                       PNG Export
```

---

# 📊 Feature Summary

| Feature | Implementation |
|---|---|
| Drawing Canvas | HTML5 Canvas API |
| Pen Tool | Canvas stroke rendering |
| Eraser | `destination-out` compositing |
| Line Tool | Canvas path rendering |
| Rectangle Tool | Canvas shape rendering |
| Color Selection | Native color input |
| Brush Size | Native range input |
| Undo | Canvas snapshot history |
| Clear | Canvas clearing |
| Persistence | Local Storage |
| Gallery | Saved canvas thumbnails |
| Restore | Image + `drawImage()` |
| PNG Export | Canvas data URL |
| State Management | React Hooks |
| DOM Reference | `useRef` |
| Side Effects | `useEffect` |
| Styling | Tailwind CSS |
| Build Tool | Vite |

---

# 🧠 Key Concepts Demonstrated

This project demonstrates practical understanding of:

- React component architecture
- React Hooks
- `useState`
- `useRef`
- `useEffect`
- State management
- HTML5 Canvas API
- Canvas rendering context
- DOM manipulation
- Mouse event handling
- Coordinate calculations
- Drawing paths
- Canvas compositing
- Undo/redo concepts
- Data serialization
- Local Storage
- JSON parsing and stringification
- Base64 image data
- PNG export
- Responsive UI development
- High-DPI rendering
- Component communication
- Client-side persistence

---

# ⚡ Performance Considerations

Canvas drawing is handled directly through the Canvas rendering context rather than storing every pixel operation inside React state.

This prevents unnecessary React re-renders during continuous drawing operations.

For undo functionality, the application uses canvas snapshots for simplicity. For a larger production-grade application, drawing commands could instead be stored and replayed to reduce memory usage.

---

# 🔮 Future Enhancements

Potential improvements include:

- Touch and stylus support
- Redo functionality
- Circle and polygon tools
- Fill bucket tool
- Text tool
- Image upload
- Image manipulation
- Multiple canvas layers
- Background customization
- Adjustable opacity
- Stroke styles
- Drawing templates
- Cloud-based artwork storage
- User authentication
- Collaborative real-time drawing
- IndexedDB-based storage for larger artwork collections
- Event-sourcing based drawing history

---

# 📄 License

This project is licensed under the MIT License.
