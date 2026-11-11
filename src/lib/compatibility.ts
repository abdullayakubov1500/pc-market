export interface ProductSpec {
  id: string;
  categoryId: string;
  nameRu: string;
  nameUz: string;
  brand: string;
  model: string;
  priceUzs: number;
  image: string;
  inStock?: boolean;
  descriptionRu?: string | null;
  descriptionUz?: string | null;
  tdp?: number | null;
  socket?: string | null;
  ramType?: string | null;
  ramSlots?: number | null;
  formFactor?: string | null;
  gpuLength?: number | null;
  maxGpuLength?: number | null;
  coolerHeight?: number | null;
  maxCoolerHeight?: number | null;
  coolerType?: string | null;
  maxRadiatorSupport?: string | null;
  psuWattage?: number | null;
  psuCertification?: string | null;
  storageInterface?: string | null;
  capacityGb?: number | null;
  speedMhz?: number | null;
  cpuScore?: number | null;
  gpuScore?: number | null;
}

export interface BuildConfiguration {
  cpu: ProductSpec | null;
  motherboard: ProductSpec | null;
  ram: ProductSpec | null;
  gpu: ProductSpec | null;
  cooler: ProductSpec | null;
  storage: ProductSpec | null;
  psu: ProductSpec | null;
  case: ProductSpec | null;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  messageRu: string;
  messageUz: string;
}

export interface CompatibilityResult {
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  estimatedWattage: number;
  recommendedPsuWattage: number;
  totalPriceUzs: number;
}

