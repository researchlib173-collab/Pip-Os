# 🍎 Pip-OS v1.0 — Desktop Operating System Portfolio

A retro 90s Desktop Operating System portfolio website created for the **haX.baby "Baby's First Website" Hackathon**, featuring **Pip, The Skull Baby** (Junior Dream Engineer at Midnight Nursery).

---

## 🎨 Character Lore & Design

- **Name:** Pip, The Skull Baby
- **Role:** Junior Dream Engineer @ Midnight Nursery (Sector 7)
- **Visual Identity:** A smooth round skull face, soft eye sockets with glowing warm amber pinpricks, crooked friendly smile, rosy cheeks, and a bedtime nightcap adorned with gold stars and a pink bow. Cozy, soft, and wholesome—never scary!
- **Color Theme:**
  - Day Mode Wallpaper: Warm Cream (`#fff8f1`)
  - Night Mode Wallpaper: Cozy Night Slate (`#1e1a29`)
  - Accent / Headers: Rich Berry (`#a34063`) & Dark Warm Brown (`#5c4033`)
  - Highlights: Powder Pink (`#ffd1dc`), Warm Gold (`#f9d77e`)

---

## 🖥️ System Features

1. **Fixed Top System Menu Bar:**
   - Vintage menus: `🍎 Pip-OS v1.0`, `File`, `View`, `Dream Routes`, and `Help`.
   - Real-time Nursery Digital Clock (`HH:MM:SS AM/PM`).
   - Native Web Audio API sound mute toggle.
   - Day / Night Dream Mode theme switcher.

2. **Desktop Grid Shortcuts:**
   - `About Pip.txt` -> Opens **Meet Pip**.
   - `Lullaby Lab.app` -> Opens **Lullaby Lab Synthesizer**.
   - `Nightlight Catalog.folder` -> Opens **Nightlights Previewer**.
   - `Dream Delivery.map` -> Opens **Flight Route Dispatcher**.
   - `Bedtime Story.doc` -> Opens **Interactive Bedtime Story**.
   - `Guestbook.exe` -> Opens **Nursery Wall Guestbook**.
   - `Recycle Bin` -> Playful Easter Egg modal with stardust chime!

3. **Draggable & Stackable Window Frame:**
   - Titlebar dragging with mouse and touch support.
   - Retro window controls: Minimize `[_]`, Maximize `[□]`, Close `[X]`.
   - Quick navigation tabs:
     - `01. Meet Pip`: Character bio, animated dream engineering stat bars, certified equipment cards, and daily nursery shift schedule.
     - `02. Crafts & Projects`:
       - **Lullaby Lab:** Interactive 6-key piano/synthesizer keyboard with native Web Audio synthesis + "Auto-Play Lullaby" melody sequence and audio visualizer.
       - **Nightlight Catalog:** Glowing interactive nightlight sphere with color gel swatches, brightness slider, and gentle breathing pulse.
       - **Dream Delivery Routes:** Live flight radar with blanket cargo status and "Dispatch Dream Cloud" action.
     - `03. Bedtime Story`: Choose-Your-Own-Adventure branching story (*The Quest for the Lost Sleepy Sheep*) with page turns and multiple cozy endings.
     - `04. Guestbook`: Real-time nursery wall where visitors can submit their bedtime wishes with sleepy sigils (⭐, 🌙, 🐑, 💤, 🧸, 🍼).

4. **Fixed Bottom Taskbar:**
   - Windows 95 style "Start / Dreams" button opening vertical-banner Start Menu.
   - Active window tab indicator with minimize / restore toggle.
   - Illuminated 6-digit vintage green phosphor hit counter odometer (clickable to increment!).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
# or on Windows PowerShell if execution policies apply:
npm.cmd install
```

### 2. Start Development Server
```bash
npm run dev
# or
npm.cmd run dev
```

The app will start at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
# or
npm.cmd run build
```

---

## 🛠️ Tech Stack

- **React 19** with Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **Vite 6**
- **Tailwind CSS v4** with `@tailwindcss/vite`
- **Lucide React** for retro icons
- **Web Audio API** for zero-dependency native audio synthesis
