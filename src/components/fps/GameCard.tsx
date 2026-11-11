'use client';

import React from 'react';
import { GameSpec, QualityPreset, Resolution, calculateFps } from '@/lib/fps-calculator';
import { useI18n } from '@/lib/i18n/context';

interface GameCardProps {
  game: GameSpec;
  isSelected: boolean;
  onSelect: () => void;
  cpuScore?: number;
  gpuScore?: number;
  ramGb?: number;
  resolution: Resolution;
  preset: QualityPreset;
}

export function GameCard({
  game,
  isSelected,
  onSelect,
  cpuScore = 2800,
  gpuScore = 12000,
  ramGb = 16,
  resolution,
  preset,
}: GameCardProps) {
  const { lang } = useI18n();

  const fpsData = calculateFps(game, cpuScore, gpuScore, ramGb, resolution, preset);

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
        isSelected
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-500/20 scale-[1.02]'
          : 'border-white/10 hover:border-white/30 bg-[#0e1422] hover:bg-[#121929]'
      }`}
    >
      {/* Background Cover Image with gradient overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-[#0e1422]/60 to-transparent" />

        {/* Year & Genre Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
            {game.releaseYear}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-gray-300 border border-white/10">
            {game.genre.split('/')[0]}
          </span>
        </div>

        {/* Live FPS Badge */}
        <div className="absolute bottom-2.5 right-2.5">
          <div className="flex items-baseline gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
            <span className="font-black text-cyan-400 text-lg font-mono">
              {fpsData.currentFps}
            </span>
            <span className="text-[10px] font-bold text-gray-400">FPS</span>
          </div>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3.5 space-y-2">
        <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
          {game.title}
        </h4>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
          {lang === 'ru' ? game.descriptionRu : game.descriptionUz}
        </p>

        {/* Mini Playability bar */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
          <span className="text-gray-400 font-mono uppercase">{preset} @ {resolution}</span>
          <span className={`px-2 py-0.5 rounded font-bold border ${fpsData.playability.badgeColor}`}>
            {lang === 'ru' ? fpsData.playability.labelRu.split('(')[0] : fpsData.playability.labelUz.split('(')[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