export function checkCompatibility(build: BuildConfiguration): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  let estimatedWattage = 60; // Base board, RAM, SSD, fans

  let totalPriceUzs = 0;
  Object.values(build).forEach((item) => {
    if (item) totalPriceUzs += item.priceUzs;
  });

  // Calculate Wattage
  if (build.cpu?.tdp) {
    estimatedWattage += build.cpu.tdp;
  }
  if (build.gpu?.tdp) {
    estimatedWattage += build.gpu.tdp;
  }
  const recommendedPsuWattage = Math.ceil((estimatedWattage * 1.25) / 50) * 50;

  // 1. CPU & Motherboard Socket Check
  if (build.cpu && build.motherboard) {
    if (build.cpu.socket && build.motherboard.socket && build.cpu.socket !== build.motherboard.socket) {
      issues.push({
        type: 'error',
        category: 'socket',
        messageRu: `Несовместимость сокетов: Процессор ${build.cpu.model} (${build.cpu.socket}) не подходит к материнской плате ${build.motherboard.model} (${build.motherboard.socket}).`,
        messageUz: `Soketlar mos kelmaydi: ${build.cpu.model} (${build.cpu.socket}) protsessori ${build.motherboard.model} (${build.motherboard.socket}) ona platasiga to'g'ri kelmaydi.`,
      });
    }
  }

  // 2. Motherboard & RAM Type Check
  if (build.motherboard && build.ram) {
    if (build.motherboard.ramType && build.ram.ramType && build.motherboard.ramType !== build.ram.ramType) {
      issues.push({
        type: 'error',
        category: 'ram',
        messageRu: `Несовместимость памяти: Материнская плата требует ${build.motherboard.ramType}, а выбрана память ${build.ram.ramType}.`,
        messageUz: `Xotira turi mos kelmaydi: Ona plata ${build.motherboard.ramType} talab qiladi, tanlangan xotira esa ${build.ram.ramType}.`,
      });
    }
  }

  // 3. CPU & RAM Type Check (e.g. Ryzen 7000/9000 requires DDR5)
  if (build.cpu && build.ram) {
    if (build.cpu.socket === 'AM5' && build.ram.ramType !== 'DDR5') {
      issues.push({
        type: 'error',
        category: 'ram',
        messageRu: `Платформа AMD AM5 работает исключительно с оперативной памятью DDR5.`,
        messageUz: `AMD AM5 platformasi faqat DDR5 tezkor xotirasida ishlaydi.`,
      });
    }
    if (build.cpu.socket === 'AM4' && build.ram.ramType !== 'DDR4') {
      issues.push({
        type: 'error',
        category: 'ram',
        messageRu: `Платформа AMD AM4 поддерживает только оперативную память DDR4.`,
        messageUz: `AMD AM4 platformasi faqat DDR4 xotirasini qo'llab-quvvatlaydi.`,
      });
    }
  }

  // 4. Motherboard & Case Form Factor
  if (build.motherboard && build.case) {
    const caseForm = build.case.formFactor?.toUpperCase() || 'ATX';
    const mbForm = build.motherboard.formFactor?.toUpperCase() || 'ATX';

    if (caseForm === 'MICRO-ATX' && mbForm === 'ATX') {
      issues.push({
        type: 'error',
        category: 'case_mb',
        messageRu: `Полноразмерная материнская плата ATX (${build.motherboard.model}) не поместится в компактный корпус Micro-ATX.`,
        messageUz: `Katta ATX formatidagi ona plata (${build.motherboard.model}) ixcham Micro-ATX korpusga sig'maydi.`,
      });
    }
  }

  // 5. GPU Length vs Case Max GPU Length
  if (build.gpu && build.case) {
    if (build.gpu.gpuLength && build.case.maxGpuLength && build.gpu.gpuLength > build.case.maxGpuLength) {
      issues.push({
        type: 'error',
        category: 'gpu_case',
        messageRu: `Длина видеокарты (${build.gpu.gpuLength} мм) превышает максимальный предел корпуса (${build.case.maxGpuLength} мм).`,
        messageUz: `Videokarta uzunligi (${build.gpu.gpuLength} mm) korpusning ruxsat etilgan maksimal uzunligidan (${build.case.maxGpuLength} mm) katta.`,
      });
    }
  }

  // 6. CPU Cooler vs Case Dimensions & Sockets
  if (build.cooler && build.case) {
    if (build.cooler.coolerType === 'AIO_360' && build.case.maxRadiatorSupport !== '360mm') {
      issues.push({
        type: 'error',
        category: 'cooler_case',
        messageRu: `Трехсекционная СЖО 360 мм не поддерживается данным корпусом (максимум ${build.case.maxRadiatorSupport || '240mm'}).`,
        messageUz: `360 mm suvli sovutish tizimi ushbu korpusga o'rnatilmaydi (maksimal ${build.case.maxRadiatorSupport || '240mm'}).`,
      });
    } else if (build.cooler.coolerType === 'AIR' && build.cooler.coolerHeight && build.case.maxCoolerHeight) {
      if (build.cooler.coolerHeight > build.case.maxCoolerHeight) {
        issues.push({
          type: 'error',
          category: 'cooler_case',
          messageRu: `Высота кулера (${build.cooler.coolerHeight} мм) больше предельной высоты в корпусе (${build.case.maxCoolerHeight} мм). Боковое стекло не закроется.`,
          messageUz: `Sovutgich balandligi (${build.cooler.coolerHeight} mm) korpus sig'imidan (${build.case.maxCoolerHeight} mm) baland. Yon oyna yopilmaydi.`,
        });
      }
    }
  }

  if (build.cpu && build.cooler) {
    if (build.cpu.socket && build.cooler.socket) {
      const supportedSockets = build.cooler.socket.split(',').map((s) => s.trim());
      if (!supportedSockets.includes(build.cpu.socket)) {
        issues.push({
          type: 'error',
          category: 'cooler_cpu',
          messageRu: `Крепление кулера не поддерживает сокет ${build.cpu.socket}.`,
          messageUz: `Sovutgich o'rnatish tizimi ${build.cpu.socket} soketini qo'llab-quvvatlamaydi.`,
        });
      }
    }
  }

  // 7. Power Supply Capacity
  if (build.psu) {
    if (build.psu.psuWattage && build.psu.psuWattage < estimatedWattage) {
      issues.push({
        type: 'error',
        category: 'psu',
        messageRu: `Критическая нехватка питания! Выбранный БП (${build.psu.psuWattage} Вт) слабее потребления компонентов (${estimatedWattage} Вт). ПК будет выключаться под нагрузкой.`,
        messageUz: `Xavfli quvvat yetishmovchiligi! Tanlangan quvvat bloki (${build.psu.psuWattage} W) qismlar sarfidan (${estimatedWattage} W) kam. Kompyuter o'chib qoladi.`,
      });
    } else if (build.psu.psuWattage && build.psu.psuWattage < recommendedPsuWattage) {
      issues.push({
        type: 'warning',
        category: 'psu',
        messageRu: `Запас мощности меньше рекомендованного. Для стабильности и тишины рекомендуется БП от ${recommendedPsuWattage} Вт.`,
        messageUz: `Quvvat zaxirasi tavsiya etilganidan kamroq. Barqarorlik va sokinlik uchun kamida ${recommendedPsuWattage} W quvvat bloki tavsiya qilinadi.`,
      });
    }
  }

  // 8. Dedicated GPU requirement check
  if (build.cpu && !build.gpu) {
    if (build.cpu.model.includes('F') || build.cpu.model.includes('Tray')) {
      issues.push({
        type: 'warning',
        category: 'gpu',
        messageRu: `Процессор ${build.cpu.model} не имеет встроенного графического ядра. Для вывода изображения обязательна дискретная видеокарта.`,
        messageUz: `${build.cpu.model} protsessorida ichki grafik yadro yo'q. Monitorga tasvir chiqishi uchun albatta videokarta kerak.`,
      });
    }
  }

  const isCompatible = issues.filter((i) => i.type === 'error').length === 0;

  return {
    isCompatible,
    issues,
    estimatedWattage,
    recommendedPsuWattage,
    totalPriceUzs,
  };
}
