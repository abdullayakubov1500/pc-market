export interface GameSpec {
  id: string;
  title: string;
  image: string;
  genre: string;
  releaseYear: number;
  gpuIntensity: number;
  cpuIntensity: number;
  baseFps1080pUltra: number;
  ramMinGb: number;
  descriptionRu: string;
  descriptionUz: string;
}

export type Resolution = '1080p' | '1440p' | '4K';
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface FpsCalculationResult {
  fpsByPreset: {
    low: number;
    medium: number;
    high: number;
    ultra: number;
  };
  currentFps: number;
  bottleneck: {
    type: 'gpu' | 'cpu' | 'balanced';
    percentage: number;
    titleRu: string;
    titleUz: string;
    detailsRu: string;
    detailsUz: string;
  };
  playability: {
    tier: 'poor' | 'playable' | 'smooth' | 'ultraSmooth';
    badgeColor: string;
    labelRu: string;
    labelUz: string;
  };
}

const RESOLUTION_MULTIPLIERS: Record<Resolution, number> = {
  '1080p': 1.0,
  '1440p': 0.72,
  '4K': 0.44,
};

const PRESET_MULTIPLIERS: Record<QualityPreset, number> = {
  low: 1.68,
  medium: 1.34,
  high: 1.14,
  ultra: 1.0,
};

export function calculateFps(
  game: GameSpec,
  cpuScore: number = 2500,
  gpuScore: number = 10800,
  ramGb: number = 16,
  resolution: Resolution = '1080p',
  preset: QualityPreset = 'high'
): FpsCalculationResult {
  // Baseline hardware: RTX 4060 (10800) + Ryzen 5 7500F / i5-12400 (2600)
  const baselineGpu = 10800;
  const baselineCpu = 2600;

  const gpuScale = gpuScore / baselineGpu;
  const cpuScale = cpuScore / baselineCpu;

  // Weightings based on resolution
  // At 1080p, CPU weight is ~30%, GPU ~70%
  // At 1440p, CPU weight is ~20%, GPU ~80%
  // At 4K, CPU weight is ~10%, GPU ~90%
  let cpuWeight = 0.28;
  let gpuWeight = 0.72;

  if (resolution === '1440p') {
    cpuWeight = 0.18;
    gpuWeight = 0.82;
  } else if (resolution === '4K') {
    cpuWeight = 0.08;
    gpuWeight = 0.92;
  }

  // Adjust weights by game intensity
  const effectiveGpuFactor = Math.pow(gpuScale, 0.95 / Math.sqrt(game.gpuIntensity));
  const effectiveCpuFactor = Math.pow(cpuScale, 0.85 / Math.sqrt(game.cpuIntensity));

  // Combined performance multiplier
  let perfFactor = (effectiveGpuFactor * gpuWeight) + (effectiveCpuFactor * cpuWeight);

  // RAM bottleneck check
  if (ramGb < game.ramMinGb) {
    perfFactor *= 0.85; // 15% stutter penalty
  } else if (ramGb >= 32) {
    perfFactor *= 1.04; // 4% bonus for abundant memory
  }

  // Calculate Ultra 1080p Base FPS
  const ultra1080pFps = game.baseFps1080pUltra * perfFactor;
  const resMultiplier = RESOLUTION_MULTIPLIERS[resolution];

  const calculateForPreset = (p: QualityPreset) => {
    const rawFps = ultra1080pFps * resMultiplier * PRESET_MULTIPLIERS[p];
    return Math.max(15, Math.round(rawFps));
  };

  const fpsByPreset = {
    low: calculateForPreset('low'),
    medium: calculateForPreset('medium'),
    high: calculateForPreset('high'),
    ultra: calculateForPreset('ultra'),
  };

  const currentFps = fpsByPreset[preset];

  // Bottleneck calculation
  let bottleneckType: 'gpu' | 'cpu' | 'balanced' = 'balanced';
  let percentage = 5;
  let titleRu = 'Сбалансированная конфигурация';
  let titleUz = 'Muvozanatli konfiguratsiya';
  let detailsRu = 'Процессор и видеокарта отлично дополняют друг друга без существенных задержек.';
  let detailsUz = 'Protsessor va videokarta bir-biriga to\'liq mos tushadi, hech qanday to\'siq yo\'q.';

  const ratio = gpuScale / cpuScale;
  if (ratio > 1.35 && resolution === '1080p') {
    bottleneckType = 'cpu';
    percentage = Math.min(35, Math.round((ratio - 1) * 30));
    titleRu = `CPU Bottleneck (~${percentage}%)`;
    titleUz = `CPU To'sig'i (~${percentage}%)`;
    detailsRu = `Мощность видеокарты в 1080p частично упирается в процессор. Рекомендуется процессор более высокого уровня для раскрытия всех FPS.`;
    detailsUz = `1080p rezolyutsiyada videokartaning to'liq quvvati protsessor sabab cheklanmoqda. Kuchliroq CPU tavsiya etiladi.`;
  } else if (ratio < 0.7) {
    bottleneckType = 'gpu';
    percentage = Math.min(40, Math.round((1 - ratio) * 45));
    titleRu = `GPU Упор (Обычный для игр)`;
    titleUz = `GPU Yuklamasi (O'yinlar uchun odatiy)`;
    detailsRu = `Видеокарта загружена на 100%, процессор имеет запас мощности. Это нормальное состояние для тяжелой графики.`;
    detailsUz = `Videokarta 100% quvvatda ishlayapti, protsessorda zaxira quvvat mavjud. Bu og'ir o'yinlar uchun me'yoriy holat.`;
  }

  // Playability rating
  let tier: 'poor' | 'playable' | 'smooth' | 'ultraSmooth' = 'smooth';
  let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  let labelRu = 'Плавно (60-119 FPS)';
  let labelUz = 'Silliq (60-119 FPS)';

  if (currentFps < 35) {
    tier = 'poor';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
    labelRu = 'Низкий FPS (<35)';
    labelUz = 'Past FPS (<35)';
  } else if (currentFps < 60) {
    tier = 'playable';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    labelRu = 'Играбельно (35-59 FPS)';
    labelUz = 'O\'ynasa bo\'ladi (35-59 FPS)';
  } else if (currentFps >= 120) {
    tier = 'ultraSmooth';
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    labelRu = 'Киберспорт (120+ FPS)';
    labelUz = 'Kibersport (120+ FPS)';
  }

  return {
    fpsByPreset,
    currentFps,
    bottleneck: {
      type: bottleneckType,
      percentage,
      titleRu,
      titleUz,
      detailsRu,
      detailsUz,
    },
    playability: {
      tier,
      badgeColor,
      labelRu,
      labelUz,
    },
  };
}
