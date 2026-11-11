'use client';

import React, { useState, useEffect } from 'react';
import { useBuilder } from '@/lib/builder-context';
import { useI18n } from '@/lib/i18n/context';
import { useCart } from '@/lib/cart-context';
import { BuildConfiguration } from '@/lib/compatibility';
import { SlotItem } from '@/components/builder/SlotItem';
import { PartSelectorModal } from '@/components/builder/PartSelectorModal';
import { CaseVisualizer2D } from '@/components/builder/CaseVisualizer2D';
import { CaseVisualizer3D } from '@/components/builder/CaseVisualizer3D';
import { CompatibilityAlerts } from '@/components/builder/CompatibilityAlerts';
import { FpsWidget } from '@/components/fps/FpsWidget';
import { GameSpec } from '@/lib/fps-calculator';
import { 
  Sliders, 
  RotateCcw, 
  ShoppingCart, 
  Gamepad2, 
  CheckCircle2, 
  Rotate3d, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function BuilderPage() {
  const { build, removePart, resetBuild, loadPreset, compatibility } = useBuilder();
  const { lang, t, formatPrice } = useI18n();
  const { addCustomPcToCart } = useCart();

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [activeModalSlot, setActiveModalSlot] = useState<keyof BuildConfiguration | null>(null);
  const [games, setGames] = useState<GameSpec[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameSpec | null>(null);
  const [orderedSuccess, setOrderedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data: GameSpec[]) => {
        if (data && data.length > 0) {
          setGames(data);
          setSelectedGame(data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const slotKeys: Array<{ key: keyof BuildConfiguration; labelRu: string; labelUz: string }> = [
    { key: 'cpu', labelRu: '1. Процессор (CPU)', labelUz: '1. Protsessor (CPU)' },
    { key: 'motherboard', labelRu: '2. Материнская плата', labelUz: '2. Ona plata (Motherboard)' },
    { key: 'ram', labelRu: '3. Оперативная память (RAM)', labelUz: '3. Tezkor xotira (RAM)' },
    { key: 'gpu', labelRu: '4. Видеокарта (GPU)', labelUz: '4. Videokarta (GPU)' },
    { key: 'cooler', labelRu: '5. Охлаждение процессора', labelUz: '5. Sovutish tizimi' },
    { key: 'storage', labelRu: '6. Накопитель (SSD M.2)', labelUz: '6. Xotira diski (SSD M.2)' },
    { key: 'psu', labelRu: '7. Блок питания (PSU)', labelUz: '7. Quvvat bloki (PSU)' },
    { key: 'case', labelRu: '8. Корпус (Case)', labelUz: '8. Kompyuter korpusi' },
  ];

  const handleOrderCustomPc = () => {
    addCustomPcToCart(build, compatibility.totalPriceUzs);
    setOrderedSuccess(true);
    setTimeout(() => setOrderedSuccess(false), 3000);
  };

  const selectedCount = Object.values(build).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Quick Presets Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-mono">
              3D Real-time Configurator v2.5
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.builder.title}
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
            {t.builder.subtitle}
          </p>
        </div>

        {/* Quick Presets Buttons & Reset */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0e1422] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs">
          <span className="text-slate-500 dark:text-gray-400 px-2 font-mono text-[11px] hidden sm:inline">
            Пресеты:
          </span>
          <button
            onClick={() => loadPreset('budget')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-cyan-300 font-semibold border border-slate-200 dark:border-white/5 transition-all shadow-sm"
          >
            Бюджетный
          </button>
          <button
            onClick={() => loadPreset('mid')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-cyan-300 font-semibold border border-slate-200 dark:border-white/5 transition-all shadow-sm"
          >
            Оптимальный
          </button>
          <button
            onClick={() => loadPreset('highEnd')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-cyan-300 font-semibold border border-slate-200 dark:border-white/5 transition-all shadow-sm"
          >
            Топовый
          </button>
          <button
            onClick={resetBuild}
            title={t.builder.resetBuild}
            className="p-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-red-500/20 text-slate-500 dark:text-gray-400 hover:text-red-500 border border-slate-200 dark:border-white/5 transition-all ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual-Column Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 Cols): 8 Component Slots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>{t.builder.componentSlots} ({selectedCount}/8)</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-gray-500 font-mono">
              {lang === 'ru' ? 'Нажмите на слот для замены детали' : 'Qismni almashtirish uchun slotni bosing'}
            </span>
          </div>

          <div className="space-y-3">
            {slotKeys.map(({ key, labelRu, labelUz }) => (
              <SlotItem
                key={key}
                slotKey={key}
                title={lang === 'ru' ? labelRu : labelUz}
                product={build[key]}
                onOpenSelector={() => setActiveModalSlot(key)}
                onRemove={() => removePart(key)}
              />
            ))}
          </div>

          {/* Sticky Total & Order Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1422] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs text-slate-500 dark:text-gray-400 block font-mono">
                {t.builder.totalPrice} ({selectedCount} деталей)
              </span>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-300 font-mono">
                {formatPrice(compatibility.totalPriceUzs)}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOrderCustomPc}
                disabled={selectedCount === 0 || !compatibility.isCompatible}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  selectedCount === 0 || !compatibility.isCompatible
                    ? 'bg-slate-300 dark:bg-gray-800 text-slate-500 dark:text-gray-500 cursor-not-allowed'
                    : orderedSuccess
                    ? 'bg-emerald-500 text-black'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-500/25'
                }`}
              >
                {orderedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Добавлено в корзину!' : 'Savatga qo\'shildi!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.builder.orderBuild}</span>
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs shrink-0 border border-slate-300 dark:border-white/10"
              >
                {t.common.cart}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): 3D / 2D Visualizer + Power Bar & Alerts */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Mode Switcher: 3D vs 2D Toggle */}
          <div className="flex items-center justify-between p-1.5 bg-slate-200/80 dark:bg-[#0e1422] rounded-2xl border border-slate-300 dark:border-white/10">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300 px-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Режим визуализации:</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  viewMode === '3d'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Rotate3d className="w-4 h-4" />
                <span>3D Сборка</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  viewMode === '2d'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>2D Схема</span>
              </button>
            </div>
          </div>

          {/* Conditional Visualizer */}
          {viewMode === '3d' ? (
            <CaseVisualizer3D onSelectSlot={(slot) => setActiveModalSlot(slot)} />
          ) : (
            <CaseVisualizer2D onSelectSlot={(slot) => setActiveModalSlot(slot)} />
          )}

          {/* Compatibility Alerts & Wattage Meter */}
          <CompatibilityAlerts />

        </div>

      </div>

      {/* Embedded In-Game FPS Performance Calculator Section */}
      <div className="pt-10 border-t border-slate-200 dark:border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>FPS Benchmark Engine</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {lang === 'ru' ? 'Расчёт FPS в играх для вашей конфигурации' : 'Yig\'mangiz uchun o\'yinlarda FPS hisoblash'}
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
              {lang === 'ru'
                ? 'Мгновенный расчет частоты кадров по 20 самым тяжелым играм на низких, средних, высоких и ультра-настройках.'
                : '20 ta og\'ir o\'yinda past, o\'rta, yuqori va ultra sozlamalarda aniq kadrlar tezligini hisoblash.'}
            </p>
          </div>

          <Link
            href="/fps"
            className="flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 font-bold"
          >
            <span>{lang === 'ru' ? 'Полный экран калькулятора' : 'To\'liq hisoblagich oynasi'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Game selection chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g)}
              className={`shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedGame?.id === g.id
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                  : 'bg-white dark:bg-[#0e1422] border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <img src={g.image} alt={g.title} className="w-6 h-6 rounded-md object-cover" />
              <span>{g.title}</span>
            </button>
          ))}
        </div>

        {/* Live FPS Widget */}
        {selectedGame && (
          <FpsWidget selectedGame={selectedGame} />
        )}
      </div>

      {/* Part Selector Modal */}
      <PartSelectorModal
        slotKey={activeModalSlot}
        isOpen={Boolean(activeModalSlot)}
        onClose={() => setActiveModalSlot(null)}
      />

    </div>
  );
}
