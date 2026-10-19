import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Sparkles, RotateCw, Lightbulb, Sun, Eye, Sliders } from 'lucide-react';

/**
 * Lantern3DViewer.jsx
 * 
 * Renders the supplied Meshy AI Moon Lantern 3D model with TRUE, REALISTIC LIGHT EMISSION:
 * - Direct vector attachment of PointLight, Downward SpotLight, and Emissive Core to modelGroup
 * - UnrealBloomPass optical post-processing so emitted light radiates and bleeds into the surroundings
 * - Volumetric starlight halo sprite with Additive Blending
 * - Translucent moonstone glass material with rich transmission and vibrant emissive glow
 * - Emergence sequence: Starts almost invisible, then shrinks/springs up out of display box
 * - Free 360-degree rotation (mouse/touch drag + auto-rotation toggle)
 */
export default function Lantern3DViewer({
  isNightMode = true,
  currentColor = '#fbbf24',
  luminescence = 85,
  onColorChange = () => {}
}) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(10);
  const [isPixelated, setIsPixelated] = useState(true);
  const [pixelSize, setPixelSize] = useState(3);
  const [autoRotate, setAutoRotate] = useState(true);
  const [emergenceStage, setEmergenceStage] = useState('emerging'); // 'emerging' | 'floating'

  // Three.js object references
  const lanternModelRef = useRef(null);
  const coreMeshRef = useRef(null);
  const innerLightRef = useRef(null);
  const outerLightRef = useRef(null);
  const downwardSpotRef = useRef(null);
  const glowSpriteRef = useRef(null);
  const pixelPassRef = useRef(null);
  const bloomPassRef = useRef(null);
  const composerRef = useRef(null);
  const materialsRef = useRef([]);
  const animStartTimeRef = useRef(Date.now());
  const mouseStateRef = useRef({ isDown: false, prevX: 0, prevY: 0, rotX: 0.1, rotY: 0 });
  const luminescenceRef = useRef(luminescence);
  const colorRef = useRef(currentColor);
  luminescenceRef.current = luminescence;
  colorRef.current = currentColor;

  // Color presets matching the Nightlight catalog
  const colorPresets = [
    { name: 'Warm Amber', color: '#fbbf24', desc: '440Hz Dream Sleep' },
    { name: 'Lavender Dusk', color: '#c084fc', desc: 'Deep REM Slumber' },
    { name: 'Starlight Mint', color: '#6ee7b7', desc: 'Hypoallergenic Glow' },
    { name: 'Peachy Slumber', color: '#fda4af', desc: 'Warm Chamomile' },
    { name: 'Nebula Blue', color: '#93c5fd', desc: 'Sector 7 Skyway' }
  ];

  // Trigger emergence animation
  const retriggerEmergence = () => {
    animStartTimeRef.current = Date.now();
    setEmergenceStage('emerging');
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 3.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 2. Post Processing Pipeline with UnrealBloomPass (Calibrated to prevent whiteout)
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const pixelPass = new RenderPixelatedPass(pixelSize, scene, camera);
    pixelPass.normalEdgeStrength = 0.6;
    pixelPass.depthEdgeStrength = 0.3;
    pixelPassRef.current = pixelPass;
    composer.addPass(pixelPass);

    // UnrealBloomPass makes the lantern's emitted light bleed out into space realistically without blowing out
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.75, // bloom strength (balanced)
      0.4,  // bloom radius
      0.82  // bloom threshold
    );
    bloomPassRef.current = bloomPass;
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // 3. Environmental Lighting
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x221a30 : 0xfcf5ed,
      isNightMode ? 0.6 : 0.9
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedb, 0.7);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // 4. Retro Display Pedestal Box (where the lantern emerges from)
    const pedestalGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(1.15, 1.35, 0.28, 28);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x2b223a : 0xd8c8b8,
      roughness: 0.45,
      metalness: 0.25
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.0;
    pedestalGroup.add(baseMesh);

    // Target Hex Color
    const targetHex = parseInt(currentColor.replace('#', '0x'), 16);

    // Glowing Emitter Ring on Pedestal
    const ringGeo = new THREE.RingGeometry(0.7, 0.98, 28);
    const ringMat = new THREE.MeshBasicMaterial({
      color: targetHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.85;
    pedestalGroup.add(ringMesh);
    scene.add(pedestalGroup);

    // 5. Build Model Container (with all Light Emitting Vectors attached!)
    const modelGroup = new THREE.Group();
    lanternModelRef.current = modelGroup;
    scene.add(modelGroup);

    // Initial state: almost invisible, sunken deep inside display box
    modelGroup.position.set(0, -1.3, 0);
    modelGroup.scale.set(0.01, 0.01, 0.01);

    // A. Internal Glowing Core / Bulb (Physical Emitting Mesh)
    const coreGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: targetHex,
      transparent: true,
      opacity: 0.95
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0.2, 0);
    modelGroup.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // B. Inner PointLight (Illuminates the inside and outer glass)
    // NOTE: castShadow is FALSE so the lantern geometry does NOT block its own light!
    const initLum = luminescenceRef.current / 100;
    const innerLight = new THREE.PointLight(targetHex, initLum * 2.2, 10, 1.2);
    innerLight.position.set(0, 0.2, 0);
    innerLight.castShadow = false;
    modelGroup.add(innerLight);
    innerLightRef.current = innerLight;

    // C. Outer Radiant Light (Casts wide starlight across the room and scene)
    const outerLight = new THREE.PointLight(targetHex, initLum * 1.5, 12, 1.5);
    outerLight.position.set(0, 0.35, 0);
    outerLight.castShadow = false;
    modelGroup.add(outerLight);
    outerLightRef.current = outerLight;

    // D. Downward SpotLight (Bathes the pedestal in vibrant emitted light pool!)
    const downwardSpot = new THREE.SpotLight(targetHex, initLum * 4.0, 8, Math.PI / 2.5, 0.6, 1.0);
    downwardSpot.position.set(0, 0.1, 0);
    downwardSpot.target = baseMesh;
    modelGroup.add(downwardSpot);
    downwardSpotRef.current = downwardSpot;

    // E. Volumetric Glowing Halo Sprite (Visible physical light aura)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    const grad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, currentColor);
    grad.addColorStop(0.65, currentColor + '88');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    gCtx.fillStyle = grad;
    gCtx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
      })
    );
    glowSprite.scale.set(2.6, 2.6, 2.6);
    glowSprite.position.set(0, 0.2, 0);
    modelGroup.add(glowSprite);
    glowSpriteRef.current = glowSprite;

    // Floating Stardust Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 45;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 3.8;
      posArray[i + 1] = Math.random() * 2.5 - 0.8;
      posArray[i + 2] = (Math.random() - 0.5) * 3.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: targetHex,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. Load the Supplied Meshy AI 3D Lantern Model (FBX + Textures)
    const textureLoader = new THREE.TextureLoader();
    const diffuseMap = textureLoader.load('/models/lantern/Meshy_AI_Dream_Moon_Lantern_1019084302_texture.png');
    const normalMap = textureLoader.load('/models/lantern/Meshy_AI_Dream_Moon_Lantern_1019084302_texture_normal.png');
    const roughnessMap = textureLoader.load('/models/lantern/Meshy_AI_Dream_Moon_Lantern_1019084302_texture_roughness.png');
    const metallicMap = textureLoader.load('/models/lantern/Meshy_AI_Dream_Moon_Lantern_1019084302_texture_metallic.png');
    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    const fbxLoader = new FBXLoader();

    fbxLoader.load(
      '/models/lantern/Meshy_AI_Dream_Moon_Lantern_1019084302_texture.fbx',
      (fbx) => {
        // Compute bounding box to normalize scale and center
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 1.7 / (maxDim || 1);

        fbx.position.x = -center.x * targetScale;
        fbx.position.y = -center.y * targetScale;
        fbx.position.z = -center.z * targetScale;
        fbx.scale.setScalar(targetScale);

        // Apply Translucent Moonstone Material with Active Emissive Light
        const activeMats = [];
        fbx.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false; // Prevents blocking its own light!
            child.receiveShadow = false;

            const translucentMat = new THREE.MeshStandardMaterial({
              map: diffuseMap,
              normalMap: normalMap,
              roughnessMap: roughnessMap,
              metalnessMap: metallicMap,
              transparent: true,
              opacity: 0.1, // starts faint
              roughness: 0.2,
              metalness: 0.15,
              emissive: new THREE.Color(targetHex),
              emissiveIntensity: 2.5 // Vibrant emissive output!
            });

            child.material = translucentMat;
            activeMats.push(translucentMat);
          }
        });

        materialsRef.current = activeMats;
        modelGroup.add(fbx);

        setIsLoading(false);
        animStartTimeRef.current = Date.now();
        setEmergenceStage('emerging');
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.min(95, Math.round((xhr.loaded / xhr.total) * 100)));
        }
      },
      (error) => {
        console.warn('Fallback to procedural high-detail Moon Lantern:', error);
        const fallbackLantern = createProceduralMoonLantern(diffuseMap, targetHex);
        modelGroup.add(fallbackLantern);
        materialsRef.current = [fallbackLantern.userData.material];
        setIsLoading(false);
        animStartTimeRef.current = Date.now();
      }
    );

    // 7. Mouse / Touch Drag to Rotate in 360 Degrees
    const handlePointerDown = (e) => {
      mouseStateRef.current.isDown = true;
      mouseStateRef.current.prevX = e.clientX;
      mouseStateRef.current.prevY = e.clientY;
    };

    const handlePointerMove = (e) => {
      if (!mouseStateRef.current.isDown) return;
      const dx = e.clientX - mouseStateRef.current.prevX;
      const dy = e.clientY - mouseStateRef.current.prevY;
      mouseStateRef.current.prevX = e.clientX;
      mouseStateRef.current.prevY = e.clientY;

      mouseStateRef.current.rotY += dx * 0.012;
      mouseStateRef.current.rotX = Math.max(-0.6, Math.min(0.8, mouseStateRef.current.rotX + dy * 0.01));
    };

    const handlePointerUp = () => {
      mouseStateRef.current.isDown = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 8. Animation Loop with Emergence Transition & Active Light Emission
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = Date.now();
      const elapsed = (now - animStartTimeRef.current) / 1000;
      const DURATION = 2.0;
      const progress = Math.min(1.0, elapsed / DURATION);

      // Smooth easeOutBack curve for springing up
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const easeProgress = progress === 1 ? 1 : 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);

      if (modelGroup) {
        if (progress < 1.0) {
          // 1. Rising up out of the display box: y from -1.3 to 0.15
          modelGroup.position.y = -1.3 + 1.45 * easeProgress;

          // 2. Scale expands smoothly to full scale: 0.05 to 1.0
          const curScale = Math.max(0.02, easeProgress);
          modelGroup.scale.set(curScale, curScale, curScale);

          // 3. Opacity transitions from almost invisible (0.05) to translucent (0.85)
          const curOpacity = 0.05 + 0.8 * progress;
          materialsRef.current.forEach((mat) => {
            if (mat) {
              mat.opacity = curOpacity;
              mat.emissiveIntensity = (0.2 + 2.0 * progress) * (luminescenceRef.current / 100);
            }
          });

          // 4. Emitted Light Ramps up smoothly
          const curLum = (luminescenceRef.current / 100) * (0.2 + 0.8 * progress);
          if (innerLightRef.current) innerLightRef.current.intensity = curLum * 2.2;
          if (outerLightRef.current) outerLightRef.current.intensity = curLum * 1.5;
          if (downwardSpotRef.current) downwardSpotRef.current.intensity = curLum * 4.0;
          if (glowSpriteRef.current) glowSpriteRef.current.material.opacity = Math.min(0.85, 0.1 + 0.5 * curLum);

          modelGroup.rotation.y = progress * Math.PI * 2 + mouseStateRef.current.rotY;
          modelGroup.rotation.x = mouseStateRef.current.rotX;
        } else {
          // EMERGENCE COMPLETE: Fully out of the box, floating and free to rotate!
          if (emergenceStage !== 'floating') {
            setEmergenceStage('floating');
          }

          // Gentle floating levitation bob
          const floatOffset = Math.sin(now * 0.002) * 0.06;
          modelGroup.position.y = 0.15 + floatOffset;

          // Auto-rotation when not dragging
          if (autoRotate && !mouseStateRef.current.isDown) {
            mouseStateRef.current.rotY += 0.008;
          }

          modelGroup.rotation.y = mouseStateRef.current.rotY;
          modelGroup.rotation.x = mouseStateRef.current.rotX;

          // Breathing realistic light emission pulse driven by real-time luminescenceRef
          const breath = 1.0 + Math.sin(now * 0.0035) * 0.15;
          const activeLum = (luminescenceRef.current / 100) * breath;
          if (innerLightRef.current) innerLightRef.current.intensity = activeLum * 2.2;
          if (outerLightRef.current) outerLightRef.current.intensity = activeLum * 1.5;
          if (downwardSpotRef.current) downwardSpotRef.current.intensity = activeLum * 4.0;
          if (glowSpriteRef.current) glowSpriteRef.current.material.opacity = Math.min(0.85, 0.25 + 0.4 * activeLum);

          materialsRef.current.forEach((mat) => {
            if (mat) {
              mat.emissiveIntensity = activeLum * 2.0;
            }
          });
        }
      }

      particleSystem.rotation.y += 0.001;

      // Render via Post-Processing Composer (Pixelated + Bloom)
      if (composerRef.current) {
        composerRef.current.render();
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isNightMode, isPixelated, pixelSize]);

  // Update light color and emissive properties when color or luminescence changes
  useEffect(() => {
    const hex = parseInt(currentColor.replace('#', '0x'), 16);
    const activeLum = luminescence / 100;

    if (innerLightRef.current) {
      innerLightRef.current.color.setHex(hex);
      innerLightRef.current.intensity = activeLum * 2.2;
    }
    if (outerLightRef.current) {
      outerLightRef.current.color.setHex(hex);
      outerLightRef.current.intensity = activeLum * 1.5;
    }
    if (downwardSpotRef.current) {
      downwardSpotRef.current.color.setHex(hex);
      downwardSpotRef.current.intensity = activeLum * 4.0;
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.material.color.setHex(hex);
    }
    materialsRef.current.forEach((mat) => {
      if (mat) {
        mat.emissive.setHex(hex);
        mat.emissiveIntensity = activeLum * 2.0;
        mat.needsUpdate = true;
      }
    });
  }, [currentColor, luminescence]);

  // Update pixel pass resolution
  useEffect(() => {
    if (pixelPassRef.current) {
      pixelPassRef.current.setPixelSize(pixelSize);
    }
  }, [pixelSize]);

  return (
    <div className="space-y-3 font-silkscreen select-none">
      {/* 3D Canvas Box with Retro 3D Bevels */}
      <div className="relative w-full h-72 sm:h-80 bg-[#120f18] border-4 border-[#3a2e37] overflow-hidden select-none pixel-border">
        {/* Mount container for Three.js WebGL canvas */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#16121e]/90 flex flex-col items-center justify-center gap-2 text-amber-300 font-pixel text-[10px] z-20">
            <Sparkles size={24} className="animate-spin text-amber-400" />
            <div className="tracking-widest">IGNITING 3D MOON LANTERN...</div>
            <div className="w-48 h-3 bg-stone-800 border-2 border-stone-500 p-0.5 pixel-box">
              <div
                style={{ width: `${loadProgress}%` }}
                className="h-full bg-amber-400 transition-all duration-300"
              />
            </div>
            <span className="font-silkscreen text-[9px] text-stone-400">
              Loading 3D Meshy Model & Textures ({loadProgress}%)
            </span>
          </div>
        )}

        {/* Status Pills Overlaid on 3D View */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="bg-[#a34063] text-white px-2 py-0.5 text-[8px] font-pixel border border-white/40 shadow pixel-btn flex items-center gap-1">
            <Lightbulb size={10} className="text-amber-300 animate-pulse" />
            <span>3D MOON LANTERN</span>
          </span>
          <span className="bg-black/75 text-amber-300 px-2 py-0.5 text-[8px] font-pixel border border-amber-400/30">
            {emergenceStage === 'emerging' ? '✨ SHRINKING UP...' : '💫 FREE 360° ROTATION'}
          </span>
        </div>

        {/* Top-Right Quick View Controls */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Spin"
            className={`p-1 text-[9px] border pixel-btn ${
              autoRotate ? 'bg-[#a34063] text-white border-pink-400' : 'bg-stone-800 text-stone-300 border-stone-600'
            }`}
          >
            <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={retriggerEmergence}
            title="Re-trigger Emergence Animation (Almost invisible -> Shrinks up out of box)"
            className="px-2 py-1 text-[8px] font-pixel bg-[#ffd1dc] text-[#a34063] border border-[#a34063] hover:bg-white pixel-btn"
          >
            RE-EMERGE ✨
          </button>
        </div>
      </div>

      {/* Control Strip & Color Calibration Presets */}
      <div className="p-3 bg-[#ede7df] border-2 border-stone-400 pixel-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-300 pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-[#a34063]" />
            <span className="font-pixel text-[9px] text-[#5c4033]">
              LANTERN EMITTED LIGHT COLOR & LUMINESCENCE
            </span>
          </div>

          {/* Pixel Size Controller */}
          <div className="flex items-center gap-2 text-[8px] font-pixel text-stone-600">
            <span>PIXEL RESOLUTION:</span>
            {[2, 3, 5, 7].map((size) => (
              <button
                key={size}
                onClick={() => setPixelSize(size)}
                className={`px-1.5 py-0.5 border pixel-btn ${
                  pixelSize === size ? 'bg-[#a34063] text-white font-bold' : 'bg-white text-stone-700'
                }`}
              >
                {size}x
              </button>
            ))}
          </div>
        </div>

        {/* Luminescence / Emission Slider */}
        <div className="flex items-center gap-3">
          <Sun size={15} className="text-amber-600 shrink-0" />
          <span className="font-pixel text-[8px] text-stone-700 w-28 shrink-0">
            EMISSION: {luminescence}%
          </span>
          <input
            type="range"
            min="20"
            max="120"
            value={luminescence}
            onChange={(e) => onColorChange(currentColor, Number(e.target.value))}
            className="w-full accent-[#a34063] cursor-pointer"
          />
        </div>

        {/* Color Palette Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {colorPresets.map((preset) => {
            const isSelected = currentColor.toLowerCase() === preset.color.toLowerCase();
            return (
              <button
                key={preset.name}
                onClick={() => onColorChange(preset.color, luminescence)}
                className={`p-2 text-left border-2 transition-all pixel-btn ${
                  isSelected
                    ? 'bg-white border-[#a34063] shadow-md scale-[1.02]'
                    : 'bg-[#faf7f2] hover:bg-white border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    style={{ backgroundColor: preset.color }}
                    className="w-4 h-4 border border-black shadow-inner shrink-0"
                  />
                  <span className="font-pixel text-[8px] text-stone-800 truncate">{preset.name}</span>
                </div>
                <div className="text-[8px] font-silkscreen text-stone-500 truncate">{preset.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback Procedural Moon Lantern
 */
function createProceduralMoonLantern(textureMap, targetHex) {
  const group = new THREE.Group();

  const lanternMat = new THREE.MeshStandardMaterial({
    map: textureMap,
    color: 0xffffff,
    emissive: new THREE.Color(targetHex),
    emissiveIntensity: 2.5,
    transparent: true,
    opacity: 0.85,
    roughness: 0.2,
    metalness: 0.15
  });
  group.userData.material = lanternMat;

  // Glass globe
  const globe = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 2), lanternMat);
  group.add(globe);

  // Crescent Moon Inside
  const moon = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.12, 12, 24, Math.PI * 1.3),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: new THREE.Color(targetHex),
      emissiveIntensity: 3.0
    })
  );
  moon.rotation.z = Math.PI / 4;
  group.add(moon);

  // Roof & Base
  const capMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.5 });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.45, 8), capMat);
  roof.position.y = 0.8;
  group.add(roof);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.25, 8), capMat);
  base.position.y = -0.75;
  group.add(base);

  return group;
}
