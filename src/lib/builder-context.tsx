'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BuildConfiguration,
  ProductSpec,
  checkCompatibility,
  CompatibilityResult,
} from './compatibility';

interface BuilderContextType {
  build: BuildConfiguration;
  setPart: (slot: keyof BuildConfiguration, product: ProductSpec | null) => void;
  removePart: (slot: keyof BuildConfiguration) => void;
  resetBuild: () => void;
  loadPreset: (presetKey: 'budget' | 'mid' | 'highEnd') => void;
  compatibility: CompatibilityResult;
  isCompatibleWithCurrentBuild: (
    slot: keyof BuildConfiguration,
    candidate: ProductSpec
  ) => { compatible: boolean; reasonRu?: string; reasonUz?: string };
}

const initialBuild: BuildConfiguration = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  cooler: null,
  storage: null,
  psu: null,
  case: null,
};

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [build, setBuild] = useState<BuildConfiguration>(initialBuild);

  // Restore saved build from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pc_market_build');
      if (saved) {
        setBuild(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveBuild = (newBuild: BuildConfiguration) => {
    setBuild(newBuild);
    try {
      localStorage.setItem('pc_market_build', JSON.stringify(newBuild));
    } catch {
      // ignore
    }
  };

  const setPart = (slot: keyof BuildConfiguration, product: ProductSpec | null) => {
    saveBuild({ ...build, [slot]: product });
  };

  const removePart = (slot: keyof BuildConfiguration) => {
    saveBuild({ ...build, [slot]: null });
  };

  const resetBuild = () => {
    saveBuild(initialBuild);
  };

  const compatibility = checkCompatibility(build);

  const isCompatibleWithCurrentBuild = (
    slot: keyof BuildConfiguration,
    candidate: ProductSpec
  ) => {
    const testBuild: BuildConfiguration = { ...build, [slot]: candidate };
    const res = checkCompatibility(testBuild);
    const relevantIssue = res.issues.find(
      (issue) =>
        issue.type === 'error' &&
        (issue.category.includes(slot) ||
          (slot === 'cpu' && issue.category === 'socket') ||
          (slot === 'motherboard' && (issue.category === 'socket' || issue.category === 'ram')) ||
          (slot === 'ram' && issue.category === 'ram') ||
          (slot === 'case' && (issue.category === 'case_mb' || issue.category === 'gpu_case' || issue.category === 'cooler_case')))
    );

    if (relevantIssue) {
      return {
        compatible: false,
        reasonRu: relevantIssue.messageRu,
        reasonUz: relevantIssue.messageUz,
      };
    }
    return { compatible: true };
  };

  const loadPreset = async (presetKey: 'budget' | 'mid' | 'highEnd') => {
    try {
      const res = await fetch('/api/products');
      const products: ProductSpec[] = await res.json();

      let targetCpu = 'Core i5-12400F';
      let targetGpu = 'GeForce RTX 4060 8GB';
      let targetMb = 'PRIME B760M-K D4';
      let targetRam = 'FURY Beast DDR4 16GB';
      let targetCooler = 'AG400 ARGB';
      let targetStorage = 'NV2 1TB';
      let targetPsu = 'PK650D 650W';
      let targetCase = 'TRILOBITE T3';

      if (presetKey === 'mid') {
        targetCpu = 'Ryzen 5 7500F';
        targetGpu = 'GeForce RTX 4070 Super 12GB';
        targetMb = 'ASRock B650M-HDV/M.2';
        targetRam = 'FURY Beast DDR5 32GB';
        targetCooler = 'Peerless Assassin 120 SE';
        targetStorage = '980 PRO 1TB';
        targetPsu = 'Pure Power 12 M 850W';
        targetCase = 'CC560 V2';
      } else if (presetKey === 'highEnd') {
        targetCpu = 'Ryzen 7 7800X3D';
        targetGpu = 'GeForce RTX 4080 Super 16GB';
        targetMb = 'TUF GAMING B650-PLUS WIFI';
        targetRam = 'Trident Z5 RGB 64GB';
        targetCooler = 'LS720 SE 360mm';
        targetStorage = '990 PRO 2TB';
        targetPsu = 'PX1000G 1000W';
        targetCase = 'LANCOOL 216 RGB';
      }

      const findPart = (modelName: string) =>
        products.find((p) => p.model.toLowerCase().includes(modelName.toLowerCase())) || null;

      const newBuild: BuildConfiguration = {
        cpu: findPart(targetCpu),
        motherboard: findPart(targetMb),
        ram: findPart(targetRam),
        gpu: findPart(targetGpu),
        cooler: findPart(targetCooler),
        storage: findPart(targetStorage),
        psu: findPart(targetPsu),
        case: findPart(targetCase),
      };

      saveBuild(newBuild);
    } catch (e) {
      console.error('Failed to load preset', e);
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        build,
        setPart,
        removePart,
        resetBuild,
        loadPreset,
        compatibility,
        isCompatibleWithCurrentBuild,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
