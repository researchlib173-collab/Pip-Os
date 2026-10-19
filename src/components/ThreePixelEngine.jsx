import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * ThreePixelEngine.jsx
 * Built using patterns from `cloudai-x/threejs-skills` (threejs-postprocessing, threejs-materials, threejs-interaction)
 * Renders an interactive 3D nursery scene processed through Three.js RenderPixelatedPass for genuine real-time pixel art!
 */
export default function ThreePixelEngine({ isNightMode, onPlayNote }) {
  const mountRef = useRef(null);
  const [pixelSize, setPixelSize] = useState(4);
  const [isRotating, setIsRotating] = useState(true);

  // References to keep across renders
  const sceneRef = useRef(null);
  const pixelPassRef = useRef(null);
  const moonGroupRef = useRef(null);
  const starsGroupRef = useRef(null);
  const lanternLightRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 220;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);

    // 2. WebGLRenderer with pixel ratio 1 for true retro pixelation
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Post-Processing: RenderPixelatedPass (from cloudai-x/threejs-skills)
    const composer = new EffectComposer(renderer);
    const pixelPass = new RenderPixelatedPass(pixelSize, scene, camera);
    pixelPass.normalEdgeStrength = 0.8;
    pixelPass.depthEdgeStrength = 0.4;
    pixelPassRef.current = pixelPass;

    composer.addPass(pixelPass);
    composer.addPass(new OutputPass());

    // 4. Lighting (from threejs-lighting skill)
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x3d3056 : 0xffebd9,
      isNightMode ? 1.4 : 1.8
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0d4, 2.0);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const lanternLight = new THREE.PointLight(0xf59e0b, 3.5, 6, 2);
    lanternLight.position.set(0, 0.4, 0.5);
    scene.add(lanternLight);
    lanternLightRef.current = lanternLight;

    // 5. Build 3D Pixel Art Objects (Crescent Moon, Starfield, Cloud Platform, Lantern)
    // A. Crescent Moon
    const moonGroup = new THREE.Group();
    const moonGeo = new THREE.TorusGeometry(0.8, 0.28, 12, 24, Math.PI * 1.2);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf9d77e,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.rotation.z = Math.PI / 4;
    moonGroup.add(moonMesh);
    moonGroup.position.set(1.1, 0.6, -0.4);
    scene.add(moonGroup);
    moonGroupRef.current = moonGroup;

    // B. Fluffy Low-Poly Cloud Platform
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0xd0c4de : 0xffffff,
      roughness: 0.8
    });
    const puffGeos = [
      { r: 0.6, pos: [-0.6, -0.6, 0] },
      { r: 0.75, pos: [0, -0.5, 0.2] },
      { r: 0.65, pos: [0.65, -0.6, -0.1] },
      { r: 0.5, pos: [-0.2, -0.7, 0.5] }
    ];
    puffGeos.forEach((p) => {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(p.r, 1), cloudMat);
      puff.position.set(...p.pos);
      cloudGroup.add(puff);
    });
    scene.add(cloudGroup);

    // C. Glowing Golden Nursery Lantern
    const lanternGroup = new THREE.Group();
    const lanternBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.24, 0.4, 8),
      new THREE.MeshStandardMaterial({
        color: 0xfde68a,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
      })
    );
    const lanternRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x5c4033 })
    );
    lanternRoof.position.y = 0.3;
    lanternGroup.add(lanternBody);
    lanternGroup.add(lanternRoof);
    lanternGroup.position.set(-0.55, 0.1, 0.6);
    scene.add(lanternGroup);

    // D. Low-Poly Floating Stars
    const starsGroup = new THREE.Group();
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    for (let i = 0; i < 16; i++) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), starMat);
      star.position.set(
        (Math.random() - 0.5) * 4.5,
        Math.random() * 2.2 - 0.2,
        (Math.random() - 0.5) * 2.5
      );
      starsGroup.add(star);
    }
    scene.add(starsGroup);
    starsGroupRef.current = starsGroup;

    // 6. Mouse Interaction Dragging (from threejs-interaction skill)
    let isMouseDown = false;
    let prevMouseX = 0;
    let rotationVelocity = 0.005;

    const handleMouseDown = (e) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      scene.rotation.y += deltaX * 0.008;
      prevMouseX = e.clientX;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 7. Animation Loop with time-based delta
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animations
      if (moonGroupRef.current) {
        moonGroupRef.current.position.y = 0.6 + Math.sin(elapsedTime * 1.5) * 0.08;
        moonGroupRef.current.rotation.y += 0.006;
      }

      if (lanternGroup) {
        lanternGroup.position.y = 0.1 + Math.sin(elapsedTime * 2.0) * 0.04;
        lanternGroup.rotation.z = Math.sin(elapsedTime * 2.5) * 0.06;
      }

      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y -= 0.003;
      }

      // Auto rotation when enabled and not dragging
      if (isRotating && !isMouseDown) {
        scene.rotation.y += rotationVelocity;
      }

      composer.render();
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isNightMode]);

  // Update live pixelation size
  useEffect(() => {
    if (pixelPassRef.current) {
      pixelPassRef.current.setPixelSize(pixelSize);
    }
  }, [pixelSize]);

  return (
    <div className="relative border-4 border-[#3a2e37] bg-[#16121e] rounded-sm overflow-hidden select-none">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-52 sm:h-60 cursor-grab active:cursor-grabbing pixel-art"
        onClick={() => onPlayNote && onPlayNote(659.25)}
        title="Click & Drag to rotate the 3D Pixel Realm!"
      />

      {/* Retro Pixel UI Overlay Controls */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 font-pixel text-[9px] text-[#f9d77e] bg-black/75 px-2 py-1 border border-[#f9d77e] shadow">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span>3D PIXEL REALM [THREE.JS]</span>
      </div>

      {/* Pixel Size Modifier Controller */}
      <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between font-silkscreen text-[10px] text-white bg-black/80 px-2.5 py-1.5 border border-stone-600 rounded">
        <div className="flex items-center gap-2">
          <span className="text-[#f9d77e]">PIXEL_RES:</span>
          <div className="flex gap-1">
            {[2, 4, 6, 8].map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setPixelSize(size);
                }}
                className={`px-1.5 py-0.5 border font-pixel text-[8px] transition-all ${
                  pixelSize === size
                    ? 'bg-[#a34063] border-white text-white font-bold'
                    : 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700'
                }`}
              >
                {size}x
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRotating(!isRotating);
          }}
          className={`px-2 py-0.5 border font-silkscreen text-[9px] ${
            isRotating ? 'bg-emerald-900 border-emerald-400 text-emerald-200' : 'bg-stone-800 border-stone-500 text-stone-300'
          }`}
        >
          {isRotating ? '▶ SPIN: ON' : '⏸ SPIN: OFF'}
        </button>
      </div>
    </div>
  );
}
