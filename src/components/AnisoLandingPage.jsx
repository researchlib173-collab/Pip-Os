import React, { useState, useEffect } from 'react';

/**
 * AnisoLandingPage.jsx
 * 
 * Aniso-themed Landing Page for Pip-OS:
 * - Minimalist brutalist aesthetic inspired by darkroomengineering/aniso.
 * - Clean white background with soft pastel gradient (pink & blue undertones).
 * - Vibrant Pink and Blue text colors.
 * - Tilted orientation for the welcome title.
 * - Zero extra options or buttons cluttering the view.
 * - ONLY ONE clear message: "Click on the screen to enter."
 * - Clicking anywhere on the entire screen enters the retro Pip-OS desktop.
 */
export default function AnisoLandingPage({
  onLaunchDesktop = () => {},
  isNightMode = false
}) {
  const [pulse, setPulse] = useState(true);

  // Subtle pulsing effect for the enter prompt
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={onLaunchDesktop}
      className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-white bg-gradient-to-br from-white via-pink-50/50 to-blue-50/60"
      title="Click anywhere to enter Pip-OS"
    >
      {/* Background Subtle Aniso Monospace Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden leading-tight font-mono text-[11px] text-slate-900 select-none">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap tracking-widest">
            {'01 💀 PIP.OS haX.baby ANISO-ENGINE 3D-LULLABY DREAMS [440HZ] * . : - = + * # % @ '.repeat(6)}
          </div>
        ))}
      </div>

      {/* Decorative Aniso Frame Corner Accents */}
      <div className="absolute top-8 left-8 font-mono text-xs text-blue-400 tracking-widest pointer-events-none">
        ┌── [ANISO.SYSTEM // V1.0] ──┐
      </div>
      <div className="absolute top-8 right-8 font-mono text-xs text-pink-400 tracking-widest pointer-events-none">
        ┌── [haX.baby HACKATHON] ──┐
      </div>
      <div className="absolute bottom-8 left-8 font-mono text-xs text-pink-400 tracking-widest pointer-events-none">
        └── [LATENCY: 0.0MS] ──┘
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-xs text-blue-400 tracking-widest pointer-events-none">
        └── [STATE: READY] ──┘
      </div>

      {/* Centerpiece: Tilted Welcome Title in Aniso Pink & Blue */}
      <div className="relative flex flex-col items-center justify-center max-w-2xl px-6 py-10 transition-transform duration-300 hover:scale-[1.02]">
        
        {/* Tilted orientation banner */}
        <div className="transform -rotate-6 transition-transform duration-500 hover:-rotate-3">
          
          {/* Brutalist Shadow Box */}
          <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 border-4 border-slate-900 shadow-[10px_10px_0px_#ec4899] sm:shadow-[14px_14px_0px_#3b82f6] relative">
            
            {/* Top decorative badge */}
            <div className="absolute -top-4 left-6 bg-[#3b82f6] text-white px-3 py-0.5 text-[11px] font-mono font-bold tracking-wider uppercase border-2 border-slate-900">
              * haX.baby // SPECIAL EDITION *
            </div>

            {/* Main Welcome Title */}
            <div className="text-center space-y-3">
              <div className="font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#ec4899]">
                // WELCOME TO
              </div>

              <h1 className="font-lonewarc text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
                <span className="text-[#ec4899] drop-shadow-[2px_2px_0px_#fbcfe8]">PIP</span>
                <span className="text-slate-900 mx-2">-</span>
                <span className="text-[#3b82f6] drop-shadow-[2px_2px_0px_#bfdbfe]">OS</span>
              </h1>

              <div className="font-bubblegum text-lg sm:text-xl text-[#3b82f6] font-medium tracking-wide">
                Junior Dream Engineer's Nursery Operating System
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ec4899] animate-ping" />
                <span className="text-[#ec4899] font-bold">ANISO THEME</span>
                <span>•</span>
                <span className="text-[#3b82f6] font-bold">SYNCHRONIZED 3D MUSIC</span>
              </div>
            </div>

          </div>
        </div>

        {/* The ONLY instruction / message: "Click on the screen to enter." */}
        <div className="mt-14 sm:mt-16 text-center">
          <div
            className={`font-mono text-base sm:text-lg md:text-xl font-bold tracking-wider px-6 py-3 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_#ec4899] transition-all duration-200 ${
              pulse ? 'text-[#3b82f6] border-[#3b82f6] shadow-[4px_4px_0px_#3b82f6]' : 'text-[#ec4899] border-[#ec4899] shadow-[4px_4px_0px_#ec4899]'
            }`}
          >
            Click on the screen to enter.
          </div>
          <div className="mt-3 font-mono text-[11px] text-slate-500 tracking-widest uppercase">
            [ Touch or click anywhere to launch desktop ]
          </div>
        </div>

      </div>
    </div>
  );
}
