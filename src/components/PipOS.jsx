import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  FileText,
  Music,
  Folder,
  MapPin,
  BookOpen,
  MessageSquare,
  Trash2,
  Sparkles,
  Clock,
  Send,
  Radio,
  RotateCcw,
  Zap,
  Award,
  ChevronRight,
  Tv,
  Box,
  Lightbulb
} from 'lucide-react';
import ThreePixelEngine from './ThreePixelEngine';
import Lantern3DViewer from './Lantern3DViewer';
import Pip3DViewer from './Pip3DViewer';
import DesktopBabyCompanion from './DesktopBabyCompanion';
import AnisoLandingPage from './AnisoLandingPage';
import MusicBox3DViewer from './MusicBox3DViewer';

/**
 * Pip-OS v1.0 - Full 90s Pixel Art Dream Nursery OS
 * Created for the haX.baby "Baby's First Website" Hackathon
 * 
 * Pixel Art Features:
 * - Powered by `cloudai-x/threejs-skills` (threejs-postprocessing RenderPixelatedPass)
 * - 8-bit & 16-bit stepped pixel borders, pixel-shadows, and dithered textures
 * - Pixel typography: Press Start 2P, Silkscreen, Lonewarc, RetroPumkin, SpookyTheme, Bubblegum
 * - Interactive CRT Scanline overlay toggle
 * - Mode Switching Contrast Pixel Skull Watermark
 * - Playable 3D Pixel Realm and 8-bit Lullaby Synthesizer
 */

