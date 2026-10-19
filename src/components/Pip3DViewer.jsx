import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Sparkles, Heart, Smile, HelpCircle } from 'lucide-react';

/**
 * Pip3DViewer.jsx
 * 
 * Interactive 3D Model of Pip, The Skull Baby (Junior Dream Engineer):
 * - Loads the downloaded FBX baby model (Meshy_AI_Pip's_Moonlit_Lulla_1019095642_generate.fbx).
 * - Baby remains completely STATIC in position and overall body placement.
 * - Compatible joint rigging targeting facial anatomy (jaw, head, brow, glowing eye pinpricks).
 * - Three interactive reaction states:
 *   1. Touch/Click -> Giggling (chattering jaw, joyful eye glow, playful chime audio).
 *   2. Hover -> Wondering expression (inquisitive head tilt, parted mouth, curious gaze).
 *   3. Stationary Cursor -> Cute crying (gentle drooping head, tremulous pout, sparkling tears).
 * - Priority: Click (Giggle) > Hover (Wondering) > Inactivity (Crying) > Resting (Idle).
 */
export default function Pip3DViewer({
  isNightMode = true,
  onPipClick = () => {}
}) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(15);
  const [interactionState, setInteractionState] = useState('idle'); // 'idle' | 'hover' | 'crying' | 'giggle'

  // Three.js object references
  const bonesRef = useRef({ root: null, head: null, jaw: null, brow: null });
  const eyeLightsRef = useRef([]);
  const tearsGroupRef = useRef(null);
  const composerRef = useRef(null);
  const mouseStateRef = useRef({ isDown: false, prevX: 0, prevY: 0, rotX: 0.08, rotY: 0 });
  const stateRef = useRef('idle');
  const isHoveringRef = useRef(false);
  const inactivityTimerRef = useRef(null);
  const giggleTimerRef = useRef(null);
  const giggleStartTimeRef = useRef(0);

  // Synchronize stateRef with interactionState
  const setReactionState = (newState) => {
    stateRef.current = newState;
    setInteractionState(newState);
  };

  // Playful giggle audio playback (.wav supplied by user) with chime synth fallback
  const playGiggleSound = () => {
    try {
      const audio = new Audio('/audio/giggle.wav');
      audio.volume = 0.9;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback to Web Audio synthesis if autoplay requires user gesture
        playGiggleChimeSynth();
      });
    } catch {
      playGiggleChimeSynth();
    }
  };

  const playGiggleChimeSynth = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const notes = [587.33, 739.99, 880.0, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.14);
      });
    } catch {}
  };

  // Trigger Giggle state (highest priority)
  const triggerGiggle = () => {
    if (giggleTimerRef.current) {
      clearTimeout(giggleTimerRef.current);
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    giggleStartTimeRef.current = Date.now();
    setReactionState('giggle');
    playGiggleSound();
    onPipClick();

    giggleTimerRef.current = setTimeout(() => {
      if (isHoveringRef.current) {
        setReactionState('hover');
        resetInactivityTimer();
      } else {
        setReactionState('idle');
      }
    }, 1200);
  };

  // Reset stationary cursor inactivity detection
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (isHoveringRef.current && stateRef.current !== 'giggle') {
      inactivityTimerRef.current = setTimeout(() => {
        if (isHoveringRef.current && stateRef.current !== 'giggle') {
          setReactionState('crying');
        }
      }, 2500); // 2.5 seconds of stationary cursor
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 3.9);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. Post Processing Pipeline (RenderPixelatedPass without bloom)
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const pixelPass = new RenderPixelatedPass(3, scene, camera);
    pixelPass.normalEdgeStrength = 0.6;
    pixelPass.depthEdgeStrength = 0.3;
    composer.addPass(pixelPass);
    composer.addPass(new OutputPass());

    // 3. Environmental Lighting
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x241d33 : 0xfcf6ee,
      isNightMode ? 0.85 : 1.25
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedb, 1.1);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb0a8d6, 0.5);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);

    // 4. Nursery Display Pedestal Base (Static foundation)
    const pedestalGroup = new THREE.Group();
    const pedestalBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.4, 0.28, 28),
      new THREE.MeshStandardMaterial({
        color: isNightMode ? 0x241b30 : 0xd8c8b8,
        roughness: 0.5,
        metalness: 0.2
      })
    );
    pedestalBase.position.y = -1.15;
    pedestalGroup.add(pedestalBase);

    // Glowing Starlight Pedestal Ring
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 1.1, 28),
      new THREE.MeshBasicMaterial({
        color: 0xf9d77e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      })
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.0;
    pedestalGroup.add(ringMesh);
    scene.add(pedestalGroup);

    // 5. Model Container: MUST REMAIN COMPLETELY STATIC IN POSITION AND PLACEMENT
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, -0.05, 0); // Completely static placement
    scene.add(modelGroup);

    // Floating Starlight Sparkles (twinkle around Pip without moving Pip's body)
    const sparkleGeo = new THREE.BufferGeometry();
    const sparkleCount = 40;
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePos[i] = (Math.random() - 0.5) * 3.6;
      sparklePos[i + 1] = Math.random() * 2.6 - 0.8;
      sparklePos[i + 2] = (Math.random() - 0.5) * 3.4;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xf9d77e,
      transparent: true,
      opacity: 0.8
    });
    const sparkleSystem = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkleSystem);

    // Cute Teardrop Particles for Crying State
    const tearGroup = new THREE.Group();
    tearGroup.visible = false;
    tearsGroupRef.current = tearGroup;

    const tearGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const tearMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.85
    });
    const tearDrops = [];
    for (let t = 0; t < 6; t++) {
      const drop = new THREE.Mesh(tearGeo, tearMat);
      drop.position.set(
        t % 2 === 0 ? -0.32 : 0.22,
        0.35 - (t * 0.08),
        0.55
      );
      tearGroup.add(drop);
      tearDrops.push(drop);
    }
    modelGroup.add(tearGroup);

    // 6. Load Downloaded Baby FBX Model & Construct Compatible Joint Rigging
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/models/pip/pip_baby.fbx',
      (fbx) => {
        fbx.updateMatrixWorld(true);

        // Find child mesh in FBX hierarchy
        let rawMesh = null;
        fbx.traverse((child) => {
          if (child.isMesh && !rawMesh) {
            rawMesh = child;
          }
        });

        if (!rawMesh) {
          console.error('FBX mesh not found in pip_baby.fbx');
          setIsLoading(false);
          return;
        }

        // Clone geometry and apply world matrix of original node
        const geom = rawMesh.geometry.clone().applyMatrix4(rawMesh.matrixWorld);
        geom.computeVertexNormals();

        const pos = geom.attributes.position;
        const vertexCount = pos.count;

        // Construct skin weights tailored specifically to the baby model's anatomy:
        // - RootBone: stationary body / base (y < 0) gets 100% weight, keeping body 100% static!
        // - HeadBone: base of skull / cranium (y >= 0)
        // - JawBone: lower jaw / mouth region (0 <= y < 35 && z > 0)
        // - BrowBone: upper facial / nightcap region (y >= 35)
        const skinIndices = new Float32Array(vertexCount * 4);
        const skinWeights = new Float32Array(vertexCount * 4);

        for (let i = 0; i < vertexCount; i++) {
          const y = pos.getY(i);
          const z = pos.getZ(i);

          if (y < 0) {
            // Body: 100% RootBone (strictly stationary)
            skinIndices[i * 4] = 0;
            skinWeights[i * 4] = 1.0;
          } else if (y >= 0 && y < 35 && z > 0) {
            // Lower jaw / mouth region
            skinIndices[i * 4] = 2; // JawBone
            skinWeights[i * 4] = 0.85;
            skinIndices[i * 4 + 1] = 1; // HeadBone
            skinWeights[i * 4 + 1] = 0.15;
          } else if (y >= 35) {
            // Upper head / brow / nightcap
            skinIndices[i * 4] = 1; // HeadBone
            skinWeights[i * 4] = 0.75;
            skinIndices[i * 4 + 1] = 3; // BrowBone
            skinWeights[i * 4 + 1] = 0.25;
          } else {
            // Base skull / cranium
            skinIndices[i * 4] = 1; // HeadBone
            skinWeights[i * 4] = 1.0;
          }
        }

        geom.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
        geom.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));

        // Exact Hackathon Avatar Coloring mapped across the FBX mesh geometry
        const colors = new Float32Array(vertexCount * 3);
        for (let i = 0; i < vertexCount; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const z = pos.getZ(i);

          let r = 1.0, g = 0.97, b = 0.94; // Default Skull Warm Cream (#fff8f1)

          if (y < 0) {
            // Body Pajamas / Onesie (#ddd2eb Lavender Slumber)
            // Center buttons
            if (Math.abs(x) < 5.5 && y > -65 && y < -10 && z > 15) {
              // Rich Berry buttons (#a34063)
              r = 0.64; g = 0.25; b = 0.39;
            } else {
              // Cozy lavender onesie
              r = 0.87; g = 0.82; b = 0.92;
            }
          } else if (y > 50) {
            // Nightcap region
            if (y > 85) {
              // Golden Starlight crystal tip (#f9d77e)
              r = 0.98; g = 0.84; b = 0.49;
            } else if (y >= 50 && y <= 58) {
              // Fluffy Cloud White fleece brim band (#ffffff)
              r = 0.98; g = 0.98; b = 1.0;
            } else if (x > 8 && x < 28 && y > 56 && y < 68 && z > 15) {
              // Powder Pink Bow (#ffd1dc)
              r = 1.0; g = 0.82; b = 0.86;
            } else {
              // Rich Berry nightcap body (#a34063)
              r = 0.64; g = 0.25; b = 0.39;
            }
          } else {
            // Face & Skull
            const dLeftEye = Math.hypot(x - (-32.5), y - 40.8, z - 39.5);
            const dRightEye = Math.hypot(x - 16.9, y - 37.7, z - 38.7);
            const dLeftCheek = Math.hypot(x - (-42), y - 22, z - 28);
            const dRightCheek = Math.hypot(x - 32, y - 20, z - 26);

            if (dLeftEye < 13 || dRightEye < 13) {
              // Deep Plum Charcoal eye sockets (#24182b)
              r = 0.14; g = 0.10; b = 0.17;
            } else if (dLeftCheek < 14 || dRightCheek < 14) {
              // Rosy Pink Blush (#fda4af)
              r = 0.99; g = 0.65; b = 0.70;
            } else if (y >= 12 && y <= 22 && Math.abs(x) < 12 && z > 25) {
              // Mouth cavity / smile (#5c4033)
              r = 0.36; g = 0.25; b = 0.20;
            } else {
              // Warm Cream Skull porcelain (#fff8f1)
              r = 1.0; g = 0.97; b = 0.94;
            }
          }

          colors[i * 3] = r;
          colors[i * 3 + 1] = g;
          colors[i * 3 + 2] = b;
        }

        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Compatible Skeleton
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

        // Faithful Hackathon Avatar Material with Vertex Colors
        const babyMaterial = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.52,
          metalness: 0.04,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0.0,
          transparent: false
        });

        const skinnedMesh = new THREE.SkinnedMesh(geom, babyMaterial);
        skinnedMesh.add(rootBone);
        skinnedMesh.bind(skeleton);

        // Normalize scale and fit to frame (~2.4 units height)
        const targetScale = 2.4 / 190.0;
        skinnedMesh.scale.set(targetScale, targetScale, targetScale);
        modelGroup.add(skinnedMesh);

        // Attached Glowing Amber Eye Pinpricks (children of headBone so they move with expressions)
        const eyeCoreMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
        const eyeGeo = new THREE.SphereGeometry(3.5, 12, 12);

        // Left Eye
        const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeCoreMat);
        leftEyeMesh.position.set(-28, 2, 28);
        headBone.add(leftEyeMesh);

        const leftEyeLight = new THREE.PointLight(0xf59e0b, 1.5, 35);
        leftEyeLight.position.set(-28, 2, 32);
        leftEyeLight.castShadow = false;
        headBone.add(leftEyeLight);

        // Right Eye
        const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeCoreMat);
        rightEyeMesh.position.set(16, 0, 26);
        headBone.add(rightEyeMesh);

        const rightEyeLight = new THREE.PointLight(0xf59e0b, 1.5, 35);
        rightEyeLight.position.set(16, 0, 30);
        rightEyeLight.castShadow = false;
        headBone.add(rightEyeLight);

        eyeLightsRef.current = [leftEyeLight, rightEyeLight];

        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.min(95, Math.round((xhr.loaded / xhr.total) * 100)));
        }
      },
      (error) => {
        console.error('Error loading baby FBX:', error);
        setIsLoading(false);
      }
    );

    // 7. Mouse & Touch Event Handlers
    const handlePointerDown = (e) => {
      mouseStateRef.current.isDown = true;
      mouseStateRef.current.prevX = e.clientX;
      mouseStateRef.current.prevY = e.clientY;
      triggerGiggle();
    };

    const handlePointerMove = (e) => {
      // Free manual rotation inspection when dragging
      if (mouseStateRef.current.isDown) {
        const dx = e.clientX - mouseStateRef.current.prevX;
        const dy = e.clientY - mouseStateRef.current.prevY;
        mouseStateRef.current.prevX = e.clientX;
        mouseStateRef.current.prevY = e.clientY;

        mouseStateRef.current.rotY += dx * 0.012;
        mouseStateRef.current.rotX = Math.max(-0.4, Math.min(0.45, mouseStateRef.current.rotX + dy * 0.01));
      }

      // Cursor movement interrupts crying immediately!
      if (stateRef.current === 'crying') {
        setReactionState('hover');
      }

      resetInactivityTimer();
    };

    const handlePointerUp = () => {
      mouseStateRef.current.isDown = false;
    };

    const handlePointerEnter = () => {
      isHoveringRef.current = true;
      if (stateRef.current !== 'giggle') {
        setReactionState('hover');
      }
      resetInactivityTimer();
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (stateRef.current !== 'giggle') {
        setReactionState('idle');
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 8. Animation Loop (Rig Articulation & State Transitions)
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = Date.now();
      const bones = bonesRef.current;

      // Model body position remains COMPLETELY STATIC at all times
      if (modelGroup) {
        modelGroup.position.set(0, -0.05, 0); // No bouncing, no floating, no translation
        modelGroup.rotation.y = mouseStateRef.current.rotY;
        modelGroup.rotation.x = mouseStateRef.current.rotX;
      }

      // Animate Rigged Facial Features according to active interaction state
      if (bones && bones.head && bones.jaw) {
        const curState = stateRef.current;

        if (curState === 'giggle') {
          // A. Giggle: Chattering jaw, joyful head tilt, and glowing amber eye pulses
          const elapsed = (now - giggleStartTimeRef.current) / 1000;
          bones.head.rotation.z = Math.sin(elapsed * 20) * 0.08;
          bones.head.rotation.x = -0.05 + Math.sin(elapsed * 24) * 0.03;
          bones.jaw.rotation.x = 0.06 + Math.abs(Math.sin(elapsed * 28)) * 0.22;
          if (bones.brow) bones.brow.rotation.x = 0.1;

          const eyeIntensity = 2.4 + Math.sin(elapsed * 32) * 0.8;
          eyeLightsRef.current.forEach((light) => {
            if (light) light.intensity = eyeIntensity;
          });

          if (tearsGroupRef.current) tearsGroupRef.current.visible = false;
        } else if (curState === 'hover') {
          // B. Hover: Curious, wondering expression (inquisitive head tilt, parted mouth, curious gaze)
          const targetHeadRotZ = 0.14;
          const targetHeadRotX = -0.08;
          const targetJawRotX = 0.08;
          const targetBrowRotX = 0.12;

          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, targetHeadRotZ, 0.08);
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, targetHeadRotX, 0.08);
          bones.jaw.rotation.x = THREE.MathUtils.lerp(bones.jaw.rotation.x, targetJawRotX, 0.08);
          if (bones.brow) {
            bones.brow.rotation.x = THREE.MathUtils.lerp(bones.brow.rotation.x, targetBrowRotX, 0.08);
          }

          eyeLightsRef.current.forEach((light) => {
            if (light) light.intensity = THREE.MathUtils.lerp(light.intensity, 1.8, 0.08);
          });

          if (tearsGroupRef.current) tearsGroupRef.current.visible = false;
        } else if (curState === 'crying') {
          // C. Stationary Cursor Inactivity: Cute crying behavior (drooping head, quivering jaw/pout, teardrops)
          const tremble = Math.sin(now * 0.02) * 0.015;
          const targetHeadRotX = 0.12 + tremble;
          const targetHeadRotZ = 0;
          const targetJawRotX = 0.06 + Math.sin(now * 0.024) * 0.05;

          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, targetHeadRotX, 0.06);
          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, targetHeadRotZ, 0.06);
          bones.jaw.rotation.x = THREE.MathUtils.lerp(bones.jaw.rotation.x, targetJawRotX, 0.08);
          if (bones.brow) {
            bones.brow.rotation.x = THREE.MathUtils.lerp(bones.brow.rotation.x, -0.08, 0.06);
          }

          eyeLightsRef.current.forEach((light) => {
            if (light) light.intensity = 1.2 + Math.sin(now * 0.015) * 0.3;
          });

          // Animate teardrops gently falling
          if (tearsGroupRef.current) {
            tearsGroupRef.current.visible = true;
            tearDrops.forEach((drop, i) => {
              drop.position.y -= 0.004;
              if (drop.position.y < -0.15) {
                drop.position.y = 0.38 - (i * 0.06);
              }
            });
          }
        } else {
          // Resting / Idle State: restore neutral calm posture
          bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, 0, 0.06);
          bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, 0, 0.06);
          bones.jaw.rotation.x = THREE.MathUtils.lerp(bones.jaw.rotation.x, 0, 0.06);
          if (bones.brow) {
            bones.brow.rotation.x = THREE.MathUtils.lerp(bones.brow.rotation.x, 0, 0.06);
          }

          eyeLightsRef.current.forEach((light) => {
            if (light) light.intensity = THREE.MathUtils.lerp(light.intensity, 1.4, 0.06);
          });

          if (tearsGroupRef.current) tearsGroupRef.current.visible = false;
        }
      }

      sparkleSystem.rotation.y += 0.001;

      // Render via Post-Processing Composer (Pixel + Bloom)
      if (composerRef.current) {
        composerRef.current.render();
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
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
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (giggleTimerRef.current) clearTimeout(giggleTimerRef.current);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isNightMode]);

  return (
    <div className="space-y-2 font-silkscreen select-none">
      {/* 3D Canvas Viewport Box with Retro 3D Bevels */}
      <div className="relative w-full h-72 sm:h-80 bg-[#16121e] border-4 border-[#3a2e37] overflow-hidden select-none pixel-border cursor-pointer group">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#16121e]/90 flex flex-col items-center justify-center gap-2 text-amber-300 font-pixel text-[10px] z-20">
            <Sparkles size={24} className="animate-spin text-amber-400" />
            <div className="tracking-widest">AWAKENING 3D BABY PIP...</div>
            <div className="w-48 h-3 bg-stone-800 border-2 border-stone-500 p-0.5 pixel-box">
              <div
                style={{ width: `${loadProgress}%` }}
                className="h-full bg-amber-400 transition-all duration-300"
              />
            </div>
            <span className="font-silkscreen text-[9px] text-stone-400">
              Rigging FBX Mesh & Sparkles ({loadProgress}%)
            </span>
          </div>
        )}

        {/* Reactive Interactive State Pill */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="bg-[#a34063] text-white px-2 py-0.5 text-[8px] font-pixel border border-white/40 shadow pixel-btn flex items-center gap-1">
            <span>💀</span> 3D PIP: SKULL BABY
          </span>
          <span className={`px-2 py-0.5 text-[8px] font-pixel border transition-colors ${
            interactionState === 'giggle'
              ? 'bg-pink-600 text-white border-pink-300 animate-pulse'
              : interactionState === 'hover'
              ? 'bg-amber-600 text-amber-100 border-amber-300'
              : interactionState === 'crying'
              ? 'bg-sky-800 text-sky-200 border-sky-400'
              : 'bg-black/75 text-amber-300 border-amber-400/30'
          }`}>
            {interactionState === 'giggle' && '✨ GIGGLING!'}
            {interactionState === 'hover' && '🤔 WONDERING...'}
            {interactionState === 'crying' && '😢 SNIFFLE...'}
            {interactionState === 'idle' && '😴 RESTING'}
          </span>
        </div>

        {/* Heart Pop on Giggle */}
        {interactionState === 'giggle' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-3xl animate-bounce">
            💖
          </div>
        )}
      </div>

      {/* Purposeful Interaction Strip */}
      <div className="p-2.5 bg-[#ede7df] border-2 border-stone-400 pixel-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {interactionState === 'giggle' ? (
            <Smile size={14} className="text-[#a34063] animate-spin" />
          ) : interactionState === 'hover' ? (
            <HelpCircle size={14} className="text-amber-600" />
          ) : (
            <Heart size={14} className="text-[#a34063] animate-pulse" />
          )}
          <span className="font-pixel text-[8px] text-[#5c4033]">
            INTERACTION: {interactionState.toUpperCase()}
          </span>
        </div>
        <button
          onClick={triggerGiggle}
          className="px-2.5 py-1 text-[8px] font-pixel bg-[#ffd1dc] text-[#a34063] border border-[#a34063] hover:bg-white pixel-btn"
        >
          TICKLE PIP 🍼
        </button>
      </div>
    </div>
  );
}
