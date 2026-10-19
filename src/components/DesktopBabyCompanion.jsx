import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * DesktopBabyCompanion.jsx
 * 
 * Immersive Full-Screen Desktop Background Baby Pip:
 * - Totally fills the desktop background behind desktop icons and windows.
 * - Authentically colored with Hackathon Avatar colors (Cream ivory skull, dark eye sockets,
 *   rosy cheeks, smiling mouth, berry nightcap with white brim & golden star, lavender onesie).
 * - Strictly NO glow, NO bloom, NO emissive blowout - razor-sharp, well-defined facial features.
 * - Compatible skeletal rigging targeting facial anatomy (head tilt, jaw chatter, brow).
 * - Three interactive reaction states:
 *   1. Touch/Click -> Giggling reaction (plays user's /audio/giggle.wav, chattering jaw, playful bounce).
 *   2. Hover/Move -> Wondering expression (curious head tilt, wondering eyes following cursor).
 *   3. Stationary Cursor -> Cute crying behavior after inactivity delay.
 * - Body remains completely stationary in position and overall placement.
 */
export default function DesktopBabyCompanion({
  isNightMode = true,
  onPipGiggle = () => {}
}) {
  const mountRef = useRef(null);

  const [speech, setSpeech] = useState("Hehehe! Welcome to my nursery desktop! 🍼✨");
  const [showSpeech, setShowSpeech] = useState(true);
  const [isGiggling, setIsGiggling] = useState(false);
  const [activeReaction, setActiveReaction] = useState('idle'); // 'idle' | 'wondering' | 'crying' | 'giggle'

  // Internal refs
  const speechTimerRef = useRef(null);
  const bonesRef = useRef({ root: null, head: null, jaw: null, brow: null });
  const eyeLightsRef = useRef([]);
  const tearsGroupRef = useRef(null);
  const stateRef = useRef('idle'); // 'idle' | 'wondering' | 'crying' | 'giggle'
  const giggleStartRef = useRef(0);
  const inactivityTimerRef = useRef(null);
  const mouseNormRef = useRef({ x: 0, y: 0 });

  // Play .wav giggle audio supplied by the user
  const playGiggleAudio = () => {
    try {
      const audio = new Audio('/audio/giggle.wav');
      audio.volume = 0.95;
      audio.currentTime = 0;
      audio.play().catch(() => {
        playSynthChime();
      });
    } catch {
      playSynthChime();
    }
  };

  const playSynthChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      [587.33, 739.99, 880.0, 1174.66].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.14);
      });
    } catch {}
  };

  // Trigger Giggle on Desktop Click
  const handleBabyClick = (e) => {
    stateRef.current = 'giggle';
    giggleStartRef.current = Date.now();
    setIsGiggling(true);
    setActiveReaction('giggle');
    playGiggleAudio();
    onPipGiggle();

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    resetInactivityTimer();

    const phrases = [
      "Hehehe! Junior Dream Engineer at your service! 🍼✨",
      "Teehee! You tickled me on the desktop! 🌙",
      "Giggle giggle! Starlight calibration check passed! ⭐",
      "Aww! Delivering sweet 440Hz lullaby dreams tonight! 💤"
    ];
    setSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
    setShowSpeech(true);

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setShowSpeech(false);
    }, 4500);

    setTimeout(() => {
      setIsGiggling(false);
      if (stateRef.current === 'giggle') {
        stateRef.current = 'idle';
        setActiveReaction('idle');
      }
    }, 1500);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      if (stateRef.current !== 'giggle') {
        stateRef.current = 'crying';
        setActiveReaction('crying');
      }
    }, 4500);
  };

  // Three.js Scene Setup & FBX Rigging
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    
    // Camera framing calibrated so the baby totally fills the desktop background
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 3.2);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Pixel effect composer WITHOUT bloom (crisp retro shading without bloom blowout)
    const composer = new EffectComposer(renderer);
    const pixelPass = new RenderPixelatedPass(2, scene, camera);
    composer.addPass(pixelPass);
    composer.addPass(new OutputPass());

    // 1. High-definition lighting for sharp facial contours (NO glow)
    const ambientLight = new THREE.AmbientLight(isNightMode ? 0x3d354a : 0xfcf8f2, 1.35);
    scene.add(ambientLight);

    // Key light for crisp skull forehead and cheeks
    const keyLight = new THREE.DirectionalLight(0xffeedb, 1.55);
    keyLight.position.set(2.5, 3.5, 3.0);
    scene.add(keyLight);

    // Fill light for soft shadow fill inside eye cavities
    const fillLight = new THREE.DirectionalLight(0xbad2ff, 0.65);
    fillLight.position.set(-3.0, 1.5, 2.0);
    scene.add(fillLight);

    // Rim light to highlight nightcap silhouette against dark background
    const rimLight = new THREE.DirectionalLight(0xffd4ea, 0.5);
    rimLight.position.set(0, -2.5, -2.5);
    scene.add(rimLight);

    const babyGroup = new THREE.Group();
    babyGroup.position.set(0, -0.32, 0);
    scene.add(babyGroup);

    // Floating Starlight Sparkles around Baby
    const sparkleCount = 28;
    const sparkleGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sPos[i] = (Math.random() - 0.5) * 4.6;
      sPos[i + 1] = Math.random() * 3.4 - 1.2;
      sPos[i + 2] = (Math.random() - 0.5) * 2.8;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sparkles = new THREE.Points(
      sparkleGeo,
      new THREE.PointsMaterial({ size: 0.04, color: 0xfacc15, transparent: true, opacity: 0.75 })
    );
    scene.add(sparkles);

    // Sparkling Cry Tears Group
    const tearsGroup = new THREE.Group();
    tearsGroup.visible = false;
    tearsGroupRef.current = tearsGroup;
    scene.add(tearsGroup);

    const tearGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const tearMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
    const leftTear = new THREE.Mesh(tearGeo, tearMat);
    const rightTear = new THREE.Mesh(tearGeo, tearMat);
    leftTear.position.set(-0.35, 0.25, 0.5);
    rightTear.position.set(0.22, 0.22, 0.5);
    tearsGroup.add(leftTear);
    tearsGroup.add(rightTear);

    // Load FBX Model & Apply Hackathon Avatar Coloring
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/models/pip/pip_baby.fbx',
      (fbx) => {
        fbx.updateMatrixWorld(true);

        let rawMesh = null;
        fbx.traverse((c) => {
          if (c.isMesh && !rawMesh) rawMesh = c;
        });
        if (!rawMesh) return;

        const geom = rawMesh.geometry.clone().applyMatrix4(rawMesh.matrixWorld);
        geom.computeVertexNormals();

        const pos = geom.attributes.position;
        const vertexCount = pos.count;

        // Compatible Skin weights & Vertex Colors
        const skinIndices = new Float32Array(vertexCount * 4);
        const skinWeights = new Float32Array(vertexCount * 4);
        const colors = new Float32Array(vertexCount * 3);

        for (let i = 0; i < vertexCount; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);

          let r = 0.98, g = 0.95, b = 0.91; // Cream Skull #faf2e8

          if (y < 0) {
            // Stationary Body Swaddle
            skinIndices[i * 4] = 0; // Root
            skinWeights[i * 4] = 1.0;

            if (Math.abs(x) < 5.5 && y > -65 && y < -10 && z > 15) {
              r = 0.62; g = 0.16; b = 0.32; // Berry buttons #9e2a52
            } else {
              r = 0.86; g = 0.81; b = 0.92; // Lavender onesie #ddd0ea
            }
          } else if (y > 50) {
            // Nightcap & Star
            skinIndices[i * 4] = 1; // Head
            skinWeights[i * 4] = 0.8;
            skinIndices[i * 4 + 1] = 3; // Brow/Cap tip
            skinWeights[i * 4 + 1] = 0.2;

            if (y > 85) {
              r = 0.98; g = 0.82; b = 0.32; // Golden Star #facc15
            } else if (y >= 50 && y <= 58) {
              r = 0.98; g = 0.98; b = 1.0; // White brim band
            } else if (x > 8 && x < 28 && y > 56 && y < 68 && z > 15) {
              r = 0.98; g = 0.72; b = 0.82; // Pink bow
            } else {
              r = 0.62; g = 0.16; b = 0.32; // Berry nightcap #9e2a52
            }
          } else {
            // Facial Features & Jaw Articulation
            if (y >= 0 && y < 35 && z > 0) {
              skinIndices[i * 4] = 2; // Jaw
              skinWeights[i * 4] = 0.85;
              skinIndices[i * 4 + 1] = 1; // Head
              skinWeights[i * 4 + 1] = 0.15;
            } else {
              skinIndices[i * 4] = 1; // Head
              skinWeights[i * 4] = 1.0;
            }

            // High-definition facial landmarks:
            const dLeftEye = Math.hypot(x - (-32.5), y - 40.8, z - 39.5);
            const dRightEye = Math.hypot(x - 16.9, y - 37.7, z - 38.7);
            const dLeftCheek = Math.hypot(x - (-42), y - 22, z - 28);
            const dRightCheek = Math.hypot(x - 32, y - 20, z - 26);
            const dNose = Math.hypot(x - (-7.0), y - 29.0, z - 34.0);

            if (dLeftEye < 13.5 || dRightEye < 13.5) {
              r = 0.12; g = 0.08; b = 0.14; // Crisp Dark Eye Cavity
            } else if (dNose < 5.0) {
              r = 0.15; g = 0.10; b = 0.16; // Nasal Cavity
            } else if (dLeftCheek < 14 || dRightCheek < 14) {
              r = 0.96; g = 0.58; b = 0.68; // Rosy Cheek Blush
            } else if (y >= 12 && y <= 22 && Math.abs(x) < 12 && z > 25) {
              r = 0.28; g = 0.16; b = 0.18; // Crisp Smiling Mouth
            } else {
              r = 0.98; g = 0.95; b = 0.91; // Cream Skull
            }
          }

          colors[i * 3] = r;
          colors[i * 3 + 1] = g;
          colors[i * 3 + 2] = b;
        }

        geom.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
        geom.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Compatible Skeleton Bones
        const rootBone = new THREE.Bone();
        rootBone.name = 'RootBone';
        rootBone.position.set(0, -40, 0);

        const headBone = new THREE.Bone();
        headBone.name = 'HeadBone';
        headBone.position.set(0, 40, 0);
        rootBone.add(headBone);

        const jawBone = new THREE.Bone();
        jawBone.name = 'JawBone';
        jawBone.position.set(0, 15, 20);
        headBone.add(jawBone);

        const browBone = new THREE.Bone();
        browBone.name = 'BrowBone';
        browBone.position.set(0, 55, 10);
        headBone.add(browBone);

        bonesRef.current = { root: rootBone, head: headBone, jaw: jawBone, brow: browBone };

        const skeleton = new THREE.Skeleton([rootBone, headBone, jawBone, browBone]);

        // STRICTLY NO GLOW: emissive = 0x000000, emissiveIntensity = 0.0
        const mat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.55,
          metalness: 0.04,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0.0
        });

        const skinnedMesh = new THREE.SkinnedMesh(geom, mat);
        skinnedMesh.add(rootBone);
        skinnedMesh.bind(skeleton);

        // Scale to totally fill the desktop background scene
        const baseHeight = 190.0;
        const targetVisualHeight = 3.35;
        const scale = targetVisualHeight / baseHeight;
        skinnedMesh.scale.set(scale, scale, scale);
        babyGroup.add(skinnedMesh);

        // Subtle amber eye pinpricks (non-blooming, crisp dots)
        const eyeCoreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const eyeGeo = new THREE.SphereGeometry(3.0, 8, 8);

        const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeCoreMat);
        leftEyeMesh.position.set(-32.5, 40.8, 37.5);
        leftEyeMesh.scale.set(scale, scale, scale);
        headBone.add(leftEyeMesh);

        const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeCoreMat);
        rightEyeMesh.position.set(16.9, 37.7, 36.8);
        rightEyeMesh.scale.set(scale, scale, scale);
        headBone.add(rightEyeMesh);
      },
      undefined,
      (err) => console.error('Failed to load baby FBX for desktop background:', err)
    );

    // Pointer move listener for interactive head tracking and inactivity timer
    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseNormRef.current = { x: nx, y: ny };

      if (stateRef.current !== 'giggle') {
        stateRef.current = 'wondering';
        setActiveReaction('wondering');
      }

      resetInactivityTimer();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    resetInactivityTimer();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = Date.now();
      const bones = bonesRef.current;

      // Facial joint animations based on interactive states
      if (bones && bones.head && bones.jaw) {
        if (stateRef.current === 'giggle') {
          // 1. Giggle: Chattering jaw, joyful head bobbing
          const elapsed = (now - giggleStartRef.current) / 1000;
          bones.head.rotation.z = Math.sin(elapsed * 22) * 0.08;
          bones.head.rotation.x = -0.04 + Math.sin(elapsed * 26) * 0.04;
          bones.head.rotation.y = Math.sin(elapsed * 18) * 0.05;
          bones.jaw.rotation.x = 0.08 + Math.abs(Math.sin(elapsed * 28)) * 0.28;

          if (tearsGroupRef.current) tearsGroupRef.current.visible = false;
        } else if (stateRef.current === 'wondering') {
          // 2. Wondering: Head tilts inquisitively toward cursor, wondering brow
          const targetY = mouseNormRef.current.x * 0.22;
          const targetX = -mouseNormRef.current.y * 0.15;
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, targetY, 0.06);
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, targetX, 0.06);
          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, targetY * 0.35, 0.06);
          bones.jaw.rotation.x = THREE.MathUtils.lerp(bones.jaw.rotation.x, 0.04, 0.05);

          if (tearsGroupRef.current) tearsGroupRef.current.visible = false;
        } else if (stateRef.current === 'crying') {
          // 3. Cute Crying: Head slightly drooped, tremulous pout, sparkling tears
          const elapsed = now / 1000;
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, 0, 0.04);
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, 0.08 + Math.sin(elapsed * 6) * 0.02, 0.06);
          bones.head.rotation.z = Math.sin(elapsed * 8) * 0.03;
          bones.jaw.rotation.x = 0.03 + Math.abs(Math.sin(elapsed * 5)) * 0.05;

          if (tearsGroupRef.current) {
            tearsGroupRef.current.visible = true;
            leftTear.position.y = 0.25 - ((now % 1200) / 1200) * 0.35;
            rightTear.position.y = 0.22 - (((now + 500) % 1200) / 1200) * 0.35;
          }
        } else {
          // Idle resting state
          bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, 0, 0.03);
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, 0, 0.03);
          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, 0, 0.03);
          bones.jaw.rotation.x = THREE.MathUtils.lerp(bones.jaw.rotation.x, 0, 0.03);

          if (tearsGroupRef.current) tearsGroupRef.current.visible = false;
        }
      }

      sparkles.rotation.y += 0.001;
      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isNightMode]);

  return (
    <div
      onClick={handleBabyClick}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden select-none cursor-pointer"
      title="Pip, The Skull Baby! Click anywhere on the desktop to make me giggle! 🍼✨"
    >
      {/* Full-Screen 3D WebGL Background Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Nursery Speech Bubble */}
      {showSpeech && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-[#fffdf8] text-[#5c4033] border-3 border-[#a34063] font-bubblegum text-sm shadow-[4px_4px_0px_#a34063] max-w-md text-center pointer-events-none animate-in fade-in zoom-in-95 pixel-border">
          {speech}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fffdf8] border-r-3 border-b-3 border-[#a34063] rotate-45" />
        </div>
      )}

      {/* Playful Giggle Heart Pop */}
      {isGiggling && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none text-4xl animate-ping z-30">
          💖
        </div>
      )}

      {/* Discrete Corner Status Indicator */}
      <div className="absolute bottom-3 left-4 z-10 pointer-events-none flex items-center gap-2 bg-[#2a1d2e]/80 backdrop-blur-xs px-3 py-1 border border-[#a34063] text-[9px] font-pixel text-[#f9d77e]">
        <span className="w-2 h-2 rounded-full bg-[#facc15] animate-pulse" />
        <span>PIP • {activeReaction.toUpperCase()} MODE</span>
        <span className="text-stone-400 font-mono hidden md:inline">[TOUCH TO GIGGLE]</span>
      </div>
    </div>
  );
}