export default function PipOS() {
  // ==========================================
  // SYSTEM STATE
  // ==========================================
  const [isNightMode, setIsNightMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCrtEnabled, setIsCrtEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [hitCount, setHitCount] = useState(1248);
  const [viewMode, setViewMode] = useState('landing'); // 'landing' (Aniso Theme) | 'os' (Retro 90s Desktop)

  // Mode Transition Watermark State
  const [isModeTransitioning, setIsModeTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState('in'); // 'in' | 'out'
  const [nextMode, setNextMode] = useState(true);

  // Window Management
  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('meet-pip'); // 'meet-pip' | 'crafts' | 'story' | 'guestbook'
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState(null);

  // Draggable Desktop Icons State
  const [desktopIcons, setDesktopIcons] = useState([
    { id: 'about', label: 'About_Pip.txt', type: 'file', x: 20, y: 56, tab: 'meet-pip', subTab: null },
    { id: 'pip3d', label: 'Pip_3D.app', type: 'pip3d', x: 20, y: 164, tab: 'meet-pip', subTab: null },
    { id: 'lantern', label: 'Lantern_3D.app', type: 'lantern', x: 20, y: 272, tab: 'crafts', subTab: 'nightlight' },
    { id: '3d-realm', label: '3D_Realm.exe', type: 'box', x: 20, y: 380, tab: 'crafts', subTab: '3d-pixel' },
    { id: 'nightlight', label: 'Nightlights.dir', type: 'folder', x: 20, y: 488, tab: 'crafts', subTab: 'nightlight' },
    { id: 'lullaby', label: 'Lullaby_Lab.app', type: 'music', x: 140, y: 56, tab: 'crafts', subTab: 'lullaby' },
    { id: 'delivery', label: 'Delivery.map', type: 'map', x: 140, y: 164, tab: 'crafts', subTab: 'routes' },
    { id: 'story', label: 'Bedtime.doc', type: 'book', x: 140, y: 272, tab: 'story', subTab: null },
    { id: 'guestbook', label: 'Guestbook.exe', type: 'chat', x: 140, y: 380, tab: 'guestbook', subTab: null },
    { id: 'recycle', label: 'Recycle_Bin', type: 'trash', x: 140, y: 488, tab: null, subTab: null }
  ]);

  const [draggingIconId, setDraggingIconId] = useState(null);
  const iconDragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0, moved: false });

  // Draggable Window Coordinates
  const [windowPos, setWindowPos] = useState({ x: 100, y: 52 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Popups & Dropdowns
  const [activeMenu, setActiveMenu] = useState(null); // 'apple' | 'file' | 'view' | 'routes' | 'help'
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);
  const [pipSpeech, setPipSpeech] = useState(null);

  // Crafts & Projects State
  const [craftsSubTab, setCraftsSubTab] = useState('3d-pixel'); // '3d-pixel' | 'lullaby' | 'nightlight' | 'routes'
  const [activePianoKey, setActivePianoKey] = useState(null);
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [nightlightColor, setNightlightColor] = useState('#fbbf24');
  const [nightlightGlow, setNightlightGlow] = useState(85);
  const [breathingLight, setBreathingLight] = useState(true);
  const [activeRouteId, setActiveRouteId] = useState('route-1');
  const [cloudDispatched, setCloudDispatched] = useState(false);

  // Interactive Bedtime Story State
  const [storyNode, setStoryNode] = useState(0);

  // Guestbook State
  const [guestbookEntries, setGuestbookEntries] = useState([
    {
      id: 1,
      name: 'Barnaby the Bear',
      sigil: '🧸',
      date: '10:42 PM',
      message: 'The honey-lavender tea dream sequence worked wonders. Slept for 3 winter months straight!'
    },
    {
      id: 2,
      name: 'Luna Moths Guild',
      sigil: '🌙',
      date: '11:15 PM',
      message: "Pip's nightlight calibration is 10/10! No more bumping into nursery lamps at night."
    },
    {
      id: 3,
      name: 'Baby Comet Oliver',
      sigil: '⭐',
      date: '12:04 AM',
      message: 'Pip fluffed my cloud pillow to absolute perfection. Smoothest dream flight ever.'
    }
  ]);
  const [guestName, setGuestName] = useState('');
  const [guestWish, setGuestWish] = useState('');
  const [guestSigil, setGuestSigil] = useState('⭐');

  // ==========================================
  // NATIVE WEB AUDIO API SYNTHESIZER
  // ==========================================
  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current && AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback((freq = 750, type = 'square') => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }, [isMuted, getAudioContext]);

  const playChime = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.45);
      });
    } catch {
      // Audio fallback
    }
  }, [isMuted, getAudioContext]);

  const playLullabyNote = useCallback((freq, duration = 0.5) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }, [isMuted, getAudioContext]);

  const playMagic = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }, [isMuted, getAudioContext]);

  // Mode Transition with Contrast Pixel Skull Watermark
  const handleToggleTheme = () => {
    if (isModeTransitioning) return;
    playMagic();
    const target = !isNightMode;
    setNextMode(target);
    setIsModeTransitioning(true);
    setTransitionPhase('in');

    setTimeout(() => {
      setIsNightMode(target);
    }, 450);

    setTimeout(() => {
      setTransitionPhase('out');
    }, 850);

    setTimeout(() => {
      setIsModeTransitioning(false);
    }, 1200);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.system-menu-bar') && !e.target.closest('.start-menu-container')) {
        setActiveMenu(null);
        setIsStartMenuOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMouseDownHeader = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: windowPos.x,
      startY: windowPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.startX + dx));
      const newY = Math.max(38, Math.min(window.innerHeight - 150, dragStartRef.current.startY + dy));
      setWindowPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Desktop Icon Dragging Handlers
  const handleIconPointerDown = (e, icon) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setDraggingIconId(icon.id);
    setSelectedDesktopIcon(icon.id);
    iconDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: icon.x,
      initialY: icon.y,
      moved: false
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggingIconId) return;
      const dx = e.clientX - iconDragStartRef.current.mouseX;
      const dy = e.clientY - iconDragStartRef.current.mouseY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        iconDragStartRef.current.moved = true;
      }

      setDesktopIcons((prev) =>
        prev.map((item) => {
          if (item.id === draggingIconId) {
            const nextX = Math.max(8, Math.min(window.innerWidth - 120, iconDragStartRef.current.initialX + dx));
            const nextY = Math.max(40, Math.min(window.innerHeight - 120, iconDragStartRef.current.initialY + dy));
            return { ...item, x: nextX, y: nextY };
          }
          return item;
        })
      );
    };

    const handlePointerUp = () => {
      setDraggingIconId(null);
    };

    if (draggingIconId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingIconId]);

  const handleIconClick = (icon) => {
    if (!iconDragStartRef.current.moved) {
      playClick(800);
      setSelectedDesktopIcon(icon.id);
    }
  };

  const handleIconDoubleClick = (icon) => {
    if (icon.tab) {
      handleOpenDesktopIcon(icon.tab, icon.subTab);
    } else if (icon.id === 'recycle') {
      playMagic();
      setRecycleBinOpen(true);
    }
  };

  const renderIconGraphic = (type) => {
    switch (type) {
      case 'file':
        return <FileText className="text-[#a34063]" size={28} />;
      case 'pip3d':
        return <span className="text-2xl filter drop-shadow-[1px_1px_0px_#000]">💀</span>;
      case 'box':
        return <Box className="text-amber-500" size={28} />;
      case 'lantern':
        return <Lightbulb className="text-amber-400 fill-amber-300/40 animate-pulse" size={28} />;
      case 'folder':
        return <Folder className="text-amber-400 fill-amber-400/40" size={28} />;
      case 'music':
        return <Music className="text-pink-400" size={28} />;
      case 'map':
        return <MapPin className="text-emerald-500" size={28} />;
      case 'book':
        return <BookOpen className="text-indigo-400" size={28} />;
      case 'chat':
        return <MessageSquare className="text-rose-400" size={28} />;
      case 'trash':
        return <Trash2 className="text-stone-400" size={28} />;
      default:
        return <FileText size={28} />;
    }
  };

  const playAutoLullaby = () => {
    if (isPlayingLullaby) return;
    setIsPlayingLullaby(true);
    playClick(880);

    const sequence = [
      { note: 'C5', freq: 523.25, time: 0 },
      { note: 'C5', freq: 523.25, time: 450 },
      { note: 'G5', freq: 783.99, time: 900 },
      { note: 'G5', freq: 783.99, time: 1350 },
      { note: 'A5', freq: 880.00, time: 1800 },
      { note: 'A5', freq: 880.00, time: 2250 },
      { note: 'G5', freq: 783.99, time: 2700 }
    ];

    sequence.forEach((item) => {
      setTimeout(() => {
        setActivePianoKey(item.note);
        playLullabyNote(item.freq, 0.4);
      }, item.time);
    });

    setTimeout(() => {
      setActivePianoKey(null);
      setIsPlayingLullaby(false);
      showToast('🎶 8-Bit Twinkle Lullaby transmission complete!');
    }, 3250);
  };

  const pianoKeys = [
    { label: 'C5', freq: 523.25, sub: 'Do' },
    { label: 'D5', freq: 587.33, sub: 'Re' },
    { label: 'E5', freq: 659.25, sub: 'Mi' },
    { label: 'G5', freq: 783.99, sub: 'Sol' },
    { label: 'A5', freq: 880.00, sub: 'La' },
    { label: 'C6', freq: 1046.50, sub: 'Hi Do' }
  ];

  const nightlightPresets = [
    { name: 'Warm Amber', color: '#fbbf24' },
    { name: 'Lavender Dusk', color: '#c084fc' },
    { name: 'Starlight Mint', color: '#6ee7b7' },
    { name: 'Peachy Slumber', color: '#fda4af' },
    { name: 'Nebula Blue', color: '#93c5fd' }
  ];

  const storyNodes = [
    {
      id: 0,
      title: 'Chapter I: The Escaped Counting Sheep',
      text: 'The Midnight Nursery clock tolls 12:00 AM. Barnaby, counting-sheep #47, has hopped right over the dreamy picket fence into the Great Starfield! Without Barnaby, no babies in Sector 7 can drift to sleep.',
      choices: [
        { label: 'Follow the glowing stardust footprints', next: 1 },
        { label: 'Consult the Wise Crescent Moon with your brass compass', next: 2 }
      ]
    },
    {
      id: 1,
      title: 'Chapter II: The Lavender Nebula',
      text: 'Following the sparkly hoofprints, Pip finds Barnaby happily munching on a cotton-candy lavender cloud alongside a sleepy star-kitten.',
      choices: [
        { label: 'Gently play the Pocket Lullaby Chime', next: 3 },
        { label: 'Offer Barnaby a warm bottle of chamomile star-milk', next: 4 }
      ]
    },
    {
      id: 2,
      title: 'Chapter II: The Crescent Moon’s Hearth',
      text: 'Mr. Moon peeks out from his starry nightcap, sipping warm honey tea. "Ah, young Dream Engineer! Barnaby mentioned he needed an extra-soft pillow before counting duty tonight."',
      choices: [
        { label: 'Fluff a fresh cumulus pillow with cloud-spoons', next: 3 },
        { label: 'Sing the Midnight Nursery Anthem together', next: 4 }
      ]
    },
    {
      id: 3,
      title: 'Epilogue: Sweet Dreams Restored',
      text: 'Barnaby lets out a gentle sleepy yawn and curls up into a perfect marshmallow cloud. Every baby across Sector 7 closes their eyes in peaceful harmony. Pip awards you the Golden Starlight Ribbon! ⭐',
      ending: true
    },
    {
      id: 4,
      title: 'Epilogue: The Starry Slumber Party',
      text: 'Barnaby, Pip, and all the sleepy nursery critters share a cozy feast of starry biscuits. The lullaby radio echoes softly across the Milky Way, ensuring sweet dreams for everyone tonight. 🌙✨',
      ending: true
    }
  ];

  const pipQuotes = [
    "“Did you know? Starlight travels millions of miles just to kiss your sleepy eyelids goodnight!”",
    "“Nightmares are just dreams that forgot to turn on their nightlights.”",
    "“Remember to fluff your pillow twice—once for sweet dreams, and once for moonbeams!”",
    "“Junior Dream Engineer Pip reporting for cozy bedtime duty! 💤”",
    "“Every little star in the sky is listening to your gentle heartbeat.”"
  ];

  const handlePipAvatarClick = () => {
    playMagic();
    const randomQuote = pipQuotes[Math.floor(Math.random() * pipQuotes.length)];
    setPipSpeech(randomQuote);
  };

  const handleAddGuestbook = (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestWish.trim()) return;
    playChime();
    const newEntry = {
      id: Date.now(),
      name: guestName.trim(),
      message: guestWish.trim(),
      sigil: guestSigil,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setGuestbookEntries([newEntry, ...guestbookEntries]);
    setGuestName('');
    setGuestWish('');
    showToast('✨ Stamped to Pixel Nursery Wall!');
  };

  const handleEmptyRecycleBin = () => {
    playMagic();
    setRecycleBinOpen(false);
    showToast('✨ 0 dreams lost! All dreams are kept safe forever.');
  };

  const handleOpenDesktopIcon = (tabName, subTabName) => {
    playChime();
    setIsWindowOpen(true);
    setIsMinimized(false);
    if (tabName) setActiveTab(tabName);
    if (subTabName) setCraftsSubTab(subTabName);
  };

  const bgStyle = isNightMode ? 'bg-dither-night text-[#e8e2e9]' : 'bg-dither-day text-[#3d2e37]';

  return (
    <div className={`relative w-full min-h-screen select-none overflow-hidden transition-colors duration-700 ${bgStyle}`}>
      {/* CRT Scanline Overlay Effect (Retro Arcade Simulation) */}
      {isCrtEnabled && <div className="crt-scanlines pointer-events-none" />}

      {/* =========================================================================
          CONTRAST PIXEL SKULL WATERMARK (DURING MODE TRANSITION ONLY)
          ========================================================================= */}
      {isModeTransitioning && (
        <div
          className={`fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center transition-all duration-500 ease-out backdrop-blur-[2px] ${
            transitionPhase === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            backgroundColor: nextMode
              ? 'rgba(30, 26, 41, 0.65)'
              : 'rgba(255, 248, 241, 0.65)'
          }}
        >
          {/* Stepped Pixel Art Skull Watermark in Contrast Color */}
          <div className="relative z-10 flex flex-col items-center animate-pulse">
            <PixelContrastSkullWatermark isTargetNight={nextMode} />

            <div
              className="mt-6 px-4 py-2 border-2 font-pixel text-[10px] tracking-widest uppercase shadow-2xl transition-all duration-500 pixel-border"
              style={{
                color: nextMode ? '#f9d77e' : '#ffffff',
                backgroundColor: nextMode ? '#1e1a29' : '#a34063',
                borderColor: nextMode ? '#f9d77e' : '#5c2035'
              }}
            >
              {nextMode ? '🌙 WARPING TO SLUMBER NIGHT MODE ✨' : '☀️ RETURNING TO WARM CREAM DAY MODE ☁️'}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. TOP SYSTEM MENU BAR (Fixed Top)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-8 bg-[#dfd7ce] text-[#2c242b] border-b-2 border-b-[#403b38] flex items-center justify-between px-2 text-xs shadow-sm select-none">
        <div className="flex items-center gap-1 sm:gap-2 relative system-menu-bar">
          <div className="relative">
            <button
              onClick={() => {
                playClick(800);
                setActiveMenu(activeMenu === 'apple' ? null : 'apple');
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 pixel-btn ${
                activeMenu === 'apple' ? 'bg-[#a34063] text-white' : 'bg-[#ede7df] hover:bg-[#fff]'
              }`}
            >
              <span className="text-sm">🍎</span>
              <span className="font-pixel text-[11px] text-[#a34063] tracking-wider">Pip-OS</span>
              <span className="text-[9px] text-white font-pixel bg-[#a34063] px-1 py-0.5 rounded-none">v1.0</span>
            </button>

            {activeMenu === 'apple' && (
              <div className="absolute top-7 left-0 w-60 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl py-1.5 z-50 font-silkscreen text-[11px] pixel-border">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    handlePipAvatarClick();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span className="font-pixel text-[9px]">About Pip-OS v1.0</span>
                  <Sparkles size={12} />
                </button>
                <div className="my-1 border-t-2 border-t-stone-400 border-b-2 border-b-white" />
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('🌙 Midnight Nursery OS - 64 KB RAM Allocated');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white"
                >
                  Nursery Telemetry
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('⭐ haX.baby Hackathon Entry');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white"
                >
                  Hackathon Credits
                </button>
                <div className="my-1 border-t-2 border-t-stone-400 border-b-2 border-b-white" />
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('💤 Tucking Pip into bed... Sweet dreams!');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white font-pixel text-[9px] text-[#a34063]"
                >
                  Sleep Tight (Nap)
                </button>
              </div>
            )}
          </div>

          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => {
                playClick();
                setActiveMenu(activeMenu === 'file' ? null : 'file');
              }}
              className={`px-2 py-0.5 font-silkscreen text-xs pixel-btn ${
                activeMenu === 'file' ? 'bg-[#a34063] text-white' : 'bg-[#ede7df] hover:bg-[#fff]'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute top-7 left-0 w-52 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl py-1 z-50 font-silkscreen text-[11px] pixel-border">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    setIsWindowOpen(true);
                    setIsMinimized(false);
                    setActiveTab('crafts');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white"
                >
                  New Dream Sheet...
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    playChime();
                    showToast('💾 Saving lullaby sheet to nursery cassette tape...');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white"
                >
                  Save Lullaby (.wav)
                </button>
                <div className="my-1 border-t-2 border-t-stone-400 border-b-2 border-b-white" />
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    setIsWindowOpen(false);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white text-red-700"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => {
                playClick();
                setActiveMenu(activeMenu === 'view' ? null : 'view');
              }}
              className={`px-2 py-0.5 font-silkscreen text-xs pixel-btn ${
                activeMenu === 'view' ? 'bg-[#a34063] text-white' : 'bg-[#ede7df] hover:bg-[#fff]'
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute top-7 left-0 w-56 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl py-1 z-50 font-silkscreen text-[11px] pixel-border">
                <button
                  onClick={() => {
                    handleToggleTheme();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span>Toggle Dream Mode</span>
                  <span className="font-pixel text-[8px]">{isNightMode ? 'NIGHT' : 'DAY'}</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setIsCrtEnabled(!isCrtEnabled);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span>CRT Scanlines</span>
                  <span className="font-pixel text-[8px]">{isCrtEnabled ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setIsMuted(!isMuted);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span>Audio Feedback</span>
                  <span className="font-pixel text-[8px]">{isMuted ? 'MUTE' : 'ON'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => {
                playClick();
                setActiveMenu(activeMenu === 'help' ? null : 'help');
              }}
              className={`px-2 py-0.5 font-silkscreen text-xs pixel-btn ${
                activeMenu === 'help' ? 'bg-[#a34063] text-white' : 'bg-[#ede7df] hover:bg-[#fff]'
              }`}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="absolute top-7 left-0 w-56 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl py-1 z-50 font-silkscreen text-[11px] pixel-border">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('💡 Tip: Double click Pip or the Recycle Bin for secrets!');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white"
                >
                  Nursery Guidebook
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('🐛 Bug report sent to Midnight Firefly dispatch!');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white"
                >
                  Dispatch Firefly (Bug)
                </button>
              </div>
            )}
          </div>

          {/* Aniso Theme Landing Page Switcher */}
          <button
            onClick={() => {
              playClick();
              setViewMode(viewMode === 'landing' ? 'os' : 'landing');
            }}
            className="px-2.5 py-0.5 bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700 text-white font-pixel text-[8px] border border-white/60 shadow-xs pixel-btn flex items-center gap-1"
            title="Toggle between Aniso Landing Page and Retro 90s OS Desktop"
          >
            <span>{viewMode === 'landing' ? '🖥️ RETRO OS' : '✨ ANISO LANDING'}</span>
          </button>
        </div>

        {/* Right Status Tray */}
        <div className="flex items-center gap-2">
          {/* CRT Toggle Button */}
          <button
            onClick={() => {
              playClick();
              setIsCrtEnabled(!isCrtEnabled);
            }}
            title="Toggle CRT Scanline Overlay"
            className={`p-1 pixel-btn ${isCrtEnabled ? 'bg-[#a34063] text-white' : 'bg-[#ede7df] text-stone-700'}`}
          >
            <Tv size={14} />
          </button>

          {/* Audio Mute */}
          <button
            onClick={() => {
              const nextState = !isMuted;
              setIsMuted(nextState);
              if (!nextState) playClick(900);
            }}
            title={isMuted ? 'Sound Muted' : 'Sound Active'}
            className="p-1 pixel-btn bg-[#ede7df]"
          >
            {isMuted ? <VolumeX size={14} className="text-red-700" /> : <Volume2 size={14} className="text-[#a34063]" />}
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-pixel bg-[#ede7df] pixel-btn"
          >
            {isNightMode ? (
              <>
                <Moon size={11} className="text-indigo-400 fill-indigo-400" />
                <span className="hidden sm:inline">NIGHT</span>
              </>
            ) : (
              <>
                <Sun size={11} className="text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">DAY</span>
              </>
            )}
          </button>

          {/* Nursery Clock in Pixel Font */}
          <div className="flex items-center gap-1 font-pixel text-[9px] bg-black text-[#52e552] px-2 py-1 border border-stone-600 shadow-inner">
            <Clock size={10} className="text-[#52e552]" />
            <span>{currentTime || '12:00:00 AM'}</span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-11 left-1/2 -translate-x-1/2 z-50 bg-[#a34063] text-white px-4 py-2 border-2 border-white shadow-2xl text-[10px] font-pixel animate-bounce flex items-center gap-2 pixel-border">
          <Sparkles size={14} className="text-[#f9d77e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pip Whispered Secret Bubble */}
      {pipSpeech && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 bg-[#fffdf8] text-[#5c4033] p-3.5 border-4 border-[#3a2e37] shadow-[6px_6px_0px_#a34063] rounded-none animate-in fade-in pixel-border">
          <div className="flex justify-between items-start mb-1.5 border-b-2 border-stone-300 pb-1">
            <span className="font-pixel text-[10px] text-[#a34063] flex items-center gap-1">
              <span>💀</span> PIP WHISPERS:
            </span>
            <button onClick={() => setPipSpeech(null)} className="font-pixel text-[10px] text-stone-500 hover:text-black">
              [X]
            </button>
          </div>
          <p className="font-bubblegum text-sm italic leading-relaxed text-[#5c4033]">{pipSpeech}</p>
        </div>
      )}

      {/* =========================================================================
          2. VIEW MODE ROUTING: ANISO LANDING PAGE vs RETRO 90S OS DESKTOP
          ========================================================================= */}
      {viewMode === 'landing' ? (
        <AnisoLandingPage
          onLaunchDesktop={() => setViewMode('os')}
          isNightMode={isNightMode}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <>
          {/* =========================================================================
              2. DESKTOP SHORTCUTS (DRAGGABLE PIXEL ICONS)
              ========================================================================= */}
          <main className="pt-10 pb-16 px-4 md:px-6 min-h-screen relative overflow-hidden">
        {/* Draggable Desktop Icons Canvas */}
        <div className="absolute inset-0 pointer-events-none select-none z-10">
          {desktopIcons.map((icon) => (
            <div key={icon.id} className="pointer-events-auto">
              <DesktopPixelIcon
                icon={renderIconGraphic(icon.type)}
                label={icon.label}
                isSelected={selectedDesktopIcon === icon.id}
                isNightMode={isNightMode}
                isDragging={draggingIconId === icon.id}
                onPointerDown={(e) => handleIconPointerDown(e, icon)}
                onClick={() => handleIconClick(icon)}
                onDoubleClick={() => handleIconDoubleClick(icon)}
                style={{
                  left: `${icon.x}px`,
                  top: `${icon.y}px`
                }}
              />
            </div>
          ))}
        </div>

        {/* =========================================================================
            ROAMING DESKTOP BABY PIP (Fully Colored, Wandering & Giggling Companion)
            ========================================================================= */}
        <DesktopBabyCompanion
          isNightMode={isNightMode}
          onPipGiggle={() => {
            playClick(600);
            triggerConfetti();
          }}
        />

        {/* =========================================================================
            3. MAIN OS WINDOW FRAME (Pixel-Beveled & Draggable)
            ========================================================================= */}
        {isWindowOpen && !isMinimized && (
          <div
            style={
              isMaximized
                ? {
                    top: '34px',
                    left: '0px',
                    right: '0px',
                    bottom: '40px',
                    width: '100%',
                    height: 'calc(100vh - 74px)'
                  }
                : {
                    top: `${windowPos.y}px`,
                    left: `${windowPos.x}px`
                  }
            }
            className={`z-30 transition-shadow ${
              isMaximized
                ? 'fixed'
                : 'absolute w-[94vw] sm:w-[680px] md:w-[820px] max-w-[920px] shadow-[8px_8px_0px_#00000099]'
            } bg-[#ece5dc] border-4 border-[#3a2e37] flex flex-col pixel-border`}
          >
            {/* Titlebar with Stepped Pixel Art Styling */}
            <div
              onMouseDown={handleMouseDownHeader}
              className="bg-[#a34063] select-none text-white px-3 py-1.5 flex items-center justify-between cursor-move border-b-2 border-b-black font-pixel text-[11px]"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, #a34063 0px, #a34063 4px, #8c3353 4px, #8c3353 8px)'
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span>💀</span>
                <span className="tracking-wider text-[10px] truncate text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  PIP_PORTFOLIO.EXE :: [JUNIOR DREAM ENGINEER]
                </span>
              </div>

              <div className="flex items-center gap-1 ml-2 font-pixel text-[9px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setIsMinimized(true);
                  }}
                  className="w-5 h-5 bg-[#dfd7ce] text-black border-2 border-t-white border-l-white border-r-black border-b-black flex items-center justify-center font-bold pixel-btn"
                  title="Minimize"
                >
                  _
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setIsMaximized(!isMaximized);
                  }}
                  className="w-5 h-5 bg-[#dfd7ce] text-black border-2 border-t-white border-l-white border-r-black border-b-black flex items-center justify-center font-bold pixel-btn"
                  title={isMaximized ? 'Restore' : 'Maximize'}
                >
                  {isMaximized ? '❐' : '□'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick(400);
                    setIsWindowOpen(false);
                  }}
                  className="w-5 h-5 bg-[#dfd7ce] text-black border-2 border-t-white border-l-white border-r-black border-b-black flex items-center justify-center font-bold hover:bg-[#ff7b90] hover:text-white pixel-btn"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Breadcrumb strip with Lonewarc font */}
            <div className="bg-[#dfd7ce] px-3 py-1 text-[11px] border-b-2 border-stone-400 text-stone-700 flex items-center justify-between font-lonewarc">
              <span className="flex items-center gap-1 font-bold">
                <span>📁 C:\MIDNIGHT_NURSERY\PIP\</span>
                <span className="text-[#a34063]">
                  {activeTab === 'meet-pip' && '01_MEET_PIP.TXT'}
                  {activeTab === 'crafts' && '02_CRAFTS_LAB.APP'}
                  {activeTab === 'story' && '03_BEDTIME_STORY.DOC'}
                  {activeTab === 'guestbook' && '04_GUESTBOOK.LOG'}
                </span>
              </span>
              <span className="hidden sm:inline font-pixel text-[8px] text-stone-600">SEC: COZY_LV99</span>
            </div>

            {/* Window Interior: Sidebar + Viewport */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[440px] max-h-[74vh] md:max-h-[620px]">
              <nav className="w-full md:w-56 bg-[#e4ded5] border-b-2 md:border-b-0 md:border-r-2 border-stone-400 p-2 flex md:flex-col gap-1.5 text-xs font-pixel overflow-x-auto">
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('meet-pip');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border-2 pixel-btn ${
                    activeTab === 'meet-pip'
                      ? 'bg-[#a34063] text-white border-black font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-stone-400'
                  }`}
                >
                  <FileText size={14} className={activeTab === 'meet-pip' ? 'text-pink-200' : 'text-[#a34063]'} />
                  <span className="truncate text-[9px]">01. MEET PIP</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('crafts');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border-2 pixel-btn ${
                    activeTab === 'crafts'
                      ? 'bg-[#a34063] text-white border-black font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-stone-400'
                  }`}
                >
                  <Box size={14} className={activeTab === 'crafts' ? 'text-pink-200' : 'text-amber-600'} />
                  <span className="truncate text-[9px]">02. CRAFTS / 3D</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('story');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border-2 pixel-btn ${
                    activeTab === 'story'
                      ? 'bg-[#a34063] text-white border-black font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-stone-400'
                  }`}
                >
                  <BookOpen size={14} className={activeTab === 'story' ? 'text-pink-200' : 'text-indigo-600'} />
                  <span className="truncate text-[9px]">03. STORY</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('guestbook');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border-2 pixel-btn ${
                    activeTab === 'guestbook'
                      ? 'bg-[#a34063] text-white border-black font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-stone-400'
                  }`}
                >
                  <MessageSquare size={14} className={activeTab === 'guestbook' ? 'text-pink-200' : 'text-rose-600'} />
                  <span className="truncate text-[9px]">04. GUESTBOOK</span>
                </button>

                <div className="hidden md:block mt-auto p-2 bg-[#dfd8ce] border-2 border-stone-400 text-center pixel-border">
                  <div className="font-pixel text-[8px] text-[#a34063]">haX.baby 2026</div>
                  <div className="font-silkscreen text-[9px] text-stone-600 mt-1">PIXEL EDITION</div>
                  <div className="mt-1 flex justify-center gap-1 text-xs">
                    <span>🍼</span>
                    <span>⭐</span>
                    <span>🌙</span>
                  </div>
                </div>
              </nav>

              {/* Viewport Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-white text-stone-900 border-2 border-stone-400 m-1 sm:m-2 shadow-inner">
                {/* 1. MEET PIP */}
                {activeTab === 'meet-pip' && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Interactive 3D Model of Pip, The Skull Baby */}
                    <div className="bg-[#fff8f1] p-3 border-2 border-amber-300 pixel-border">
                      <h3 className="font-pixel text-[11px] text-[#5c4033] flex items-center gap-2">
                        <span>💀</span> 3D PIP, THE SKULL BABY (INTERACTIVE CHARACTER)
                      </h3>
                      <p className="font-bubblegum text-xs text-stone-600 mt-1">
                        Cute skull baby with warm glowing amber eye lights and starlight sparkles. Hover to see Pip's curious wondering expression, click or tickle for playful giggles, or pause cursor for cute sniffling.
                      </p>
                    </div>

                    <Pip3DViewer
                      isNightMode={isNightMode}
                      onPipClick={handlePipAvatarClick}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#fff8f1] p-3.5 border-4 border-[#3a2e37] pixel-border">
                      {/* Pixel Art Pip Portrait */}
                      <div
                        onClick={handlePipAvatarClick}
                        className="cursor-pointer group relative flex flex-col items-center shrink-0"
                        title="Click Pip for whispered bedtime lore!"
                      >
                        <div className="w-24 h-24 border-4 border-[#a34063] bg-amber-50 p-1 overflow-hidden flex items-center justify-center pixel-box">
                          <img
                            src="/images/pip-waving.png"
                            alt="Pip 3D Render"
                            className="w-full h-full object-contain pixel-art group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                        <span className="mt-1 bg-[#ffd1dc] border-2 border-[#a34063] text-[8px] font-pixel px-2 py-0.5 text-[#a34063] pixel-btn">
                          CLICK ME!
                        </span>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="inline-block bg-[#a34063] text-white text-[9px] font-pixel px-2 py-0.5 mb-1.5 pixel-btn">
                          ROLE: JUNIOR DREAM ENGINEER
                        </div>
                        <h2 className="text-xl sm:text-2xl font-pixel text-[#5c4033] flex items-center justify-center sm:justify-start gap-1">
                          Pip, The Skull Baby <span>🍼</span>
                        </h2>
                        <p className="font-bubblegum text-sm text-stone-700 mt-1.5 leading-relaxed">
                          Stationed at the <strong>Midnight Nursery</strong> (Sector 7). Responsible for weaving gentle
                          lullabies, calibrating nightlight hues, and ensuring every starry kitten and toddler drifts into
                          warm, sweet dreams. Cozy, soft, and wholesome—never scary!
                        </p>
                      </div>
                    </div>

                    {/* Stats with 8-bit Progress Bars */}
                    <div className="bg-[#faf7f2] p-3.5 border-2 border-stone-300 pixel-border">
                      <h3 className="text-xs font-pixel text-[#a34063] mb-3 flex items-center gap-1.5">
                        <Zap size={14} /> DREAM ENGINEERING STATS
                      </h3>
                      <div className="space-y-2.5 text-xs">
                        <PixelStatBar label="LULLABY CRAFTING" value={95} color="#a34063" />
                        <PixelStatBar label="NIGHTLIGHT HUE CALIBRATION" value={88} color="#f59e0b" />
                        <PixelStatBar label="CLOUD FLUFFING" value={92} color="#3b82f6" />
                        <PixelStatBar label="NIGHTMARE BANISHMENT" value={99} color="#10b981" />
                        <PixelStatBar label="HOT COCOA TEMPERATURE" value={97} color="#ec4899" />
                      </div>
                    </div>

                    {/* Official Gear Loadout */}
                    <div>
                      <h3 className="text-xs font-pixel text-[#a34063] mb-2.5 flex items-center gap-1.5">
                        <Award size={14} /> CERTIFIED GEAR (8-BIT INVENTORY)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="p-2.5 bg-stone-50 border-2 border-stone-300 flex items-center gap-3 pixel-border">
                          <img
                            src="/images/moon-nightlight.jpg"
                            alt="Moon Nightlight"
                            className="w-14 h-14 object-cover pixel-art border-2 border-stone-400"
                          />
                          <div>
                            <div className="font-pixel text-[9px] text-[#5c4033]">MOON NIGHTLIGHT</div>
                            <div className="text-xs text-stone-600 font-bubblegum mt-0.5">
                              Calibrated amber glow with sleeping crescent moon relief.
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 bg-stone-50 border-2 border-stone-300 flex items-center gap-3 pixel-border">
                          <img
                            src="/images/unicorn-musicbox.jpg"
                            alt="Unicorn Music Box"
                            className="w-14 h-14 object-cover pixel-art border-2 border-stone-400"
                          />
                          <div>
                            <div className="font-pixel text-[9px] text-[#5c4033]">UNICORN MUSIC BOX</div>
                            <div className="text-xs text-stone-600 font-bubblegum mt-0.5">
                              Wind-up carousel playing 440Hz warm bedtime frequency.
                            </div>
                          </div>
                        </div>

                        <EquipmentCard
                          icon="⭐"
                          title="Starlight Nightcap"
                          desc="Enchanted with powdered comets. Grants +25 Dream Focus and cozy ear warmth."
                        />
                        <EquipmentCard
                          icon="✨"
                          title="Moon Dust Pouch"
                          desc="Hypoallergenic sleeping sparkles. 1 sprinkle = instant heavy eyelids."
                        />
                      </div>
                    </div>

                    {/* Daily Shift Table */}
                    <div className="border-2 border-stone-300 text-xs pixel-border">
                      <div className="bg-[#ede7df] px-3 py-1.5 font-pixel text-[9px] border-b-2 border-stone-300 text-stone-800">
                        📋 DAILY SHIFT SCHEDULE (MIDNIGHT NURSERY)
                      </div>
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          <tr className="border-b border-stone-200">
                            <td className="p-2.5 font-pixel text-[9px] text-[#a34063] w-28">08:00 PM</td>
                            <td className="p-2.5 font-bubblegum text-sm text-stone-700">Starch & fluff the nursery cumulus pillows.</td>
                          </tr>
                          <tr className="border-b border-stone-200 bg-stone-50">
                            <td className="p-2.5 font-pixel text-[9px] text-[#a34063]">10:30 PM</td>
                            <td className="p-2.5 font-bubblegum text-sm text-stone-700">
                              Check closet & under bed; offer tea to friendly shadows.
                            </td>
                          </tr>
                          <tr className="border-b border-stone-200">
                            <td className="p-2.5 font-pixel text-[9px] text-[#a34063]">12:00 AM</td>
                            <td className="p-2.5 font-bubblegum text-sm text-stone-700">Broadcast Sector 7 gentle lullaby radio wave.</td>
                          </tr>
                          <tr className="bg-stone-50">
                            <td className="p-2.5 font-pixel text-[9px] text-[#a34063]">06:00 AM</td>
                            <td className="p-2.5 font-bubblegum text-sm text-stone-700">Handover to morning sunbeams; bedtime nap for Pip.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. CRAFTS & PROJECTS */}
                {activeTab === 'crafts' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex border-b-2 border-stone-300 text-xs gap-1 font-pixel text-[9px] overflow-x-auto pb-1">
                      <button
                        onClick={() => {
                          playClick();
                          setCraftsSubTab('3d-pixel');
                        }}
                        className={`px-3 py-1.5 border-2 pixel-btn ${
                          craftsSubTab === '3d-pixel' ? 'bg-[#a34063] text-white border-black font-bold' : 'bg-[#ede7df] text-stone-700'
                        }`}
                      >
                        🎮 3D PIXEL REALM
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setCraftsSubTab('lullaby');
                        }}
                        className={`px-3 py-1.5 border-2 pixel-btn ${
                          craftsSubTab === 'lullaby' ? 'bg-[#a34063] text-white border-black font-bold' : 'bg-[#ede7df] text-stone-700'
                        }`}
                      >
                        🎹 LULLABY LAB
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setCraftsSubTab('nightlight');
                        }}
                        className={`px-3 py-1.5 border-2 pixel-btn ${
                          craftsSubTab === 'nightlight' ? 'bg-[#a34063] text-white border-black font-bold' : 'bg-[#ede7df] text-stone-700'
                        }`}
                      >
                        💡 3D MOON LANTERN
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setCraftsSubTab('routes');
                        }}
                        className={`px-3 py-1.5 border-2 pixel-btn ${
                          craftsSubTab === 'routes' ? 'bg-[#a34063] text-white border-black font-bold' : 'bg-[#ede7df] text-stone-700'
                        }`}
                      >
                        🗺️ FLIGHT ROUTES
                      </button>
                    </div>

                    {/* SUBTAB 1: Three.js Interactive 3D Pixel Realm */}
                    {craftsSubTab === '3d-pixel' && (
                      <div className="space-y-4">
                        <div className="bg-[#fff8f1] p-3 border-2 border-amber-300 pixel-border">
                          <h3 className="font-pixel text-[11px] text-[#5c4033] flex items-center gap-2">
                            <span>🎮</span> REAL-TIME THREE.JS PIXEL ART ENGINE
                          </h3>
                          <p className="font-bubblegum text-xs text-stone-600 mt-1">
                            Powered by <code>cloudai-x/threejs-skills</code> and Three.js <code>RenderPixelatedPass</code>!
                            Drag to rotate the 3D celestial nursery scene in real-time, or adjust the pixel resolution resolution!
                          </p>
                        </div>

                        {/* Interactive Three.js 3D Canvas */}
                        <ThreePixelEngine isNightMode={isNightMode} onPlayNote={playLullabyNote} />
                      </div>
                    )}

                    {/* SUBTAB 2: Lullaby Lab Synthesizer */}
                    {craftsSubTab === 'lullaby' && (
                      <div className="space-y-4">
                        {/* 3D Music Box (Music-Synchronized Unicorn & Winding Key) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-1">
                            <span className="font-pixel text-[10px] text-[#5c4033] flex items-center gap-1.5">
                              <span>🎠</span> 3D UNICORN LULLABY MUSIC BOX
                            </span>
                            <span className="font-mono text-[9px] text-[#a34063]">
                              [DRAG TO ROTATE 3D // WHEEL TO ZOOM]
                            </span>
                          </div>
                          <MusicBox3DViewer
                            isPlaying={isPlayingLullaby}
                            onTogglePlay={() => {
                              if (isPlayingLullaby) {
                                setIsPlayingLullaby(false);
                              } else {
                                playAutoLullaby();
                              }
                            }}
                            isNightMode={isNightMode}
                          />
                        </div>

                        <div className="p-4 bg-[#2c242b] border-4 border-[#3a2e37] shadow-md pixel-border">
                          <div className="flex items-center justify-between mb-3 text-white text-xs">
                            <span className="flex items-center gap-1.5 font-pixel text-[9px] text-pink-300">
                              <Radio size={14} className="animate-pulse" />
                              <span>440HZ NURSERY CARRIER</span>
                            </span>
                            <button
                              onClick={playAutoLullaby}
                              disabled={isPlayingLullaby}
                              className={`px-3 py-1 font-pixel text-[9px] pixel-btn ${
                                isPlayingLullaby ? 'bg-stone-600 text-stone-300' : 'bg-[#a34063] text-white hover:bg-[#be4e77]'
                              }`}
                            >
                              {isPlayingLullaby ? 'PLAYING...' : '▶ AUTO-PLAY'}
                            </button>
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            {pianoKeys.map((key) => {
                              const isActive = activePianoKey === key.label;
                              return (
                                <button
                                  key={key.label}
                                  onClick={() => {
                                    setActivePianoKey(key.label);
                                    playLullabyNote(key.freq, 0.5);
                                    // Trigger music box animation on note press
                                    setIsPlayingLullaby(true);
                                    if (window.__musicBoxNoteTimeout) clearTimeout(window.__musicBoxNoteTimeout);
                                    window.__musicBoxNoteTimeout = setTimeout(() => {
                                      setIsPlayingLullaby(false);
                                    }, 1000);
                                    setTimeout(() => setActivePianoKey(null), 300);
                                  }}
                                  className={`h-24 sm:h-28 flex flex-col justify-end items-center pb-2 transition-all pixel-btn ${
                                    isActive
                                      ? 'bg-[#ffd1dc] border-4 border-[#a34063] translate-y-1'
                                      : 'bg-white hover:bg-stone-100 border-2 border-stone-400'
                                  }`}
                                >
                                  <span className="font-pixel text-[10px] text-stone-800">{key.label}</span>
                                  <span className="text-[10px] font-silkscreen text-stone-500">{key.sub}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3 bg-black p-2 border-2 border-stone-700 flex items-center justify-center gap-1 h-8">
                            {[16, 28, 12, 34, 48, 22, 10, 38, 24, 18, 40, 14].map((h, i) => (
                              <div
                                key={i}
                                style={{
                                  height: activePianoKey ? `${Math.min(100, h * 1.6)}%` : '25%'
                                }}
                                className="w-1.5 bg-[#52e552] transition-all duration-75"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB 3: 3D Translucent Moon Lantern with Realistic Light Emission */}
                    {craftsSubTab === 'nightlight' && (
                      <div className="space-y-4">
                        <div className="bg-[#fff8f1] p-3 border-2 border-amber-300 pixel-border">
                          <h3 className="font-pixel text-[11px] text-[#5c4033] flex items-center gap-2">
                            <span>💡</span> 3D MOON LANTERN (TRANSLUCENT & LIGHT EMITTING)
                          </h3>
                          <p className="font-bubblegum text-xs text-stone-600 mt-1">
                            The official Midnight Nursery Moon Lantern! First appearing almost invisible, it shrinks and emerges up out of the display box, glowing with translucent radiance and emitting realistic warm light. Free to rotate in 360°!
                          </p>
                        </div>

                        {/* Interactive 3D Lantern Viewer with Emergence Sequence & Realistic Light Emission */}
                        <Lantern3DViewer
                          isNightMode={isNightMode}
                          currentColor={nightlightColor}
                          luminescence={nightlightGlow}
                          onColorChange={(color, lum) => {
                            setNightlightColor(color);
                            if (lum !== undefined) setNightlightGlow(lum);
                          }}
                        />

                        {/* Official Nursery Lantern & Nightlight Gear Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 bg-[#ede7df] border-2 border-stone-300 pixel-border flex items-center gap-3">
                            <div className="w-16 h-16 bg-amber-50 p-1 border-2 border-[#a34063] shrink-0 pixel-box">
                              <img
                                src="/images/pip-lantern.png"
                                alt="Pip with Lantern"
                                className="w-full h-full object-contain pixel-art"
                              />
                            </div>
                            <div className="text-xs">
                              <div className="font-pixel text-[9px] text-[#a34063]">PIP'S STARLIGHT LANTERN</div>
                              <div className="font-bubblegum text-stone-700 text-xs mt-0.5">
                                Crafted from forged moon-brass and enchanted stardust. Radiates comforting dreams.
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-[#ede7df] border-2 border-stone-300 pixel-border flex items-center gap-3">
                            <div className="w-16 h-16 bg-black/80 p-1 border-2 border-amber-400 shrink-0 pixel-box">
                              <img
                                src="/images/moon-nightlight.jpg"
                                alt="Moon Nightlight Reference"
                                className="w-full h-full object-cover pixel-art"
                              />
                            </div>
                            <div className="text-xs">
                              <div className="font-pixel text-[9px] text-[#5c4033]">CRESCENT RELIEF GEL</div>
                              <div className="font-bubblegum text-stone-700 text-xs mt-0.5">
                                Translucent optical filter tuned to {nightlightColor}. Banish bedtime monsters instantly.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB 4: Dream Routes */}
                    {craftsSubTab === 'routes' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <PixelRouteCard
                            title="SEC 7: STARFIELD"
                            cargo="1,200 Blankets"
                            status="ON TIME"
                            statusColor="text-emerald-400"
                            weather="Clear Stardust"
                            isSelected={activeRouteId === 'route-1'}
                            onClick={() => {
                              playClick();
                              setActiveRouteId('route-1');
                            }}
                          />
                          <PixelRouteCard
                            title="SEC 12: PINES"
                            cargo="850 Cassettes"
                            status="IN FLIGHT"
                            statusColor="text-amber-400"
                            weather="Cloud Mist"
                            isSelected={activeRouteId === 'route-2'}
                            onClick={() => {
                              playClick();
                              setActiveRouteId('route-2');
                            }}
                          />
                          <PixelRouteCard
                            title="SEC 03: CORAL SEA"
                            cargo="2,400 Whale Songs"
                            status="DOCKING"
                            statusColor="text-blue-400"
                            weather="Calm Waters"
                            isSelected={activeRouteId === 'route-3'}
                            onClick={() => {
                              playClick();
                              setActiveRouteId('route-3');
                            }}
                          />
                        </div>

                        <div className="p-3 bg-stone-100 border-2 border-stone-300 flex items-center justify-between pixel-border">
                          <div className="text-xs font-pixel text-[9px] text-stone-700">
                            ROUTE: <strong>{activeRouteId.toUpperCase()}</strong>
                            {cloudDispatched && (
                              <span className="ml-2 text-emerald-600 font-bold">
                                ✨ DREAM CLOUD DISPATCHED!
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              playMagic();
                              setCloudDispatched(true);
                              setTimeout(() => setCloudDispatched(false), 3000);
                            }}
                            className="px-3 py-1.5 bg-[#a34063] text-white text-[9px] font-pixel pixel-btn"
                          >
                            DISPATCH CLOUD ☁️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. BEDTIME STORY */}
                {activeTab === 'story' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-[#fff8f1] p-3 border-2 border-amber-200 flex justify-between items-center pixel-border">
                      <div>
                        <h3 className="font-pixel text-[11px] text-[#5c4033] flex items-center gap-2">
                          <span>📖</span> THE QUEST FOR THE LOST SLEEPY SHEEP
                        </h3>
                        <p className="font-bubblegum text-xs text-stone-600 mt-0.5">
                          An interactive branching bedtime story written by Junior Dream Engineer Pip.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          playClick();
                          setStoryNode(0);
                        }}
                        className="px-2 py-1 bg-[#ede7df] hover:bg-white text-stone-700 text-[9px] font-pixel border-2 border-stone-400 flex items-center gap-1 pixel-btn"
                      >
                        <RotateCcw size={11} /> RESTART
                      </button>
                    </div>

                    <div className="p-5 bg-[#faf7f2] border-4 border-[#3a2e37] shadow-sm space-y-4 pixel-border">
                      <div className="flex items-center justify-between border-b-2 border-stone-300 pb-2">
                        <span className="font-pixel text-xs text-[#a34063]">
                          {storyNodes[storyNode].title}
                        </span>
                        <span className="text-[8px] bg-[#ffd1dc] text-[#a34063] px-2 py-0.5 font-pixel">
                          PAGE {storyNode + 1}/5
                        </span>
                      </div>

                      <p className="text-base leading-relaxed text-stone-800 font-bubblegum">
                        {storyNodes[storyNode].text}
                      </p>

                      <div className="pt-2">
                        {storyNodes[storyNode].ending ? (
                          <div className="p-3 bg-amber-50 border-2 border-amber-300 text-center space-y-2 pixel-border">
                            <p className="text-sm font-bubblegum text-amber-800">
                              🎉 You have concluded tonight&apos;s bedtime adventure!
                            </p>
                            <button
                              onClick={() => {
                                playChime();
                                setStoryNode(0);
                              }}
                              className="px-4 py-2 bg-[#a34063] text-white text-[9px] font-pixel pixel-btn"
                            >
                              READ ANOTHER PATH 🔄
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-[9px] font-pixel text-stone-500 uppercase tracking-wider block">
                              WHAT SHOULD PIP DO NEXT?
                            </span>
                            {storyNodes[storyNode].choices.map((choice, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  playChime();
                                  setStoryNode(choice.next);
                                }}
                                className="w-full text-left p-3 text-xs bg-white hover:bg-[#fff0f4] border-2 border-stone-300 hover:border-[#a34063] flex items-center justify-between group pixel-btn"
                              >
                                <span className="text-stone-800 font-bubblegum text-sm group-hover:text-[#a34063]">
                                  👉 {choice.label}
                                </span>
                                <ChevronRight size={14} className="text-stone-400 group-hover:text-[#a34063]" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. GUESTBOOK */}
                {activeTab === 'guestbook' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-[#fff8f1] p-3 border-2 border-amber-200 pixel-border">
                      <h3 className="font-pixel text-[11px] text-[#5c4033] flex items-center gap-2">
                        <span>✍️</span> THE MIDNIGHT NURSERY WALL (GUESTBOOK)
                      </h3>
                      <p className="font-bubblegum text-xs text-stone-600 mt-0.5">
                        Leave your bedtime wish, stamp your slumber sigil, and sign the official guestbook.
                      </p>
                    </div>

                    <form
                      onSubmit={handleAddGuestbook}
                      className="p-3 bg-[#ede7df] border-2 border-stone-400 space-y-2.5 text-xs font-silkscreen pixel-border"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block mb-1 font-pixel text-[8px] text-stone-800">DREAMER NAME:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sleepy Star-Gazer"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-2 py-1 bg-white border-2 border-stone-400 text-stone-800 font-bubblegum text-sm"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-pixel text-[8px] text-stone-800">SIGIL:</label>
                          <select
                            value={guestSigil}
                            onChange={(e) => setGuestSigil(e.target.value)}
                            className="w-full px-2 py-1 bg-white border-2 border-stone-400 text-stone-800 font-bubblegum text-sm"
                          >
                            <option value="⭐">⭐ Star</option>
                            <option value="🌙">🌙 Moon</option>
                            <option value="🐑">🐑 Sheep</option>
                            <option value="💤">💤 Zzz</option>
                            <option value="🧸">🧸 Teddy</option>
                            <option value="🍼">🍼 Milk</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 font-pixel text-[8px] text-stone-800">BEDTIME WISH:</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="e.g. Wishing for warm socks, sweet dreams, and no alarm clocks tomorrow..."
                          value={guestWish}
                          onChange={(e) => setGuestWish(e.target.value)}
                          className="w-full px-2 py-1 bg-white border-2 border-stone-400 text-stone-800 font-bubblegum text-sm"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#a34063] text-white font-pixel text-[9px] pixel-btn"
                        >
                          <Send size={12} className="inline mr-1" /> SIGN WALL
                        </button>
                      </div>
                    </form>

                    <div className="space-y-2">
                      <h4 className="text-[9px] font-pixel text-stone-600 uppercase tracking-wider">
                        RECENT WALL SIGNATURES:
                      </h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {guestbookEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="p-2.5 bg-[#faf7f2] border-2 border-stone-300 text-xs pixel-border"
                          >
                            <div className="flex items-center justify-between text-stone-500 mb-1">
                              <span className="text-[#5c4033] flex items-center gap-1 font-pixel text-[9px]">
                                <span>{entry.sigil}</span> {entry.name}
                              </span>
                              <span className="text-[8px] font-pixel text-stone-400">{entry.date}</span>
                            </div>
                            <p className="text-stone-700 italic font-bubblegum text-sm">“{entry.message}”</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Window Status Bar */}
            <div className="bg-[#dfd7ce] px-3 py-1.5 text-[9px] border-t-2 border-stone-400 flex items-center justify-between text-stone-600 font-pixel">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 inline-block animate-pulse"></span>
                <span>STATUS: PIP_ENGINE_PIXELATED</span>
              </span>
              <span>MEM: 48K/64K</span>
            </div>
          </div>
        )}

        {/* RECYCLE BIN MODAL */}
        {recycleBinOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm bg-[#ece5dc] border-4 border-[#3a2e37] shadow-2xl p-1 text-xs pixel-border">
              <div className="bg-[#a34063] text-white px-3 py-1.5 flex justify-between items-center font-pixel text-[10px]">
                <span className="flex items-center gap-1">
                  <Trash2 size={13} /> RECYCLE BIN
                </span>
                <button
                  onClick={() => setRecycleBinOpen(false)}
                  className="bg-[#dfd7ce] text-black w-4 h-4 flex items-center justify-center font-bold text-[9px] pixel-btn"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3 bg-white text-stone-800 m-1 border-2 border-stone-400">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🗑️</span>
                  <div>
                    <h4 className="font-pixel text-[10px] text-[#5c4033]">0 DISCARDED DREAMS</h4>
                    <p className="text-xs text-stone-600 font-bubblegum mt-0.5">
                      In the Midnight Nursery, every single dream is precious and never deleted!
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-stone-50 p-2 border-2 border-stone-200 space-y-1 font-bubblegum">
                  <div className="font-pixel text-[8px] text-stone-500">CURRENT BIN CONTENTS:</div>
                  <div>• 3x Empty mugs of warm honey tea</div>
                  <div>• 2x Tangled cloud strings</div>
                  <div>• 1x Cold hot-water bottle</div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleEmptyRecycleBin}
                    className="px-3 py-1.5 bg-[#a34063] text-white font-pixel text-[8px] pixel-btn"
                  >
                    ✨ STARDUST CLEAR
                  </button>
                  <button
                    onClick={() => setRecycleBinOpen(false)}
                    className="px-3 py-1.5 bg-[#dfd7ce] text-black font-pixel text-[8px] pixel-btn"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          4. BOTTOM TASKBAR (Fixed Bottom)
          ========================================================================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 h-10 bg-[#dfd7ce] border-t-2 border-t-white border-b-black px-2 flex items-center justify-between text-xs select-none shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
        <div className="relative start-menu-container flex items-center gap-2">
          {/* Start Dreams Button */}
          <button
            onClick={() => {
              playClick(700);
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 font-pixel text-[10px] border-2 transition-all pixel-btn ${
              isStartMenuOpen ? 'bg-[#c5b9aa] text-[#a34063]' : 'bg-[#ede7df] text-[#5c4033]'
            }`}
          >
            <span className="text-sm">💤</span>
            <span>START DREAMS</span>
          </button>

          {isWindowOpen && (
            <button
              onClick={() => {
                playClick();
                setIsMinimized(!isMinimized);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-[9px] font-pixel border-2 max-w-[200px] sm:max-w-xs truncate pixel-btn ${
                !isMinimized ? 'bg-[#c5b9aa] text-[#a34063] font-bold' : 'bg-[#ede7df] text-stone-700'
              }`}
            >
              <FileText size={13} className="shrink-0" />
              <span className="truncate">PIP_PORTFOLIO.EXE</span>
            </button>
          )}

          {/* 90s Start Menu */}
          {isStartMenuOpen && (
            <div className="absolute bottom-10 left-0 w-64 bg-[#dfd7ce] border-4 border-[#3a2e37] shadow-2xl flex z-50 text-xs font-pixel text-[9px] pixel-border">
              <div className="w-10 bg-[#a34063] text-white flex flex-col justify-end items-center pb-3 font-pixel tracking-widest text-[10px]">
                <span className="rotate-180 transform [writing-mode:vertical-rl]">
                  PIP-OS v1.0
                </span>
              </div>

              <div className="flex-1 py-1.5 text-stone-800 space-y-0.5">
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('meet-pip');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <FileText size={14} className="text-[#a34063]" />
                  <span>01. MEET PIP</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('crafts');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <Box size={14} className="text-amber-600" />
                  <span>02. 3D PIXEL REALM</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('story');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <BookOpen size={14} className="text-indigo-600" />
                  <span>03. BEDTIME STORY</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('guestbook');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <MessageSquare size={14} className="text-rose-600" />
                  <span>04. GUESTBOOK</span>
                </button>

                <div className="my-1 border-t-2 border-stone-400" />

                <button
                  onClick={() => {
                    handleToggleTheme();
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  {isNightMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                  <span>SWITCH DAY/NIGHT</span>
                </button>

                <button
                  onClick={() => {
                    playMagic();
                    setRecycleBinOpen(true);
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <Trash2 size={14} className="text-stone-500" />
                  <span>RECYCLE BIN</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 6-Digit Vintage Odometer Hit Counter */}
        <div className="flex items-center gap-2 font-pixel">
          <span className="hidden sm:inline text-[8px] text-stone-600">VISITORS:</span>
          <div
            onClick={() => {
              playClick(1000);
              setHitCount((prev) => prev + 1);
            }}
            title="Vintage Hit Counter - Click to increment!"
            className="flex bg-black px-2 py-1 border-2 border-stone-600 shadow-inner rounded-none cursor-pointer hover:border-amber-400"
          >
            {String(hitCount)
              .padStart(6, '0')
              .split('')
              .map((digit, idx) => (
                <span
                  key={idx}
                  className="inline-block w-3 text-center font-bold text-[10px] text-[#52e552] border-r border-stone-800 last:border-r-0"
                  style={{ textShadow: '0 0 5px rgba(82, 229, 82, 0.9)' }}
                >
                  {digit}
                </span>
              ))}
          </div>
        </div>
      </footer>
    </>
  )}
</div>
  );
}

// =========================================================================
// SUB-COMPONENTS & PIXEL HELPERS
// =========================================================================

/**
 * Pixel Art Contrast Skull Watermark (stepped 8-bit vector silhouette)
 */
function PixelContrastSkullWatermark({ isTargetNight }) {
  const mainColor = isTargetNight ? '#fffdf7' : '#1e1a29';
  const strokeColor = isTargetNight ? '#f9d77e' : '#a34063';
  const eyeSocket = isTargetNight ? '#1e1a29' : '#fff8f1';
  const capColor = isTargetNight ? '#a34063' : '#5c4033';

  return (
    <svg
      width="240"
      height="240"
      viewBox="0 0 32 32"
      className="pixel-art drop-shadow-[0_0_30px_rgba(249,215,126,0.6)]"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 8-bit Pixel Grid Stepped Skull Head */}
      {/* Skull Base Outline */}
      <rect x="8" y="8" width="16" height="16" fill={strokeColor} />
      <rect x="9" y="9" width="14" height="14" fill={mainColor} />
      
      {/* Jaw */}
      <rect x="11" y="24" width="10" height="4" fill={strokeColor} />
      <rect x="12" y="24" width="8" height="3" fill={mainColor} />

      {/* Stepped Ear indentations */}
      <rect x="7" y="11" width="1" height="10" fill={strokeColor} />
      <rect x="24" y="11" width="1" height="10" fill={strokeColor} />

      {/* Eye Sockets */}
      <rect x="10" y="14" width="4" height="4" fill={eyeSocket} />
      <rect x="18" y="14" width="4" height="4" fill={eyeSocket} />

      {/* Glowing Warm Amber Pixels */}
      <rect x="11" y="15" width="2" height="2" fill="#f59e0b" />
      <rect x="19" y="15" width="2" height="2" fill="#f59e0b" />

      {/* Nose pixel */}
      <rect x="15" y="19" width="2" height="1" fill={strokeColor} />

      {/* Stitched smile */}
      <rect x="12" y="22" width="8" height="1" fill={strokeColor} />
      <rect x="13" y="21" width="1" height="3" fill={strokeColor} />
      <rect x="16" y="21" width="1" height="3" fill={strokeColor} />
      <rect x="18" y="21" width="1" height="3" fill={strokeColor} />

      {/* Slouching Nightcap */}
      <rect x="7" y="5" width="18" height="4" fill="#ffd1dc" />
      <rect x="9" y="2" width="14" height="4" fill={capColor} />
      <rect x="22" y="5" width="6" height="8" fill={capColor} />
      <rect x="26" y="12" width="4" height="4" fill="#ffffff" />

      {/* Stars on cap */}
      <rect x="12" y="3" width="2" height="2" fill="#f9d77e" />
      <rect x="18" y="3" width="2" height="2" fill="#f9d77e" />
    </svg>
  );
}

function DesktopPixelIcon({
  icon,
  label,
  isSelected,
  isNightMode,
  isDragging,
  onPointerDown,
  onClick,
  onDoubleClick,
  style
}) {
  return (
    <div
      style={style}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`absolute flex flex-col items-center justify-start p-1.5 cursor-grab active:cursor-grabbing w-28 text-center select-none transition-shadow ${
        isDragging ? 'z-30 opacity-90 scale-105' : 'z-10'
      } ${
        isSelected
          ? 'bg-[#a34063]/25 border-2 border-dotted border-[#ffd1dc] shadow-md'
          : 'hover:bg-white/15 border-2 border-transparent'
      }`}
    >
      <div className="p-1 drop-shadow-[2px_2px_0px_#000] flex items-center justify-center pointer-events-none">
        {icon}
      </div>
      <div className="w-full mt-1 flex justify-center overflow-hidden px-0.5 pointer-events-none">
        <span
          className={`font-silkscreen text-[9px] leading-tight break-words max-w-full px-1.5 py-0.5 rounded-none text-center ${
            isSelected
              ? 'bg-[#a34063] text-white shadow-sm'
              : isNightMode
              ? 'text-stone-200 drop-shadow-[1px_1px_0px_#000]'
              : 'text-stone-800 drop-shadow-[1px_1px_0px_#fff]'
          }`}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function PixelStatBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] mb-1 font-pixel text-stone-700">
        <span>{label}</span>
        <span className="font-pixel text-[#a34063]">{value}%</span>
      </div>
      <div className="h-4 bg-stone-200 border-2 border-stone-500 p-[1px] pixel-box">
        <div
          style={{ width: `${value}%`, backgroundColor: color }}
          className="h-full transition-all duration-700"
        />
      </div>
    </div>
  );
}

function EquipmentCard({ icon, title, desc }) {
  return (
    <div className="p-2.5 bg-stone-50 border-2 border-stone-300 flex items-start gap-2.5 pixel-border">
      <span className="text-xl shrink-0 p-1 bg-white border-2 border-stone-300 pixel-box">{icon}</span>
      <div>
        <div className="font-pixel text-[9px] text-[#5c4033]">{title}</div>
        <div className="text-xs text-stone-600 leading-snug font-bubblegum mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function PixelRouteCard({ title, cargo, status, statusColor, weather, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 border-2 cursor-pointer transition-all pixel-border ${
        isSelected ? 'bg-[#fff0f5] border-[#a34063]' : 'bg-white hover:bg-stone-50 border-stone-300'
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-pixel text-[9px] text-stone-800">{title}</span>
        <span className={`text-[8px] font-pixel ${statusColor}`}>{status}</span>
      </div>
      <div className="text-[10px] text-stone-600 space-y-0.5 font-silkscreen">
        <div>📦 {cargo}</div>
        <div>☁️ {weather}</div>
      </div>
    </div>
  );
}
