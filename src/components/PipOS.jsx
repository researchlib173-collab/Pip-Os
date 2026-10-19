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
  Eye,
  Sliders
} from 'lucide-react';

/**
 * Pip-OS v1.0 - Desktop Operating System Portfolio
 * Created for the haX.baby "Baby's First Website" Hackathon
 * Character: Pip, The Skull Baby (Junior Dream Engineer at Midnight Nursery)
 * 
 * Features:
 * - Real-time Mode Transition Skull Watermark in contrasting target color
 * - Integration of official Hackathon 3D assets (Pip, Unicorn Music Box, Moon Nightlight)
 * - Custom typography: SpookyTheme, Bubblegum, RetroPumkin, Lonewarc
 * - Native Web Audio API synthesis
 */

export default function PipOS() {
  // ==========================================
  // SYSTEM STATE
  // ==========================================
  const [isNightMode, setIsNightMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [hitCount, setHitCount] = useState(1248);

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

  // Draggable Window Coordinates
  const [windowPos, setWindowPos] = useState({ x: 120, y: 56 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Popups & Dropdowns
  const [activeMenu, setActiveMenu] = useState(null); // 'apple' | 'file' | 'view' | 'routes' | 'help'
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);
  const [pipSpeech, setPipSpeech] = useState(null);

  // Crafts & Projects State
  const [craftsSubTab, setCraftsSubTab] = useState('lullaby'); // 'lullaby' | 'nightlight' | 'routes'
  const [activePianoKey, setActivePianoKey] = useState(null);
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [nightlightColor, setNightlightColor] = useState('#fbbf24'); // warm amber default
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

  // Vintage mechanical click
  const playClick = useCallback((freq = 750, type = 'sine') => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }, [isMuted, getAudioContext]);

  // Dreamy celestial chime
  const playChime = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0, ctx.currentTime);
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

  // Single musical note for Lullaby Keyboard
  const playLullabyNote = useCallback((freq, duration = 0.5) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      harmonic.start();
      osc.stop(ctx.currentTime + duration);
      harmonic.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }, [isMuted, getAudioContext]);

  // Magic stardust chime
  const playMagic = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.05);
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

  // Transition Theme with Watermark
  const handleToggleTheme = () => {
    if (isModeTransitioning) return;
    playMagic();
    const target = !isNightMode;
    setNextMode(target);
    setIsModeTransitioning(true);
    setTransitionPhase('in');

    // Midway: switch background theme
    setTimeout(() => {
      setIsNightMode(target);
    }, 450);

    // Fade out watermark
    setTimeout(() => {
      setTransitionPhase('out');
    }, 850);

    // End transition
    setTimeout(() => {
      setIsModeTransitioning(false);
    }, 1200);
  };

  // ==========================================
  // DIGITAL CLOCK & LIFECYCLE
  // ==========================================
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

  // Dragging Window Logic
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

  // Auto-play lullaby melody sequence
  const playAutoLullaby = () => {
    if (isPlayingLullaby) return;
    setIsPlayingLullaby(true);
    playClick();

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
      showToast('🎶 Twinkle Lullaby transmission complete!');
    }, 3250);
  };

  const pianoKeys = [
    { label: 'C5', freq: 523.25, sub: 'Do' },
    { label: 'D5', freq: 587.33, sub: 'Re' },
    { label: 'E5', freq: 659.25, sub: 'Mi' },
    { label: 'G5', freq: 783.99, sub: 'Sol' },
    { label: 'A5', freq: 880.00, sub: 'La' },
    { label: 'C6', freq: 1046.50, sub: 'High Do' }
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
    showToast('✨ Your bedtime wish was stamped onto the Nursery Wall!');
  };

  const handleEmptyRecycleBin = () => {
    playMagic();
    setRecycleBinOpen(false);
    showToast('✨ 0 dreams lost! All dreams are kept safe forever.');
  };

  const handleOpenDesktopIcon = (tabName) => {
    playChime();
    setIsWindowOpen(true);
    setIsMinimized(false);
    setActiveTab(tabName);
  };

  const handleSwitchCraft = (subtab) => {
    playClick();
    setCraftsSubTab(subtab);
  };

  const bgStyle = isNightMode
    ? 'bg-[#1e1a29] text-[#e8e2e9]'
    : 'bg-[#fff8f1] text-[#3d2e37]';

  return (
    <div
      className={`relative w-full min-h-screen select-none overflow-hidden transition-colors duration-700 ${bgStyle}`}
      style={{
        backgroundImage: isNightMode
          ? 'radial-gradient(#3a324f 1.2px, transparent 1.2px), radial-gradient(#2a223a 1.2px, #1e1a29 1.2px)'
          : 'radial-gradient(#e5d8cb 1px, transparent 1px)',
        backgroundSize: isNightMode ? '32px 32px, 16px 16px' : '20px 20px'
      }}
    >
      {/* =========================================================================
          WATERMARK SKULL OVERLAY (VISIBLE ONLY DURING MODE SWITCHING)
          In high contrast color of the target mode being switched to!
          ========================================================================= */}
      {isModeTransitioning && (
        <div
          className={`fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center transition-all duration-500 ease-out backdrop-blur-[2px] ${
            transitionPhase === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            backgroundColor: nextMode
              ? 'rgba(30, 26, 41, 0.45)' // incoming night backdrop veil
              : 'rgba(255, 248, 241, 0.45)' // incoming day backdrop veil
          }}
        >
          {/* Ambient contrast radial halo */}
          <div
            className="absolute w-[440px] h-[440px] rounded-full blur-3xl transition-all duration-700"
            style={{
              backgroundColor: nextMode
                ? 'rgba(249, 215, 126, 0.28)' // warm amber halo against dark
                : 'rgba(163, 64, 99, 0.22)'   // rich berry halo against light
            }}
          />

          {/* Large High-Contrast Skull Watermark */}
          <div className="relative z-10 flex flex-col items-center animate-pulse">
            <ModeSwitchingSkullWatermark isTargetNight={nextMode} />

            {/* Contrast Indicator Badge */}
            <div
              className="mt-4 px-4 py-1.5 rounded-full border-2 text-xs font-spooky tracking-widest uppercase shadow-2xl transition-all duration-500"
              style={{
                color: nextMode ? '#f9d77e' : '#ffffff',
                borderColor: nextMode ? '#f9d77e' : '#a34063',
                backgroundColor: nextMode ? '#1e1a29' : '#a34063',
                boxShadow: nextMode
                  ? '0 0 25px rgba(249, 215, 126, 0.6)'
                  : '0 0 25px rgba(163, 64, 99, 0.5)'
              }}
            >
              {nextMode ? '🌙 Slipping into Slumber Night Mode... ✨' : '☀️ Awakening to Warm Cream Day Mode... ☁️'}
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
                playClick();
                setActiveMenu(activeMenu === 'apple' ? null : 'apple');
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 transition-all ${
                activeMenu === 'apple'
                  ? 'bg-[#a34063] text-white shadow-[inset_1px_1px_0px_#000]'
                  : 'hover:bg-[#cbbeaf]'
              }`}
            >
              <span>🍎</span>
              <span className="font-spooky text-base tracking-wider text-[#a34063] drop-shadow-sm">Pip-OS</span>
              <span className="text-[10px] text-[#a34063] font-lonewarc font-bold bg-[#ffd1dc] px-1 rounded-sm">v1.0</span>
            </button>

            {activeMenu === 'apple' && (
              <div className="absolute top-7 left-0 w-52 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl py-1 z-50 font-pumkin text-[12px]">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    handlePipAvatarClick();
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span className="font-spooky text-sm">About Pip-OS v1.0</span>
                  <Sparkles size={12} />
                </button>
                <div className="my-1 border-t border-t-stone-400 border-b border-b-white" />
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('🌙 Midnight Nursery OS - 64 KB RAM Allocated');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white font-pumkin"
                >
                  Nursery Telemetry
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('⭐ haX.baby Hackathon Entry');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white font-pumkin"
                >
                  Hackathon Credits
                </button>
                <div className="my-1 border-t border-t-stone-400 border-b border-b-white" />
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('💤 Tucking Pip into bed... Sweet dreams!');
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white font-spooky text-sm text-[#a34063]"
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
              className={`px-2 py-0.5 font-pumkin text-xs transition-all ${
                activeMenu === 'file' ? 'bg-[#a34063] text-white' : 'hover:bg-[#cbbeaf]'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute top-7 left-0 w-48 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl py-1 z-50 font-pumkin text-[12px]">
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
                <div className="my-1 border-t border-t-stone-400 border-b border-b-white" />
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
              className={`px-2 py-0.5 font-pumkin text-xs transition-all ${
                activeMenu === 'view' ? 'bg-[#a34063] text-white' : 'hover:bg-[#cbbeaf]'
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute top-7 left-0 w-52 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl py-1 z-50 font-pumkin text-[12px]">
                <button
                  onClick={() => {
                    handleToggleTheme();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span>Toggle Dream Mode</span>
                  <span className="font-bubblegum">{isNightMode ? '🌙 Night' : '☀️ Day'}</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setIsMuted(!isMuted);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#a34063] hover:text-white flex items-center justify-between"
                >
                  <span>Audio Feedback</span>
                  <span className="font-lonewarc text-[10px]">{isMuted ? 'MUTED' : 'ON'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Dream Routes Menu */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                playClick();
                setActiveMenu(activeMenu === 'routes' ? null : 'routes');
              }}
              className={`px-2 py-0.5 font-pumkin text-xs transition-all ${
                activeMenu === 'routes' ? 'bg-[#a34063] text-white' : 'hover:bg-[#cbbeaf]'
              }`}
            >
              Dream Routes
            </button>
            {activeMenu === 'routes' && (
              <div className="absolute top-7 left-0 w-60 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl py-1 z-50 font-pumkin text-[12px]">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    setIsWindowOpen(true);
                    setActiveTab('crafts');
                    setCraftsSubTab('routes');
                    setActiveRouteId('route-1');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white"
                >
                  ⭐ Route 1: Starfield Cribs
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    setIsWindowOpen(true);
                    setActiveTab('crafts');
                    setCraftsSubTab('routes');
                    setActiveRouteId('route-2');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white"
                >
                  ☁️ Route 2: Whispering Pines
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    setIsWindowOpen(true);
                    setActiveTab('crafts');
                    setCraftsSubTab('routes');
                    setActiveRouteId('route-3');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white"
                >
                  🌊 Route 3: Oceanic White Noise
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
              className={`px-2 py-0.5 font-pumkin text-xs transition-all ${
                activeMenu === 'help' ? 'bg-[#a34063] text-white' : 'hover:bg-[#cbbeaf]'
              }`}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="absolute top-7 left-0 w-56 bg-[#dfd7ce] border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl py-1 z-50 font-pumkin text-[12px]">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMenu(null);
                    showToast('💡 Tip: Double click Pip or the Recycle Bin for cozy secrets!');
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
        </div>

        {/* Right Status Tray */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextState = !isMuted;
              setIsMuted(nextState);
              if (!nextState) playClick(900);
            }}
            title={isMuted ? 'Sound Muted - Click to Unmute' : 'Sound Active - Click to Mute'}
            className="p-1 hover:bg-[#cbbeaf] rounded transition-all active:translate-y-0.5"
          >
            {isMuted ? <VolumeX size={15} className="text-red-700" /> : <Volume2 size={15} className="text-[#a34063]" />}
          </button>

          {/* Day / Night Dream Mode Toggle triggering the contrast watermark */}
          <button
            onClick={handleToggleTheme}
            title={isNightMode ? 'Switch to Warm Cream Day Mode' : 'Switch to Cozy Night Slate Mode'}
            className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-pumkin bg-[#efe9e2] border border-stone-400 hover:bg-[#fff] active:translate-y-0.5"
          >
            {isNightMode ? (
              <>
                <Moon size={12} className="text-indigo-400 fill-indigo-400" />
                <span className="hidden sm:inline">Night Mode</span>
              </>
            ) : (
              <>
                <Sun size={12} className="text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">Day Mode</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1 font-lonewarc text-xs font-bold bg-white/70 px-2 py-0.5 border border-stone-400 shadow-inner tracking-wider">
            <Clock size={11} className="text-[#a34063]" />
            <span>{currentTime || '12:00:00 AM'}</span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-[#a34063] text-white px-4 py-2 border-2 border-white shadow-2xl text-xs rounded-sm animate-bounce flex items-center gap-2 font-bubblegum">
          <Sparkles size={14} className="text-[#f9d77e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pip Whispered Secret Bubble */}
      {pipSpeech && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 bg-[#fffdf8] text-[#5c4033] p-3 border-2 border-stone-800 shadow-[4px_4px_0px_#a34063] text-sm rounded animate-in fade-in">
          <div className="flex justify-between items-start mb-1">
            <span className="font-spooky text-base text-[#a34063] flex items-center gap-1">
              <span>💀</span> Pip Whispers:
            </span>
            <button onClick={() => setPipSpeech(null)} className="text-stone-500 hover:text-black font-bold">
              ✕
            </button>
          </div>
          <p className="font-bubblegum text-sm italic leading-relaxed text-[#5c4033]">{pipSpeech}</p>
        </div>
      )}

      {/* =========================================================================
          2. DESKTOP GRID SHORTCUTS (ICONS)
          ========================================================================= */}
      <main className="pt-12 pb-16 px-4 md:px-6 min-h-screen relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-flow-col md:grid-rows-7 gap-3 w-fit select-none z-10 relative">
          <DesktopIconItem
            icon={<FileText className="text-[#a34063]" size={28} />}
            label="About Pip.txt"
            isSelected={selectedDesktopIcon === 'about'}
            onClick={() => {
              playClick(800);
              setSelectedDesktopIcon('about');
            }}
            onDoubleClick={() => handleOpenDesktopIcon('meet-pip')}
            isNightMode={isNightMode}
          />
          <DesktopIconItem
            icon={<Music className="text-amber-500" size={28} />}
            label="Lullaby Lab.app"
            isSelected={selectedDesktopIcon === 'lullaby'}
            onClick={() => {
              playClick(800);
              setSelectedDesktopIcon('lullaby');
            }}
            onDoubleClick={() => {
              handleOpenDesktopIcon('crafts');
              setCraftsSubTab('lullaby');
            }}
            isNightMode={isNightMode}
          />
          <DesktopIconItem
            icon={<Folder className="text-amber-400 fill-amber-400/40" size={28} />}
            label="Nightlights.dir"
            isSelected={selectedDesktopIcon === 'nightlights'}
            onClick={() => {
              playClick(800);
              setSelectedDesktopIcon('nightlights');
            }}
            onDoubleClick={() => {
              handleOpenDesktopIcon('crafts');
              setCraftsSubTab('nightlight');
            }}
            isNightMode={isNightMode}
          />
          <DesktopIconItem
            icon={<MapPin className="text-emerald-500" size={28} />}
            label="Dream Delivery.map"
            isSelected={selectedDesktopIcon === 'delivery'}
            onClick={() => {
              playClick(800);
              setSelectedDesktopIcon('delivery');
            }}
            onDoubleClick={() => {
              handleOpenDesktopIcon('crafts');
              setCraftsSubTab('routes');
            }}
            isNightMode={isNightMode}
          />
          <DesktopIconItem
            icon={<BookOpen className="text-indigo-400" size={28} />}
            label="Bedtime Story.doc"
            isSelected={selectedDesktopIcon === 'story'}
            onClick={() => {
              playClick(800);
              setSelectedDesktopIcon('story');
            }}
            onDoubleClick={() => handleOpenDesktopIcon('story')}
            isNightMode={isNightMode}
          />
          <DesktopIconItem
            icon={<MessageSquare className="text-rose-400" size={28} />}
            label="Guestbook.exe"
            isSelected={selectedDesktopIcon === 'guestbook'}
            onClick={() => {
              playClick(800);
              setSelectedDesktopIcon('guestbook');
            }}
            onDoubleClick={() => handleOpenDesktopIcon('guestbook')}
            isNightMode={isNightMode}
          />
          <DesktopIconItem
            icon={<Trash2 className="text-stone-400" size={28} />}
            label="Recycle Bin"
            isSelected={selectedDesktopIcon === 'recycle'}
            onClick={() => {
              playClick(650);
              setSelectedDesktopIcon('recycle');
            }}
            onDoubleClick={() => {
              playMagic();
              setRecycleBinOpen(true);
            }}
            isNightMode={isNightMode}
          />
        </div>

        {/* =========================================================================
            3. MAIN OS WINDOW FRAME (Draggable / Stackable)
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
                : 'absolute w-[94vw] sm:w-[660px] md:w-[780px] max-w-[880px] shadow-[6px_6px_0px_#00000088]'
            } bg-[#ece5dc] border-2 border-t-white border-l-white border-r-[#403b38] border-b-[#403b38] flex flex-col`}
          >
            {/* Titlebar */}
            <div
              onMouseDown={handleMouseDownHeader}
              className="bg-[#a34063] select-none text-white px-2.5 py-1.5 flex items-center justify-between cursor-move border-b border-b-black text-xs font-spooky"
              style={{
                backgroundImage: 'linear-gradient(90deg, #a34063 0%, #7d2a48 100%)'
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-sm">💀</span>
                <span className="tracking-wider text-sm truncate">
                  Pip_Portfolio.exe — [Junior Dream Engineer @ Midnight Nursery]
                </span>
              </div>

              <div className="flex items-center gap-1 ml-2 font-mono">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setIsMinimized(true);
                  }}
                  className="w-4 h-4 bg-[#dfd7ce] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center font-bold text-[10px] hover:bg-white active:translate-y-0.5"
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
                  className="w-4 h-4 bg-[#dfd7ce] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center font-bold text-[10px] hover:bg-white active:translate-y-0.5"
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
                  className="w-4 h-4 bg-[#dfd7ce] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center font-bold text-[10px] hover:bg-[#ff7b90] hover:text-white active:translate-y-0.5"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Breadcrumb strip */}
            <div className="bg-[#dfd7ce] px-3 py-1 text-[11px] border-b border-stone-400 text-stone-700 flex items-center justify-between font-lonewarc">
              <span className="flex items-center gap-1">
                <span>📁 C:\midnight_nursery\pip\</span>
                <span className="font-bold text-[#a34063]">
                  {activeTab === 'meet-pip' && '01_meet_pip.txt'}
                  {activeTab === 'crafts' && '02_lullaby_lab.app'}
                  {activeTab === 'story' && '03_bedtime_story.doc'}
                  {activeTab === 'guestbook' && '04_guestbook.log'}
                </span>
              </span>
              <span className="hidden sm:inline text-stone-500">SEC: COZY_LV99</span>
            </div>

            {/* Window Interior: Sidebar + Viewport */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[430px] max-h-[74vh] md:max-h-[600px]">
              <nav className="w-full md:w-52 bg-[#e4ded5] border-b md:border-b-0 md:border-r border-stone-400 p-2 flex md:flex-col gap-1.5 text-xs font-pumkin overflow-x-auto">
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('meet-pip');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border ${
                    activeTab === 'meet-pip'
                      ? 'bg-[#a34063] text-white border-t-black border-l-black border-r-white border-b-white font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-t-white border-l-white border-r-[#5c4033] border-b-[#5c4033]'
                  }`}
                >
                  <FileText size={14} className={activeTab === 'meet-pip' ? 'text-pink-200' : 'text-[#a34063]'} />
                  <span className="truncate text-xs">01. Meet Pip</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('crafts');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border ${
                    activeTab === 'crafts'
                      ? 'bg-[#a34063] text-white border-t-black border-l-black border-r-white border-b-white font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-t-white border-l-white border-r-[#5c4033] border-b-[#5c4033]'
                  }`}
                >
                  <Music size={14} className={activeTab === 'crafts' ? 'text-pink-200' : 'text-amber-600'} />
                  <span className="truncate text-xs">02. Crafts & Projects</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('story');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border ${
                    activeTab === 'story'
                      ? 'bg-[#a34063] text-white border-t-black border-l-black border-r-white border-b-white font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-t-white border-l-white border-r-[#5c4033] border-b-[#5c4033]'
                  }`}
                >
                  <BookOpen size={14} className={activeTab === 'story' ? 'text-pink-200' : 'text-indigo-600'} />
                  <span className="truncate text-xs">03. Bedtime Story</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('guestbook');
                  }}
                  className={`flex-1 md:flex-none text-left px-2.5 py-2 flex items-center gap-2 border ${
                    activeTab === 'guestbook'
                      ? 'bg-[#a34063] text-white border-t-black border-l-black border-r-white border-b-white font-bold shadow-inner'
                      : 'bg-[#ede7df] hover:bg-white text-stone-800 border-t-white border-l-white border-r-[#5c4033] border-b-[#5c4033]'
                  }`}
                >
                  <MessageSquare size={14} className={activeTab === 'guestbook' ? 'text-pink-200' : 'text-rose-600'} />
                  <span className="truncate text-xs">04. Guestbook</span>
                </button>

                {/* Sidebar Hackathon Badge */}
                <div className="hidden md:block mt-auto p-2 bg-[#dfd8ce] border border-t-[#5c4033] border-l-[#5c4033] border-r-white border-b-white text-center">
                  <div className="font-spooky text-sm text-[#a34063]">haX.baby 2026</div>
                  <div className="font-bubblegum text-[11px] text-stone-600">Official Release Assets</div>
                  <div className="mt-1 flex justify-center gap-1 text-xs">
                    <span>🍼</span>
                    <span>⭐</span>
                    <span>🌙</span>
                  </div>
                </div>
              </nav>

              {/* Viewport Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-white text-stone-900 border-2 border-t-[#5c4033] border-l-[#5c4033] border-r-white border-b-white m-1 sm:m-2 shadow-inner">
                {/* 1. MEET PIP */}
                {activeTab === 'meet-pip' && (
                  <div className="space-y-5 animate-in fade-in">
                    {/* Character Spotlight with Official 3D Render */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#fff8f1] p-3.5 border-2 border-stone-300">
                      {/* Official 3D Render Avatar */}
                      <div
                        onClick={handlePipAvatarClick}
                        className="cursor-pointer group relative flex flex-col items-center"
                        title="Click Pip to hear a whispered bedtime secret!"
                      >
                        <div className="w-28 h-28 rounded-full border-4 border-[#a34063] bg-amber-50/60 p-1 shadow-md overflow-hidden flex items-center justify-center">
                          <img
                            src="/images/pip-waving.png"
                            alt="Pip, The Skull Baby"
                            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span className="mt-1 bg-[#ffd1dc] border border-[#a34063] text-[9px] font-lonewarc font-bold px-2 py-0.5 rounded-full text-[#a34063]">
                          CLICK PIP! 💖
                        </span>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="inline-block bg-[#a34063] text-white text-[11px] font-lonewarc px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1">
                          Role: Junior Dream Engineer
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-spooky text-[#5c4033] flex items-center justify-center sm:justify-start gap-1">
                          Pip, The Skull Baby <span>🍼</span>
                        </h2>
                        <p className="font-bubblegum text-sm text-stone-700 mt-1 leading-relaxed">
                          Stationed at the <strong>Midnight Nursery</strong> (Sector 7). Responsible for weaving gentle
                          lullabies, calibrating nightlight hues, and ensuring every starry kitten and toddler drifts into
                          warm, sweet dreams. Cozy, soft, and wholesome—never scary!
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-[#faf7f2] p-3 border border-stone-300">
                      <h3 className="text-xs font-pumkin uppercase tracking-wider text-[#a34063] mb-2 flex items-center gap-1">
                        <Zap size={14} /> Dream Engineering Core Metrics
                      </h3>
                      <div className="space-y-2 text-xs">
                        <StatBar label="Lullaby Acoustic Crafting" value={95} color="#a34063" />
                        <StatBar label="Nightlight Hue Calibration" value={88} color="#f59e0b" />
                        <StatBar label="Cumulus Cloud Fluffing" value={92} color="#3b82f6" />
                        <StatBar label="Nightmare Banishment" value={99} color="#10b981" />
                        <StatBar label="Warm Cocoa Temp Precision" value={97} color="#ec4899" />
                      </div>
                    </div>

                    {/* Official Gear Loadout featuring 3D Lantern and Music Box */}
                    <div>
                      <h3 className="text-xs font-pumkin uppercase tracking-wider text-[#a34063] mb-2 flex items-center gap-1">
                        <Award size={14} /> Official Hackathon Equipment
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="p-2.5 bg-stone-50 border border-stone-300 hover:border-[#a34063] transition-colors flex items-center gap-3">
                          <img
                            src="/images/moon-nightlight.jpg"
                            alt="Moon Nightlight"
                            className="w-14 h-14 object-cover rounded-md border border-stone-300 shadow-sm"
                          />
                          <div>
                            <div className="font-spooky text-sm text-[#5c4033]">Midnight Moon Nightlight</div>
                            <div className="text-xs text-stone-600 font-bubblegum">
                              Calibrated amber glow with sleeping crescent moon relief.
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 bg-stone-50 border border-stone-300 hover:border-[#a34063] transition-colors flex items-center gap-3">
                          <img
                            src="/images/unicorn-musicbox.jpg"
                            alt="Unicorn Music Box"
                            className="w-14 h-14 object-cover rounded-md border border-stone-300 shadow-sm"
                          />
                          <div>
                            <div className="font-spooky text-sm text-[#5c4033]">Unicorn Carousel Music Box</div>
                            <div className="text-xs text-stone-600 font-bubblegum">
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
                    <div className="border border-stone-300 text-xs">
                      <div className="bg-[#ede7df] px-3 py-1 font-pumkin border-b border-stone-300 text-stone-800">
                        📋 Daily Shift Schedule (Midnight Nursery)
                      </div>
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          <tr className="border-b border-stone-200">
                            <td className="p-2 font-lonewarc text-[#a34063] font-bold w-24">08:00 PM</td>
                            <td className="p-2 font-bubblegum text-sm text-stone-700">Starch & fluff the nursery cumulus pillows.</td>
                          </tr>
                          <tr className="border-b border-stone-200 bg-stone-50">
                            <td className="p-2 font-lonewarc text-[#a34063] font-bold">10:30 PM</td>
                            <td className="p-2 font-bubblegum text-sm text-stone-700">
                              Check closet & under bed; offer tea to friendly shadows.
                            </td>
                          </tr>
                          <tr className="border-b border-stone-200">
                            <td className="p-2 font-lonewarc text-[#a34063] font-bold">12:00 AM</td>
                            <td className="p-2 font-bubblegum text-sm text-stone-700">Broadcast Sector 7 gentle lullaby radio wave.</td>
                          </tr>
                          <tr className="bg-stone-50">
                            <td className="p-2 font-lonewarc text-[#a34063] font-bold">06:00 AM</td>
                            <td className="p-2 font-bubblegum text-sm text-stone-700">Handover to morning sunbeams; bedtime nap for Pip.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. CRAFTS & PROJECTS */}
                {activeTab === 'crafts' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex border-b-2 border-stone-300 text-xs gap-1 font-pumkin">
                      <button
                        onClick={() => handleSwitchCraft('lullaby')}
                        className={`px-3 py-1.5 font-bold border-t-2 border-l-2 border-r-2 ${
                          craftsSubTab === 'lullaby'
                            ? 'bg-[#fff] border-stone-400 text-[#a34063] -mb-[2px] z-10'
                            : 'bg-[#ede7df] border-transparent text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        🎹 1. Lullaby Lab
                      </button>
                      <button
                        onClick={() => handleSwitchCraft('nightlight')}
                        className={`px-3 py-1.5 font-bold border-t-2 border-l-2 border-r-2 ${
                          craftsSubTab === 'nightlight'
                            ? 'bg-[#fff] border-stone-400 text-[#a34063] -mb-[2px] z-10'
                            : 'bg-[#ede7df] border-transparent text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        💡 2. Nightlight Catalog
                      </button>
                      <button
                        onClick={() => handleSwitchCraft('routes')}
                        className={`px-3 py-1.5 font-bold border-t-2 border-l-2 border-r-2 ${
                          craftsSubTab === 'routes'
                            ? 'bg-[#fff] border-stone-400 text-[#a34063] -mb-[2px] z-10'
                            : 'bg-[#ede7df] border-transparent text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        🗺️ 3. Dream Delivery Routes
                      </button>
                    </div>

                    {/* A. Lullaby Synth with Official Unicorn Music Box */}
                    {craftsSubTab === 'lullaby' && (
                      <div className="space-y-4">
                        <div className="bg-[#fff8f1] p-3 border border-amber-200 flex flex-col sm:flex-row items-center gap-3">
                          <img
                            src="/images/unicorn-musicbox.jpg"
                            alt="Unicorn Music Box"
                            className="w-16 h-16 rounded-md object-cover border border-amber-300 shadow"
                          />
                          <div>
                            <h3 className="font-bubblegum text-base text-[#5c4033] flex items-center gap-2">
                              <span>🎼</span> Interactive Lullaby Synthesizer & Music Box
                            </h3>
                            <p className="font-bubblegum text-xs text-stone-600 mt-0.5">
                              Synthesized directly via browser Web Audio API oscillator nodes. Play notes to calm the
                              nursery, or click auto-play for a sweet melody!
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-[#2c242b] border-4 border-[#5c4033] shadow-md rounded-sm">
                          <div className="flex items-center justify-between mb-3 text-white text-xs">
                            <span className="flex items-center gap-1.5 font-lonewarc">
                              <Radio size={14} className="text-pink-400 animate-pulse" />
                              <span>440Hz Nursery Carrier Wave</span>
                            </span>
                            <button
                              onClick={playAutoLullaby}
                              disabled={isPlayingLullaby}
                              className={`px-3 py-1 rounded text-xs font-pumkin transition-all ${
                                isPlayingLullaby
                                  ? 'bg-stone-600 text-stone-300 cursor-not-allowed'
                                  : 'bg-[#a34063] hover:bg-[#c04e76] text-white shadow-md active:translate-y-0.5'
                              }`}
                            >
                              {isPlayingLullaby ? '🎶 Playing Lullaby...' : '▶ Auto-Play Melody'}
                            </button>
                          </div>

                          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                            {pianoKeys.map((key) => {
                              const isActive = activePianoKey === key.label;
                              return (
                                <button
                                  key={key.label}
                                  onClick={() => {
                                    setActivePianoKey(key.label);
                                    playLullabyNote(key.freq, 0.5);
                                    setTimeout(() => setActivePianoKey(null), 300);
                                  }}
                                  className={`h-24 sm:h-28 rounded-b flex flex-col justify-end items-center pb-2 transition-all select-none ${
                                    isActive
                                      ? 'bg-[#ffd1dc] border-4 border-[#a34063] translate-y-1 shadow-inner'
                                      : 'bg-white hover:bg-stone-100 border-2 border-stone-400 shadow-[0_4px_0_#999]'
                                  }`}
                                >
                                  <span className="font-lonewarc text-xs text-stone-800">{key.label}</span>
                                  <span className="text-[11px] font-bubblegum text-stone-600">{key.sub}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3 bg-black/60 p-1.5 border border-stone-700 flex items-center justify-center gap-1 h-8">
                            {[16, 28, 12, 34, 48, 22, 10, 38, 24, 18, 40, 14].map((h, i) => (
                              <div
                                key={i}
                                style={{
                                  height: activePianoKey ? `${Math.min(100, h * 1.6)}%` : '20%'
                                }}
                                className="w-1 bg-[#f9d77e] rounded-full transition-all duration-75"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* B. Nightlights with Official Moon Lantern */}
                    {craftsSubTab === 'nightlight' && (
                      <div className="space-y-4">
                        <div className="bg-[#fff8f1] p-3 border border-amber-200">
                          <h3 className="font-bubblegum text-base text-[#5c4033] flex items-center gap-2">
                            <span>💡</span> The Midnight Nursery Nightlight Catalog
                          </h3>
                          <p className="font-bubblegum text-xs text-stone-600 mt-0.5">
                            Pick an ambient color and adjust brightness to discover the optimal frequency for restful
                            eyelids.
                          </p>
                        </div>

                        <div className="p-6 bg-[#16121e] border-4 border-[#5c4033] rounded-sm flex flex-col sm:flex-row items-center justify-around gap-6">
                          {/* Official 3D Moon Lantern with Dynamic Ambient Color Lighting */}
                          <div className="relative flex items-center justify-center">
                            <div
                              style={{
                                backgroundColor: nightlightColor,
                                opacity: nightlightGlow / 100,
                                filter: 'blur(35px)',
                                transform: breathingLight ? 'scale(1.15)' : 'scale(1)'
                              }}
                              className="absolute w-44 h-44 rounded-full transition-all duration-1000"
                            />
                            <div className="relative z-10 w-32 h-32 rounded-xl overflow-hidden border-2 border-white/60 shadow-2xl p-1 bg-black/40">
                              <img
                                src="/images/moon-nightlight.jpg"
                                alt="Official Moon Nightlight"
                                style={{
                                  filter: `drop-shadow(0 0 15px ${nightlightColor})`
                                }}
                                className={`w-full h-full object-cover rounded-lg ${
                                  breathingLight ? 'animate-pulse' : ''
                                }`}
                              />
                            </div>
                          </div>

                          <div className="w-full sm:w-64 space-y-3 text-white text-xs">
                            <div>
                              <label className="block mb-1 font-lonewarc text-stone-300">
                                LUMINESCENCE: {nightlightGlow}%
                              </label>
                              <input
                                type="range"
                                min="20"
                                max="100"
                                value={nightlightGlow}
                                onChange={(e) => setNightlightGlow(Number(e.target.value))}
                                className="w-full accent-[#a34063]"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="breathing"
                                checked={breathingLight}
                                onChange={(e) => setBreathingLight(e.target.checked)}
                                className="accent-[#a34063]"
                              />
                              <label htmlFor="breathing" className="text-stone-300 cursor-pointer font-bubblegum text-xs">
                                Enable Gentle Breathing Pulse
                              </label>
                            </div>

                            <div>
                              <span className="block mb-1.5 font-pumkin text-stone-300">Select Preset Gel:</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {nightlightPresets.map((preset) => (
                                  <button
                                    key={preset.name}
                                    onClick={() => {
                                      playClick();
                                      setNightlightColor(preset.color);
                                    }}
                                    className={`px-2 py-1 rounded text-xs text-left flex items-center gap-1.5 border transition-all font-bubblegum ${
                                      nightlightColor === preset.color
                                        ? 'border-white bg-white/20 font-bold'
                                        : 'border-stone-700 bg-stone-800 hover:bg-stone-700'
                                    }`}
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full inline-block"
                                      style={{ backgroundColor: preset.color }}
                                    />
                                    <span>{preset.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* C. Dream Routes */}
                    {craftsSubTab === 'routes' && (
                      <div className="space-y-4">
                        <div className="bg-[#fff8f1] p-3 border border-amber-200">
                          <h3 className="font-bubblegum text-base text-[#5c4033] flex items-center gap-2">
                            <span>🗺️</span> Midnight Flight Route Dispatcher
                          </h3>
                          <p className="font-bubblegum text-xs text-stone-600 mt-0.5">
                            Monitor live cloud-corridors and dispatch warm blanket shipments across starry sectors.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <RouteCard
                            title="Sector 7: Starfield"
                            cargo="1,200 Feather Blankets"
                            status="ON TIME"
                            statusColor="text-emerald-600"
                            weather="Clear Stardust"
                            isSelected={activeRouteId === 'route-1'}
                            onClick={() => {
                              playClick();
                              setActiveRouteId('route-1');
                            }}
                          />
                          <RouteCard
                            title="Sector 12: Whispering Pines"
                            cargo="850 Lullaby Cassettes"
                            status="IN FLIGHT"
                            statusColor="text-amber-600"
                            weather="Light Cloud Mist"
                            isSelected={activeRouteId === 'route-2'}
                            onClick={() => {
                              playClick();
                              setActiveRouteId('route-2');
                            }}
                          />
                          <RouteCard
                            title="Sector 03: Coral Sea"
                            cargo="2,400 Whale Hum Loops"
                            status="DOCKING"
                            statusColor="text-blue-600"
                            weather="Calm Waters"
                            isSelected={activeRouteId === 'route-3'}
                            onClick={() => {
                              playClick();
                              setActiveRouteId('route-3');
                            }}
                          />
                        </div>

                        <div className="p-3 bg-stone-100 border border-stone-300 flex items-center justify-between">
                          <div className="text-xs text-stone-700 font-lonewarc">
                            ROUTE: <strong>{activeRouteId.toUpperCase()}</strong>
                            {cloudDispatched && (
                              <span className="ml-2 text-emerald-600 font-bold font-bubblegum">
                                ✨ Extra Dream Cloud Dispatched!
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              playMagic();
                              setCloudDispatched(true);
                              setTimeout(() => setCloudDispatched(false), 3000);
                            }}
                            className="px-3 py-1 bg-[#a34063] hover:bg-[#be4e77] text-white text-xs font-pumkin rounded shadow active:translate-y-0.5"
                          >
                            Dispatch Dream Cloud ☁️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. BEDTIME STORY */}
                {activeTab === 'story' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-[#fff8f1] p-3 border border-amber-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-spooky text-lg text-[#5c4033] flex items-center gap-2">
                          <span>📖</span> The Quest for the Lost Sleepy Sheep
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
                        className="px-2 py-1 bg-[#ede7df] hover:bg-white text-stone-700 text-xs font-pumkin border border-stone-400 flex items-center gap-1 active:translate-y-0.5"
                      >
                        <RotateCcw size={12} /> Start Over
                      </button>
                    </div>

                    <div className="p-5 bg-[#faf7f2] border-2 border-stone-300 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <span className="font-spooky text-lg text-[#a34063]">
                          {storyNodes[storyNode].title}
                        </span>
                        <span className="text-[10px] bg-[#ffd1dc] text-[#a34063] px-2 py-0.5 rounded font-lonewarc font-bold">
                          PAGE {storyNode + 1} OF 5
                        </span>
                      </div>

                      <p className="text-base leading-relaxed text-stone-800 font-bubblegum">
                        {storyNodes[storyNode].text}
                      </p>

                      <div className="pt-2">
                        {storyNodes[storyNode].ending ? (
                          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-center space-y-2">
                            <p className="text-sm font-bubblegum text-amber-800">
                              🎉 You have concluded tonight&apos;s bedtime adventure!
                            </p>
                            <button
                              onClick={() => {
                                playChime();
                                setStoryNode(0);
                              }}
                              className="px-4 py-1.5 bg-[#a34063] text-white text-xs font-pumkin rounded shadow hover:bg-[#c04e76]"
                            >
                              Read Another Path 🔄
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-[11px] font-pumkin text-stone-500 uppercase tracking-wider block">
                              What should Pip do next?
                            </span>
                            {storyNodes[storyNode].choices.map((choice, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  playChime();
                                  setStoryNode(choice.next);
                                }}
                                className="w-full text-left p-2.5 text-xs bg-white hover:bg-[#fff0f4] border-2 border-t-white border-l-white border-r-[#5c4033] border-b-[#5c4033] hover:border-[#a34063] flex items-center justify-between group transition-all"
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
                    <div className="bg-[#fff8f1] p-3 border border-amber-200">
                      <h3 className="font-spooky text-lg text-[#5c4033] flex items-center gap-2">
                        <span>✍️</span> The Midnight Nursery Wall (Guestbook)
                      </h3>
                      <p className="font-bubblegum text-xs text-stone-600 mt-0.5">
                        Leave your bedtime wish, stamp your slumber sigil, and sign the official guestbook.
                      </p>
                    </div>

                    <form
                      onSubmit={handleAddGuestbook}
                      className="p-3 bg-[#ede7df] border-2 border-t-white border-l-white border-r-[#5c4033] border-b-[#5c4033] space-y-2.5 text-xs font-pumkin"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block mb-1 text-stone-800">Your Name / Dreamer Handle:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sleepy Star-Gazer"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-400 text-stone-800 focus:outline-[#a34063] font-bubblegum text-sm"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-stone-800">Sleepy Sigil:</label>
                          <select
                            value={guestSigil}
                            onChange={(e) => setGuestSigil(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-400 text-stone-800 focus:outline-[#a34063] font-bubblegum text-sm"
                          >
                            <option value="⭐">⭐ Golden Star</option>
                            <option value="🌙">🌙 Crescent Moon</option>
                            <option value="🐑">🐑 Fluffy Sheep</option>
                            <option value="💤">💤 Triple Zzz</option>
                            <option value="🧸">🧸 Teddy Bear</option>
                            <option value="🍼">🍼 Milk Bottle</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-stone-800">Your Bedtime Wish or Dream:</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="e.g. Wishing for warm socks, sweet dreams, and no alarm clocks tomorrow..."
                          value={guestWish}
                          onChange={(e) => setGuestWish(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-stone-400 text-stone-800 focus:outline-[#a34063] font-bubblegum text-sm"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#a34063] hover:bg-[#be4e77] text-white rounded-sm border border-t-white border-l-white border-r-black border-b-black shadow flex items-center gap-1.5 active:translate-y-0.5 font-pumkin text-xs"
                        >
                          <Send size={13} /> Sign Nursery Wall
                        </button>
                      </div>
                    </form>

                    <div className="space-y-2">
                      <h4 className="text-xs font-pumkin text-stone-600 uppercase tracking-wider">
                        Recent Bedtime Wall Signatures:
                      </h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {guestbookEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="p-2.5 bg-[#faf7f2] border border-stone-300 text-xs rounded-sm hover:border-[#a34063] transition-colors"
                          >
                            <div className="flex items-center justify-between text-stone-500 mb-1">
                              <span className="text-[#5c4033] flex items-center gap-1 font-spooky text-sm">
                                <span>{entry.sigil}</span> {entry.name}
                              </span>
                              <span className="text-[10px] font-lonewarc">{entry.date}</span>
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

            {/* Window Status Bar in Lonewarc Font */}
            <div className="bg-[#dfd7ce] px-2 py-1 text-[11px] border-t border-stone-400 flex items-center justify-between text-stone-600 font-lonewarc">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>STATUS: PIP_ENGINE_ONLINE</span>
              </span>
              <span>MEM: 48K/64K</span>
            </div>
          </div>
        )}

        {/* RECYCLE BIN MODAL */}
        {recycleBinOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm bg-[#ece5dc] border-2 border-t-white border-l-white border-r-black border-b-black shadow-2xl p-1 text-xs">
              <div className="bg-[#a34063] text-white px-2 py-1 flex justify-between items-center font-spooky text-sm">
                <span className="flex items-center gap-1">
                  <Trash2 size={13} /> Recycle Bin — Discarded Items
                </span>
                <button
                  onClick={() => setRecycleBinOpen(false)}
                  className="bg-[#dfd7ce] text-black w-4 h-4 flex items-center justify-center font-bold text-[10px] font-mono"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3 bg-white text-stone-800 m-1 border border-stone-400">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🗑️</span>
                  <div>
                    <h4 className="font-spooky text-base text-[#5c4033]">0 Discarded Dreams</h4>
                    <p className="text-xs text-stone-600 font-bubblegum">
                      In the Midnight Nursery, every single dream is precious and never deleted!
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-stone-50 p-2 border border-stone-200 space-y-1 font-bubblegum">
                  <div className="text-stone-500 font-pumkin">Current bin contents:</div>
                  <div>• 3x Empty mugs of warm honey tea</div>
                  <div>• 2x Tangled cloud strings</div>
                  <div>• 1x Cold hot-water bottle</div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleEmptyRecycleBin}
                    className="px-3 py-1 bg-[#a34063] text-white rounded-sm border border-black shadow hover:bg-[#be4e77] font-pumkin text-xs"
                  >
                    ✨ Sprinkle Stardust & Clear
                  </button>
                  <button
                    onClick={() => setRecycleBinOpen(false)}
                    className="px-3 py-1 bg-[#dfd7ce] text-black rounded-sm border border-stone-400 font-pumkin text-xs"
                  >
                    Close
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
          {/* Start Dreams Button with SpookyTheme font */}
          <button
            onClick={() => {
              playClick(700);
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 font-spooky text-sm border-2 transition-all ${
              isStartMenuOpen
                ? 'bg-[#c5b9aa] border-t-black border-l-black border-r-white border-b-white translate-y-0.5'
                : 'bg-[#ede7df] hover:bg-white border-t-white border-l-white border-r-[#403b38] border-b-[#403b38] active:translate-y-0.5'
            }`}
          >
            <span className="text-sm">💤</span>
            <span className="tracking-wider text-[#5c4033]">Start Dreams</span>
          </button>

          {/* Active Window Button in RetroPumkin font */}
          {isWindowOpen && (
            <button
              onClick={() => {
                playClick();
                setIsMinimized(!isMinimized);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-pumkin border-2 max-w-[200px] sm:max-w-xs truncate ${
                !isMinimized
                  ? 'bg-[#c5b9aa] border-t-black border-l-black border-r-white border-b-white font-bold text-[#a34063]'
                  : 'bg-[#ede7df] hover:bg-white border-t-white border-l-white border-r-[#403b38] border-b-[#403b38] text-stone-700'
              }`}
            >
              <FileText size={13} className="shrink-0" />
              <span className="truncate">Pip_Portfolio.exe</span>
            </button>
          )}

          {/* 90s Start Menu */}
          {isStartMenuOpen && (
            <div className="absolute bottom-10 left-0 w-64 bg-[#dfd7ce] border-2 border-t-white border-l-white border-r-black border-b-black shadow-2xl flex z-50 text-xs font-pumkin">
              <div className="w-10 bg-[#a34063] text-white flex flex-col justify-end items-center pb-3 font-spooky tracking-widest text-base">
                <span className="rotate-180 transform [writing-mode:vertical-rl]">
                  PIP-OS v1.0
                </span>
              </div>

              <div className="flex-1 py-1 text-stone-800">
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('meet-pip');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <FileText size={14} className="text-[#a34063]" />
                  <span>01. Meet Pip</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('crafts');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <Music size={14} className="text-amber-600" />
                  <span>02. Lullaby Lab</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('story');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <BookOpen size={14} className="text-indigo-600" />
                  <span>03. Bedtime Story</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenDesktopIcon('guestbook');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  <MessageSquare size={14} className="text-rose-600" />
                  <span>04. Guestbook</span>
                </button>

                <div className="my-1 border-t border-t-stone-400 border-b border-b-white" />

                <button
                  onClick={() => {
                    handleToggleTheme();
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#a34063] hover:text-white flex items-center gap-2"
                >
                  {isNightMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                  <span>Switch Day/Night</span>
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
                  <span>Open Recycle Bin</span>
                </button>

                <div className="my-1 border-t border-t-stone-400 border-b border-b-white" />

                <button
                  onClick={() => {
                    playClick(400);
                    setIsStartMenuOpen(false);
                    showToast('💤 Sweet dreams from Pip and the Midnight Nursery!');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-300 font-spooky text-sm text-[#a34063] flex items-center gap-2"
                >
                  <span>🌙</span>
                  <span>Goodnight / Nap</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vintage Odometer Hit Counter in Lonewarc font */}
        <div className="flex items-center gap-2 font-lonewarc">
          <span className="hidden sm:inline text-xs text-stone-600 font-pumkin">Visitors:</span>
          <div
            onClick={() => {
              playClick(1000);
              setHitCount((prev) => prev + 1);
            }}
            title="Vintage Hit Counter - Click to increment!"
            className="flex bg-black px-1.5 py-0.5 border border-stone-500 shadow-inner rounded-sm cursor-pointer hover:border-amber-400"
          >
            {String(hitCount)
              .padStart(6, '0')
              .split('')
              .map((digit, idx) => (
                <span
                  key={idx}
                  className="inline-block w-3.5 text-center font-bold text-xs text-[#52e552] border-r border-stone-800 last:border-r-0"
                  style={{ textShadow: '0 0 5px rgba(82, 229, 82, 0.7)' }}
                >
                  {digit}
                </span>
              ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENTS
// =========================================================================

/**
 * High-Contrast Dynamic Skull Watermark rendered specifically during mode transitions.
 * When switching to Night Mode -> Watermark is rendered in luminous starlight amber/cream contrast.
 * When switching to Day Mode -> Watermark is rendered in rich berry/slate contrast.
 */
function ModeSwitchingSkullWatermark({ isTargetNight }) {
  // Color configuration in contrast to destination background
  const skullFill = isTargetNight ? '#fffdf7' : '#1e1a29';
  const skullStroke = isTargetNight ? '#f9d77e' : '#a34063';
  const socketFill = isTargetNight ? '#1e1a29' : '#fff8f1';
  const pupilGlow = '#f59e0b';
  const capFill = isTargetNight ? '#a34063' : '#5c4033';
  const starFill = isTargetNight ? '#f9d77e' : '#ffd1dc';
  const blushFill = isTargetNight ? '#fda4af' : '#a34063';
  const dropGlow = isTargetNight
    ? 'drop-shadow(0 0 35px rgba(249, 215, 126, 0.75))'
    : 'drop-shadow(0 0 35px rgba(163, 64, 99, 0.65))';

  return (
    <div style={{ filter: dropGlow }} className="transition-all duration-500">
      <svg
        width="220"
        height="220"
        viewBox="0 0 120 120"
        className="transform hover:scale-105 transition-transform"
      >
        <defs>
          <filter id="watermarkAmberGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fluffy collar / cloud */}
        <path
          d="M 28,95 Q 60,118 92,95 Q 75,108 45,108 Z"
          fill={isTargetNight ? '#ffd1dc' : '#5c4033'}
          stroke={skullStroke}
          strokeWidth="2.5"
        />

        {/* Round Skull Head */}
        <path
          d="M 28,60 C 24,30 96,30 92,60 C 92,76 82,88 60,88 C 38,88 28,76 28,60 Z"
          fill={skullFill}
          stroke={skullStroke}
          strokeWidth="3.5"
        />

        {/* Soft Eye Sockets in destination contrast */}
        <ellipse cx="44" cy="60" rx="11" ry="13" fill={socketFill} />
        <ellipse cx="76" cy="60" rx="11" ry="13" fill={socketFill} />

        {/* Glowing Amber Pinprick Pupils */}
        <circle cx="45" cy="59" r="4" fill={pupilGlow} filter="url(#watermarkAmberGlow)" />
        <circle cx="45" cy="59" r="1.8" fill="#ffffff" />
        <circle cx="75" cy="59" r="4" fill={pupilGlow} filter="url(#watermarkAmberGlow)" />
        <circle cx="75" cy="59" r="1.8" fill="#ffffff" />

        {/* Rosy Blush */}
        <ellipse cx="33" cy="73" rx="7" ry="4" fill={blushFill} opacity={isTargetNight ? 0.7 : 0.4} />
        <ellipse cx="87" cy="73" rx="7" ry="4" fill={blushFill} opacity={isTargetNight ? 0.7 : 0.4} />

        {/* Nose Cavity */}
        <path d="M 58,68 Q 60,65 62,68 Q 60,72 58,68 Z" fill={skullStroke} />

        {/* Crooked Friendly Smile */}
        <path
          d="M 45,78 Q 60,86 75,78"
          fill="none"
          stroke={skullStroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line x1="51" y1="79" x2="51" y2="84" stroke={skullStroke} strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="81" x2="60" y2="86" stroke={skullStroke} strokeWidth="2" strokeLinecap="round" />
        <line x1="69" y1="79" x2="69" y2="84" stroke={skullStroke} strokeWidth="2" strokeLinecap="round" />

        {/* Slouching Bedtime Nightcap */}
        <path
          d="M 26,42 Q 60,10 94,42 Q 106,60 114,80 Q 110,85 102,82 Q 95,65 88,44 Z"
          fill={capFill}
          stroke={skullStroke}
          strokeWidth="3"
        />
        {/* Cap Cuff */}
        <rect
          x="24"
          y="36"
          width="72"
          height="11"
          rx="5.5"
          fill={isTargetNight ? '#ffd1dc' : '#a34063'}
          stroke={skullStroke}
          strokeWidth="2.5"
        />

        {/* Gold Starlight Embellishments */}
        <polygon points="50,26 52,31 57,31 53,34 55,39 50,36 45,39 47,34 43,31 48,31" fill={starFill} />
        <polygon points="72,24 73,28 77,28 74,30 75,34 72,32 69,34 70,30 67,28 71,28" fill={starFill} />

        {/* Nightcap Pompom */}
        <circle cx="110" cy="84" r="9" fill={skullFill} stroke={skullStroke} strokeWidth="2.5" />

        {/* Pink Bow at Cap Base */}
        <ellipse cx="30" cy="40" rx="5" ry="3.5" fill="#ffb6c1" />
        <circle cx="30" cy="40" r="2.5" fill={skullStroke} />
      </svg>
    </div>
  );
}

function DesktopIconItem({ icon, label, isSelected, onClick, onDoubleClick, isNightMode }) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer w-24 h-24 text-center transition-all ${
        isSelected
          ? 'bg-[#a34063]/30 border-2 border-dotted border-[#ffd1dc]'
          : 'hover:bg-white/10 border-2 border-transparent'
      }`}
    >
      <div className="p-1.5 drop-shadow-md">{icon}</div>
      <span
        className={`text-xs font-pumkin leading-tight mt-1 line-clamp-2 px-1 rounded-sm ${
          isSelected
            ? 'bg-[#a34063] text-white'
            : isNightMode
            ? 'text-stone-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
            : 'text-stone-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 font-pumkin text-stone-700">
        <span>{label}</span>
        <span className="font-lonewarc text-[11px] font-bold">{value}%</span>
      </div>
      <div className="h-3.5 bg-stone-200 border border-t-[#5c4033] border-l-[#5c4033] border-r-white border-b-white p-[1px] shadow-inner">
        <div
          style={{ width: `${value}%`, backgroundColor: color }}
          className="h-full rounded-none transition-all duration-700"
        />
      </div>
    </div>
  );
}

function EquipmentCard({ icon, title, desc }) {
  return (
    <div className="p-2.5 bg-stone-50 border border-stone-300 hover:border-[#a34063] transition-colors flex items-start gap-2.5">
      <span className="text-xl shrink-0 p-1 bg-white border border-stone-200 rounded">{icon}</span>
      <div>
        <div className="font-spooky text-sm text-[#5c4033]">{title}</div>
        <div className="text-xs text-stone-600 leading-snug font-bubblegum">{desc}</div>
      </div>
    </div>
  );
}

function RouteCard({ title, cargo, status, statusColor, weather, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 border-2 rounded-sm cursor-pointer transition-all ${
        isSelected
          ? 'bg-[#fff0f5] border-[#a34063] shadow-md'
          : 'bg-white hover:bg-stone-50 border-stone-300'
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-pumkin text-xs text-stone-800">{title}</span>
        <span className={`text-[10px] font-bold font-lonewarc ${statusColor}`}>{status}</span>
      </div>
      <div className="text-[11px] text-stone-600 space-y-0.5 font-lonewarc">
        <div>📦 {cargo}</div>
        <div>☁️ {weather}</div>
      </div>
    </div>
  );
}
