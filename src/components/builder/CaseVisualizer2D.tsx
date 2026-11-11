'use client';

import React from 'react';
import { useBuilder } from '@/lib/builder-context';
import { useI18n } from '@/lib/i18n/context';
import { Cpu, HardDrive, Layers, Zap, Fan, Monitor, Box, CheckCircle2, AlertCircle } from 'lucide-react';
import { BuildConfiguration } from '@/lib/compatibility';

interface CaseVisualizer2DProps {
  onSelectSlot: (slot: keyof BuildConfiguration) => void;
}

export function CaseVisualizer2D({ onSelectSlot }: CaseVisualizer2DProps) {
  const { build, compatibility } = useBuilder();
  const { lang, t, formatPrice } = useI18n();

  const totalParts = Object.values(build).filter(Boolean).length;

  return (
    <div className="bg-[#0e1420] border border-cyan-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background neon ambient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar inside visualizer */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-bold text-white text-base tracking-wide">
              {t.builder.visualPreview}
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {lang === 'ru'
              ? `Установлено: ${totalParts} из 8 компонентов`
              : `O'rnatildi: 8 tadan ${totalParts} ta qism`}
          </p>
        </div>

        {/* Compatibility badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            compatibility.isCompatible
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {compatibility.isCompatible ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ru' ? '100% Совместимо' : '100% Mos'}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Конфликт!' : 'Xatolik bor!'}</span>
            </>
          )}
        </div>
      </div>

      {/* 2D Cutaway Schematic of PC Case */}
      <div className="relative aspect-[4/3] w-full max-w-xl mx-auto bg-black/40 rounded-xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
        
        {/* Case Chassis Outer Frame Label */}
        <div 
          onClick={() => onSelectSlot('case')}
          className={`absolute top-2 left-2 right-2 text-center py-1 rounded text-[11px] font-mono cursor-pointer transition-all border ${
            build.case 
              ? 'bg-white/5 border-white/20 text-gray-300 hover:border-cyan-400' 
              : 'bg-cyan-950/30 border-dashed border-cyan-800 text-cyan-400 hover:bg-cyan-900/30'
          }`}
        >
          {build.case ? `Корпус: ${build.case.model} (${build.case.formFactor})` : `+ Нажмите, чтобы выбрать корпус`}
        </div>

        {/* Main Motherboard Area */}
        <div 
          onClick={() => onSelectSlot('motherboard')}
          className={`mt-7 mb-2 flex-1 rounded-xl border-2 transition-all p-3 relative cursor-pointer flex flex-col justify-between ${
            build.motherboard
              ? 'bg-blue-950/20 border-blue-500/40 hover:border-blue-400'
              : 'bg-white/[0.02] border-dashed border-white/10 hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <span>{build.motherboard ? build.motherboard.model : 'Слот материнской платы (ATX / mATX)'}</span>
            {build.motherboard && (
              <span className="text-cyan-400">{build.motherboard.socket} • {build.motherboard.ramType}</span>
            )}
          </div>

          {/* Upper Motherboard area: CPU socket, Cooler, RAM slots */}
          <div className="grid grid-cols-12 gap-3 my-2 items-center">
            
            {/* CPU & Cooler Area (Cols 1-7) */}
            <div className="col-span-7 flex items-center gap-2">
              {/* CPU Slot */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSlot('cpu');
                }}
                className={`w-20 h-20 rounded-lg border-2 p-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  build.cpu
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-black/50 border-dashed border-white/20 hover:border-cyan-400'
                }`}
              >
                <Cpu className={`w-6 h-6 ${build.cpu ? 'text-cyan-400' : 'text-gray-500'}`} />
                <span className="text-[10px] font-bold text-white truncate max-w-full mt-1">
                  {build.cpu ? build.cpu.model.split(' ')[0] + ' ' + (build.cpu.model.split(' ')[1] || '') : 'CPU'}
                </span>
                <span className="text-[8px] text-cyan-300 font-mono">
                  {build.cpu ? `${build.cpu.tdp}W` : 'Сокет'}
                </span>
              </div>

              {/* Cooler Slot */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSlot('cooler');
                }}
                className={`flex-1 h-20 rounded-lg border-2 p-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  build.cooler
                    ? 'bg-indigo-950/60 border-indigo-400 shadow-md shadow-indigo-500/20'
                    : 'bg-black/50 border-dashed border-white/20 hover:border-indigo-400'
                }`}
              >
                <Fan className={`w-6 h-6 ${build.cooler ? 'text-indigo-400 animate-spin-slow' : 'text-gray-500'}`} />
                <span className="text-[10px] font-bold text-white truncate max-w-full mt-1">
                  {build.cooler ? build.cooler.model : 'Кулер / СЖО'}
                </span>
                <span className="text-[8px] text-indigo-300 font-mono">
                  {build.cooler ? build.cooler.coolerType : 'Охлаждение'}
                </span>
              </div>
            </div>

            {/* RAM Slots (Cols 8-10) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSlot('ram');
              }}
              className={`col-span-3 h-20 rounded-lg border-2 p-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
                build.ram
                  ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-black/50 border-dashed border-white/20 hover:border-amber-400'
              }`}
            >
              <Layers className={`w-5 h-5 ${build.ram ? 'text-amber-400' : 'text-gray-500'}`} />
              <span className="text-[9px] font-bold text-white truncate max-w-full mt-1">
                {build.ram ? `${build.ram.capacityGb}GB ${build.ram.ramType}` : 'RAM'}
              </span>
              <span className="text-[8px] text-amber-300 font-mono">
                {build.ram ? `${build.ram.speedMhz}MHz` : 'Слоты памяти'}
              </span>
            </div>

            {/* Storage M.2 Slot (Cols 11-12) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSlot('storage');
              }}
              className={`col-span-2 h-20 rounded-lg border-2 p-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
                build.storage
                  ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-500/20'
                  : 'bg-black/50 border-dashed border-white/20 hover:border-purple-400'
              }`}
            >
              <HardDrive className={`w-4 h-4 ${build.storage ? 'text-purple-400' : 'text-gray-500'}`} />
              <span className="text-[8px] font-bold text-white truncate max-w-full mt-1">
                {build.storage ? `${build.storage.capacityGb}GB` : 'M.2 SSD'}
              </span>
            </div>

          </div>

          {/* Lower Motherboard area: GPU PCIe Slot */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectSlot('gpu');
            }}
            className={`w-full h-16 rounded-xl border-2 p-2 flex items-center justify-between cursor-pointer transition-all ${
              build.gpu
                ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'bg-black/50 border-dashed border-white/20 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Monitor className={`w-6 h-6 ${build.gpu ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {build.gpu ? build.gpu.model : 'Слот PCIe x16 (Видеокарта)'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {build.gpu ? `${build.gpu.capacityGb}GB VRAM • ${build.gpu.tdp}W • Длина: ${build.gpu.gpuLength}мм` : 'Нажмите для добавления GPU'}
                </span>
              </div>
            </div>
            {build.gpu && (
              <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">
                Active
              </span>
            )}
          </div>

        </div>

        {/* Bottom Shroud: Power Supply Unit (PSU) */}
        <div
          onClick={() => onSelectSlot('psu')}
          className={`h-14 rounded-xl border-2 px-3 py-2 flex items-center justify-between cursor-pointer transition-all ${
            build.psu
              ? 'bg-amber-950/30 border-amber-500/60 shadow-md shadow-amber-500/10'
              : 'bg-white/[0.02] border-dashed border-white/20 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${build.psu ? 'text-amber-400' : 'text-gray-500'}`} />
            <div>
              <span className="text-xs font-bold text-white block">
                {build.psu ? build.psu.model : 'Нижний отсек: Блок питания (PSU)'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {build.psu ? `${build.psu.psuWattage}W • ${build.psu.psuCertification}` : 'Нажмите для выбора блока питания'}
              </span>
            </div>
          </div>
          <div className="text-right font-mono text-[11px]">
            <span className="text-gray-400 block">Нагрузка</span>
            <span className={compatibility.estimatedWattage > (build.psu?.psuWattage || 0) && build.psu ? 'text-red-400 font-bold' : 'text-cyan-400'}>
              ~{compatibility.estimatedWattage} W
            </span>
          </div>
        </div>

      </div>

      {/* Summary Footer bar inside visualizer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-gray-400 font-mono">
          TDP: <span className="text-cyan-400 font-bold">{compatibility.estimatedWattage}W</span> / Реком. БП: <span className="text-amber-400 font-bold">{compatibility.recommendedPsuWattage}W</span>
        </span>
        <span className="text-white font-bold text-sm font-mono">
          {formatPrice(compatibility.totalPriceUzs)}
        </span>
      </div>
    </div>
  );
}
