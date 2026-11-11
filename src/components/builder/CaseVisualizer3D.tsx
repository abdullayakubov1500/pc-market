'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useBuilder } from '@/lib/builder-context';
import { useI18n } from '@/lib/i18n/context';
import { 
  Rotate3d, 
  Eye, 
  Sparkles, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Palette,
  Sun,
  Video
} from 'lucide-react';

interface CaseVisualizer3DProps {
  onSelectSlot?: (slot: any) => void;
}

export function CaseVisualizer3D({ onSelectSlot }: CaseVisualizer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { build, compatibility } = useBuilder();
  const { lang, t, formatPrice } = useI18n();

  const [glassOpen, setGlassOpen] = useState(false);
  const [rgbColor, setRgbColor] = useState('#00f0ff'); // Cyan default
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'inside' | 'front'>('iso');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animatedFansRef = useRef<THREE.Mesh[]>([]);
  const rgbLightsRef = useRef<THREE.PointLight[]>([]);
  const rgbMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const glassPanelRef = useRef<THREE.Mesh | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 560;
    const height = 440;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(4.2, 2.5, 4.6);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below floor
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x406080, 0.8);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0x00f0ff, 0x1f293d);
    grid.position.y = -0.01;
    scene.add(grid);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Spin animated fans
      animatedFansRef.current.forEach((fan) => {
        fan.rotation.z += delta * 12;
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update 3D PC Models when build components or RGB settings change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing PC root group if present
    const existingGroup = scene.getObjectByName('pcRootGroup');
    if (existingGroup) {
      scene.remove(existingGroup);
    }

    animatedFansRef.current = [];
    rgbLightsRef.current = [];
    rgbMaterialsRef.current = [];

    const pcGroup = new THREE.Group();
    pcGroup.name = 'pcRootGroup';

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e28,
      metalness: 0.85,
      roughness: 0.25,
    });

    const interiorMetalMat = new THREE.MeshStandardMaterial({
      color: 0x10141d,
      metalness: 0.7,
      roughness: 0.4,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: glassOpen ? 0.05 : 0.4,
      transparent: true,
      metalness: 0.1,
      roughness: 0.05,
      ior: 1.5,
    });

    const activeRgbColor = new THREE.Color(rgbColor);
    const rgbEmissiveMat = new THREE.MeshStandardMaterial({
      color: activeRgbColor,
      emissive: activeRgbColor,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    rgbMaterialsRef.current.push(rgbEmissiveMat);

    // ==========================================
    // 1. PC CASE CHASSIS
    // ==========================================
    // Case dimensions: width (X) = 1.4, height (Y) = 2.4, depth (Z) = 2.6
    const caseWidth = 1.4;
    const caseHeight = 2.4;
    const caseDepth = 2.6;

    // Bottom PSU Shroud / Basement
    const shroudGeo = new THREE.BoxGeometry(caseWidth - 0.05, 0.6, caseDepth - 0.1);
    const shroud = new THREE.Mesh(shroudGeo, interiorMetalMat);
    shroud.position.set(0, 0.3, 0);
    pcGroup.add(shroud);

    // Rear Panel
    const rearGeo = new THREE.BoxGeometry(caseWidth, caseHeight, 0.05);
    const rear = new THREE.Mesh(rearGeo, metalMat);
    rear.position.set(0, caseHeight / 2, -caseDepth / 2);
    pcGroup.add(rear);

    // Top Panel with mesh grill
    const topGeo = new THREE.BoxGeometry(caseWidth, 0.06, caseDepth);
    const top = new THREE.Mesh(topGeo, metalMat);
    top.position.set(0, caseHeight, 0);
    pcGroup.add(top);

    // Front Panel with intake glass/mesh
    const frontGeo = new THREE.BoxGeometry(caseWidth, caseHeight, 0.06);
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0x151922,
      metalness: 0.8,
      roughness: 0.3,
    });
    const front = new THREE.Mesh(frontGeo, frontMat);
    front.position.set(0, caseHeight / 2, caseDepth / 2);
    pcGroup.add(front);

    // Back Steel Side Panel
    const rightPanelGeo = new THREE.BoxGeometry(0.04, caseHeight, caseDepth);
    const rightPanel = new THREE.Mesh(rightPanelGeo, metalMat);
    rightPanel.position.set(-caseWidth / 2, caseHeight / 2, 0);
    pcGroup.add(rightPanel);

    // Front Side Glass Panel (Left side, viewer side)
    const glassGeo = new THREE.BoxGeometry(0.02, caseHeight - 0.1, caseDepth - 0.1);
    const glassPanel = new THREE.Mesh(glassGeo, glassMat);
    glassPanel.position.set(caseWidth / 2 + 0.02, caseHeight / 2, 0);
    if (!glassOpen) {
      pcGroup.add(glassPanel);
    }
    glassPanelRef.current = glassPanel;

    // 2x Front Intake Fans with RGB ring
    for (let i = 0; i < 2; i++) {
      const fanGroup = new THREE.Group();
      fanGroup.position.set(0, 1.0 + i * 0.7, caseDepth / 2 - 0.06);

      // Ring
      const ringGeo = new THREE.TorusGeometry(0.24, 0.02, 12, 32);
      const ring = new THREE.Mesh(ringGeo, rgbEmissiveMat);
      fanGroup.add(ring);

      // Rotor Blades
      const rotorGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
      const rotor = new THREE.Mesh(rotorGeo, metalMat);
      rotor.rotation.x = Math.PI / 2;

      for (let b = 0; b < 7; b++) {
        const bladeGeo = new THREE.BoxGeometry(0.18, 0.015, 0.04);
        const blade = new THREE.Mesh(bladeGeo, rgbEmissiveMat);
        blade.position.x = 0.1;
        blade.rotation.z = (b * (Math.PI * 2)) / 7;
        rotor.add(blade);
      }
      fanGroup.add(rotor);
      animatedFansRef.current.push(rotor);
      pcGroup.add(fanGroup);
    }

    // Rear Exhaust Fan
    const rearFanGroup = new THREE.Group();
    rearFanGroup.position.set(0, 1.8, -caseDepth / 2 + 0.08);
    const rearRingGeo = new THREE.TorusGeometry(0.2, 0.02, 12, 32);
    const rearRing = new THREE.Mesh(rearRingGeo, rgbEmissiveMat);
    rearFanGroup.add(rearRing);
    const rearRotor = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16), metalMat);
    rearRotor.rotation.x = Math.PI / 2;
    rearFanGroup.add(rearRotor);
    animatedFansRef.current.push(rearRotor);
    pcGroup.add(rearFanGroup);

    // ==========================================
    // 2. MOTHERBOARD
    // ==========================================
    if (build.motherboard || true) {
      const mbWidth = 0.04;
      const mbHeight = 1.35;
      const mbDepth = 1.45;

      const mbMat = new THREE.MeshStandardMaterial({
        color: 0x0c111a,
        metalness: 0.5,
        roughness: 0.6,
      });

      const mb = new THREE.Mesh(new THREE.BoxGeometry(mbWidth, mbHeight, mbDepth), mbMat);
      mb.position.set(-caseWidth / 2 + 0.1, 1.4, -0.2);
      pcGroup.add(mb);

      // VRM Silver Aluminum Heatsinks
      const vrmGeo = new THREE.BoxGeometry(0.12, 0.35, 0.18);
      const vrmMat = new THREE.MeshStandardMaterial({ color: 0x556070, metalness: 0.9, roughness: 0.2 });
      const vrmTop = new THREE.Mesh(vrmGeo, vrmMat);
      vrmTop.position.set(-caseWidth / 2 + 0.18, 1.9, -0.6);
      pcGroup.add(vrmTop);

      const vrmSide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), vrmMat);
      vrmSide.position.set(-caseWidth / 2 + 0.18, 1.7, -0.8);
      pcGroup.add(vrmSide);
    }

    // ==========================================
    // 3. CPU (Socket & Metal IHS)
    // ==========================================
    if (build.cpu || true) {
      const cpuIhsGeo = new THREE.BoxGeometry(0.03, 0.22, 0.22);
      const cpuMat = new THREE.MeshStandardMaterial({
        color: 0xd0d5dd,
        metalness: 0.95,
        roughness: 0.15,
      });
      const cpu = new THREE.Mesh(cpuIhsGeo, cpuMat);
      cpu.position.set(-caseWidth / 2 + 0.14, 1.65, -0.4);
      pcGroup.add(cpu);
    }

    // ==========================================
    // 4. CPU COOLER / AIO
    // ==========================================
    if (build.cooler) {
      if (build.cooler.coolerType === 'AIO_360') {
        // AIO Pump Block over CPU
        const pumpGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32);
        const pumpMat = new THREE.MeshStandardMaterial({ color: 0x111622, metalness: 0.8, roughness: 0.2 });
        const pump = new THREE.Mesh(pumpGeo, pumpMat);
        pump.rotation.z = Math.PI / 2;
        pump.position.set(-caseWidth / 2 + 0.22, 1.65, -0.4);

        // Glowing RGB Ring on Pump
        const pumpRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.015, 16, 32), rgbEmissiveMat);
        pumpRing.rotation.y = Math.PI / 2;
        pump.add(pumpRing);
        pcGroup.add(pump);

        // Top Radiator
        const radGeo = new THREE.BoxGeometry(0.8, 0.12, 1.8);
        const rad = new THREE.Mesh(radGeo, metalMat);
        rad.position.set(0.1, caseHeight - 0.1, 0);
        pcGroup.add(rad);
      } else {
        // Big Air Cooler Tower
        const towerGeo = new THREE.BoxGeometry(0.45, 0.55, 0.45);
        const towerMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          metalness: 0.9,
          roughness: 0.3,
        });
        const tower = new THREE.Mesh(towerGeo, towerMat);
        tower.position.set(-caseWidth / 2 + 0.42, 1.65, -0.4);

        // Cooler Fan
        const cFanGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24);
        const cFan = new THREE.Mesh(cFanGeo, rgbEmissiveMat);
        cFan.rotation.z = Math.PI / 2;
        cFan.position.set(0.24, 0, 0);
        tower.add(cFan);
        animatedFansRef.current.push(cFan);

        pcGroup.add(tower);
      }
    }

    // ==========================================
    // 5. RAM STICKS
    // ==========================================
    if (build.ram) {
      for (let s = 0; s < 2; s++) {
        const ramGroup = new THREE.Group();
        ramGroup.position.set(-caseWidth / 2 + 0.2, 1.7, -0.15 + s * 0.08);

        // Black Heatspreader
        const ramGeo = new THREE.BoxGeometry(0.02, 0.28, 0.5);
        const ramMesh = new THREE.Mesh(ramGeo, metalMat);
        ramGroup.add(ramMesh);

        // Top RGB Lightbar
        const lightbarGeo = new THREE.BoxGeometry(0.025, 0.04, 0.5);
        const lightbar = new THREE.Mesh(lightbarGeo, rgbEmissiveMat);
        lightbar.position.y = 0.14;
        ramGroup.add(lightbar);

        pcGroup.add(ramGroup);
      }
    }

    // ==========================================
    // 6. GPU (Graphics Card)
    // ==========================================
    if (build.gpu) {
      const gpuLength = (build.gpu.gpuLength || 280) / 200; // Scaled to ~1.4 Three.js units
      const gpuHeight = 0.5;
      const gpuDepth = 0.25;

      const gpuGroup = new THREE.Group();
      gpuGroup.position.set(0.05, 1.05, -0.1);

      // Main GPU Body
      const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(0.25, gpuHeight, gpuLength), metalMat);
      gpuGroup.add(gpuBody);

      // Backplate
      const bpGeo = new THREE.BoxGeometry(0.02, gpuHeight - 0.05, gpuLength);
      const bpMat = new THREE.MeshStandardMaterial({ color: 0x222a38, metalness: 0.9, roughness: 0.2 });
      const bp = new THREE.Mesh(bpGeo, bpMat);
      bp.position.x = -0.13;
      gpuGroup.add(bp);

      // 2 or 3 GPU Fans with RGB rings
      const numFans = gpuLength > 1.3 ? 3 : 2;
      for (let f = 0; f < numFans; f++) {
        const offsetZ = (f - (numFans - 1) / 2) * (gpuLength / numFans);
        const gFan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20), rgbEmissiveMat);
        gFan.rotation.z = Math.PI / 2;
        gFan.position.set(0.13, 0, offsetZ);
        gpuGroup.add(gFan);
        animatedFansRef.current.push(gFan);
      }

      // Side Glowing Logo
      const logoGeo = new THREE.BoxGeometry(0.02, 0.08, 0.4);
      const logo = new THREE.Mesh(logoGeo, rgbEmissiveMat);
      logo.position.set(0, gpuHeight / 2 + 0.01, 0);
      gpuGroup.add(logo);

      pcGroup.add(gpuGroup);
    }

    // ==========================================
    // 7. STORAGE (M.2 NVMe SSD)
    // ==========================================
    if (build.storage) {
      const ssdGeo = new THREE.BoxGeometry(0.03, 0.08, 0.35);
      const ssdMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      const ssd = new THREE.Mesh(ssdGeo, ssdMat);
      ssd.position.set(-caseWidth / 2 + 0.14, 0.9, -0.4);
      pcGroup.add(ssd);
    }

    // ==========================================
    // 8. POWER SUPPLY (PSU)
    // ==========================================
    if (build.psu) {
      const psuGeo = new THREE.BoxGeometry(caseWidth - 0.2, 0.48, 0.8);
      const psuMat = new THREE.MeshStandardMaterial({ color: 0x111622, metalness: 0.9, roughness: 0.4 });
      const psu = new THREE.Mesh(psuGeo, psuMat);
      psu.position.set(0, 0.25, -caseDepth / 2 + 0.5);

      // PSU Fan Grill
      const grillGeo = new THREE.TorusGeometry(0.18, 0.02, 8, 24);
      const grill = new THREE.Mesh(grillGeo, metalMat);
      grill.rotation.x = Math.PI / 2;
      grill.position.y = 0.25;
      psu.add(grill);

      pcGroup.add(psu);
    }

    // Internal RGB PointLight bouncing inside chassis
    const internalRgbLight = new THREE.PointLight(activeRgbColor, 4.0, 4.0);
    internalRgbLight.position.set(0, 1.5, 0);
    pcGroup.add(internalRgbLight);
    rgbLightsRef.current.push(internalRgbLight);

    scene.add(pcGroup);
  }, [build, glassOpen, rgbColor]);

  // Camera presets
  const setCameraView = (view: 'iso' | 'inside' | 'front') => {
    setCameraPreset(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (view === 'iso') {
      camera.position.set(4.2, 2.5, 4.6);
      controls.target.set(0, 1.2, 0);
    } else if (view === 'inside') {
      camera.position.set(1.9, 1.4, 0.5);
      controls.target.set(-0.2, 1.3, -0.2);
    } else if (view === 'front') {
      camera.position.set(0.1, 1.3, 5.0);
      controls.target.set(0, 1.2, 0);
    }
  };

  const colors = [
    { name: 'Cyber Cyan', hex: '#00f0ff' },
    { name: 'Neon Purple', hex: '#b026ff' },
    { name: 'Matrix Emerald', hex: '#10b981' },
    { name: 'Flame Red', hex: '#ef4444' },
    { name: 'Pure White', hex: '#ffffff' },
  ];

  return (
    <div className="bg-[#0e1422] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
              <Rotate3d className="w-5 h-5 text-cyan-400" />
              <span>3D Интерактивная сборка ПК</span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {lang === 'ru'
              ? 'Вращайте модель мышью на 360°, приближайте зум и меняйте подсветку'
              : 'Modelni 360° aylantiring, yaqinlashtiring va ARGB yoritgichini boshqaring'}
          </p>
        </div>

        {/* View presets */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setCameraView('iso')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              cameraPreset === 'iso' ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            3D Обзор
          </button>
          <button
            onClick={() => setCameraView('inside')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              cameraPreset === 'inside' ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Внутри
          </button>
          <button
            onClick={() => setCameraView('front')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              cameraPreset === 'front' ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Спереди
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div 
        ref={mountRef} 
        className="w-full h-[440px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0e17] to-[#060910] border border-white/10 shadow-inner relative cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Controls Bar: RGB Lighting & Glass Panel Toggle */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
        
        {/* RGB Palette */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-gray-400 font-mono hidden sm:inline">ARGB:</span>
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setRgbColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                className={`w-5 h-5 rounded-full transition-all border ${
                  rgbColor === c.hex ? 'ring-2 ring-white scale-125 border-black' : 'border-white/30 opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Glass Panel Toggle */}
        <button
          type="button"
          onClick={() => setGlassOpen(!glassOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
            glassOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{glassOpen ? 'Снять боковое стекло [Снято]' : 'Снять боковое стекло'}</span>
        </button>

        {/* Price & Summary */}
        <div className="text-right">
          <span className="font-bold text-cyan-300 font-mono text-sm">
            {formatPrice(compatibility.totalPriceUzs)}
          </span>
        </div>

      </div>

    </div>
  );
}
