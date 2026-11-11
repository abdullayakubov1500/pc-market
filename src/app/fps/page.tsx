'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useBuilder } from '@/lib/builder-context';
import { GameSpec, QualityPreset, Resolution } from '@/lib/fps-calculator';
import { FpsWidget } from '@/components/fps/FpsWidget';
import { GameCard } from '@/components/fps/GameCard';
import { 
  Gamepad2, 
  Search, 
  Cpu, 
  Sliders, 
  Filter, 
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function FpsPage() {
  const { lang, t } = useI18n();
  const { build, loadPreset } = useBuilder();

  const [games, setGames] = useState<GameSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameSpec | null>(null);
  const [search, setSearch] = useState('');
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [preset, setPreset] = useState<QualityPreset>('high');

  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data: GameSpec[]) => {
        setGames(data);
        if (data && data.length > 0) setSelectedGame(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const cpuScore = build.cpu?.cpuScore || 2850;
  const gpuScore = build.gpu?.gpuScore || 10800;
  const ramGb = build.ram?.capacityGb || 16;

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>20 Heavy AAA Benchmarks Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t.fps.title}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {t.fps.subtitle}
          </p>
        </div>

        {/* Current hardware specs being evaluated */}
        <div className="p-3 rounded-2xl bg-[#0e1422] border border-white/10 flex items-center gap-3 text-xs">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-mono">
              {build.cpu || build.gpu ? 'Текущая сборка:' : 'Базовая сборка:'}
            </span>
            <span className="font-bold text-white block">
              {build.cpu ? build.cpu.model : 'i5-12400F'} + {build.gpu ? build.gpu.model : 'RTX 4060'}
            </span>
          </div>
          <Link
            href="/builder"
            className="ml-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold text-[11px] border border-cyan-500/30 transition-all"
          >
            {t.common.change}
          </Link>
        </div>
      </div>

      {/* Main Focus: Selected Game Benchmark Widget */}
      {selectedGame && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>{t.fps.selectGame}</span>
            <span className="text-cyan-400 font-bold">{selectedGame.title}</span>
          </div>
          <FpsWidget selectedGame={selectedGame} />
        </div>
      )}

      {/* 20 Games Grid Controls */}
      <div className="pt-6 border-t border-white/10 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-cyan-400" />
              <span>{t.fps.gamesList} (20 Игр)</span>
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {lang === 'ru'
                ? 'Нажмите на любую карточку игры, чтобы развернуть подробный отчёт'
                : 'Batafsil ma\'lumotni ko\'rish uchun o\'yin kartasini bosing'}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск игры по названию..."
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Global Controls for Grid: Resolution & Preset Quick-Switch */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e1422] border border-white/10">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{t.fps.resolution}:</span>
            {(['1080p', '1440p', '4K'] as Resolution[]).map((r) => (
              <button
                key={r}
                onClick={() => setResolution(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  resolution === r
                    ? 'bg-cyan-500 text-black shadow'
                    : 'bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{t.fps.preset}:</span>
            {(['low', 'medium', 'high', 'ultra'] as QualityPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                  preset === p
                    ? 'bg-cyan-500 text-black shadow'
                    : 'bg-black/50 text-gray-400 hover:text-white'
                }`}
              >
                {t.fps[p]}
              </button>
            ))}
          </div>

        </div>

        {/* 20 Games Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-400 text-sm">{t.common.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={selectedGame?.id === game.id}
                onSelect={() => {
                  setSelectedGame(game);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                cpuScore={cpuScore}
                gpuScore={gpuScore}
                ramGb={ramGb}
                resolution={resolution}
                preset={preset}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
