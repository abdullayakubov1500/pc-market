'use client';

import React, { useState } from 'react';
import { GameSpec, QualityPreset, Resolution, calculateFps } from '@/lib/fps-calculator';
import { useBuilder } from '@/lib/builder-context';
import { useI18n } from '@/lib/i18n/context';
import { 
  Monitor, 
  Cpu, 
  Gamepad2, 
  Sparkles, 
  Gauge, 
  CheckCircle, 
  Layers,
  ArrowRight,
  SlidersHorizontal 
} from 'lucide-react';
import Link from 'next/link';

interface FpsWidgetProps {
  selectedGame: GameSpec | null;
  onSelectGame?: (game: GameSpec) => void;
}

export function FpsWidget({ selectedGame }: FpsWidgetProps) {
  const { build, loadPreset } = useBuilder();
  const { lang, t } = useI18n();

  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [preset, setPreset] = useState<QualityPreset>('high');

  // Fallback hardware scores if builder is empty
  const cpuScore = build.cpu?.cpuScore || 2850;
  const gpuScore = build.gpu?.gpuScore || 10800;
  const ramGb = build.ram?.capacityGb || 16;

  const isCustomBuild = Boolean(build.cpu || build.gpu);

  if (!selectedGame) return null;

  const fpsData = calculateFps(
    selectedGame,
    cpuScore,
    gpuScore,
    ramGb,
    resolution,
    preset
  );

  const presets: QualityPreset[] = ['low', 'medium', 'high', 'ultra'];
  const resolutions: Resolution[] = ['1080p', '1440p', '4K'];

  return (
    <div className="bg-[#0e1422] border border-cyan-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Game info + Resolution & Preset Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
        
        {/* Game Title & Genre */}
        <div className="flex items-center gap-4">
          <img
            src={selectedGame.image}
            alt={selectedGame.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                {selectedGame.releaseYear}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {selectedGame.genre}
              </span>
            </div>
            <h3 className="font-black text-xl sm:text-2xl text-white">
              {selectedGame.title}
            </h3>
          </div>
        </div>

        {/* Resolution Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10">
            {resolutions.map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  resolution === res
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {res === '1080p' ? 'Full HD (1080p)' : res === '1440p' ? '2K QHD (1440p)' : '4K Ultra HD'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Hardware Under Test Bar */}
      <div className="my-5 p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 font-mono uppercase text-[11px] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            {lang === 'ru' ? 'Конфигурация теста:' : 'Sinovdagi tizim:'}
          </span>
          <span className="text-white font-bold">
            {build.cpu ? build.cpu.model : 'Intel Core i5-12400F'}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-cyan-400 font-bold">
            {build.gpu ? build.gpu.model : 'NVIDIA RTX 4060 8GB'}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-amber-400 font-mono">
            {ramGb} GB RAM
          </span>
        </div>

        {!isCustomBuild ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px] hidden sm:inline">
              {lang === 'ru' ? 'Тест пресетов:' : 'Tayyor yig\'malar:'}
            </span>
            <button
              onClick={() => loadPreset('budget')}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 rounded border border-white/10 text-[11px]"
            >
              Бюджетный
            </button>
            <button
              onClick={() => loadPreset('mid')}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 rounded border border-white/10 text-[11px]"
            >
              Оптимальный
            </button>
            <button
              onClick={() => loadPreset('highEnd')}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 rounded border border-white/10 text-[11px]"
            >
              Топовый
            </button>
          </div>
        ) : (
          <Link
            href="/builder"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold text-xs"
          >
            <span>{lang === 'ru' ? 'Изменить в конфигураторе' : 'Konstruktorda o\'zgartirish'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Main Grid: FPS Score & Presets Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column (5 Cols): Big Hero FPS meter */}
        <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-1">
            {resolution} • {preset.toUpperCase()} PRESET
          </span>

          <div className="flex items-baseline justify-center gap-2 my-2">
            <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 font-mono tracking-tight">
              {fpsData.currentFps}
            </span>
            <span className="text-lg font-bold text-gray-400 font-mono">FPS</span>
          </div>

          <div className={`mt-2 px-3.5 py-1.5 rounded-xl font-bold text-xs border ${fpsData.playability.badgeColor}`}>
            {lang === 'ru' ? fpsData.playability.labelRu : fpsData.playability.labelUz}
          </div>

          {/* Quality Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5 w-full mt-6 bg-[#0a0f19] p-1.5 rounded-xl border border-white/10">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPreset(p)}
                className={`py-2 rounded-lg font-bold text-xs transition-all uppercase ${
                  preset === p
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.fps[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): 4 Presets Performance Bars & Bottleneck Analyzer */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Comparison across all 4 presets */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
              <span>{lang === 'ru' ? 'Производительность по всем пресетам графики' : 'Barcha grafika sozlamalari bo\'yicha kadrlar soni'}</span>
              <span className="text-cyan-400 font-mono">{resolution}</span>
            </h4>

            <div className="space-y-3 pt-2">
              {presets.map((p) => {
                const fps = fpsData.fpsByPreset[p];
                const maxScale = 160;
                const percentage = Math.min(100, Math.round((fps / maxScale) * 100));

                return (
                  <div key={p} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-300 uppercase font-mono">{t.fps[p]}</span>
                      <span className="font-mono text-cyan-300 font-bold">{fps} FPS</span>
                    </div>
                    <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          fps >= 120
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                            : fps >= 60
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            : fps >= 35
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottleneck Analyzer Card */}
          <div className="bg-[#0a0f19] border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <Gauge className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.fps.bottleneckAnalysis}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  fpsData.bottleneck.type === 'balanced'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {lang === 'ru' ? fpsData.bottleneck.titleRu : fpsData.bottleneck.titleUz}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'ru' ? fpsData.bottleneck.detailsRu : fpsData.bottleneck.detailsUz}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
