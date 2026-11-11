'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ProductSpec, BuildConfiguration } from '@/lib/compatibility';
import { 
  Cpu, 
  CircuitBoard, 
  Layers, 
  Monitor, 
  Fan, 
  HardDrive, 
  Zap, 
  Box, 
  Plus, 
  Trash2, 
  RefreshCw 
} from 'lucide-react';

interface SlotItemProps {
  slotKey: keyof BuildConfiguration;
  title: string;
  product: ProductSpec | null;
  onOpenSelector: () => void;
  onRemove: () => void;
}

const slotIcons: Record<keyof BuildConfiguration, React.ElementType> = {
  cpu: Cpu,
  motherboard: CircuitBoard,
  ram: Layers,
  gpu: Monitor,
  cooler: Fan,
  storage: HardDrive,
  psu: Zap,
  case: Box,
};

export function SlotItem({
  slotKey,
  title,
  product,
  onOpenSelector,
  onRemove,
}: SlotItemProps) {
  const { lang, formatPrice, t } = useI18n();
  const Icon = slotIcons[slotKey] || Box;

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border transition-all ${
        product
          ? 'bg-[#111726]/80 border-cyan-500/30 hover:border-cyan-500/50'
          : 'bg-[#0e131d]/60 border-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Icon & Slot name or selected part */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              product
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              {title}
            </span>

            {product ? (
              <div className="truncate">
                <span className="font-bold text-white text-sm block truncate">
                  {lang === 'ru' ? product.nameRu : product.nameUz}
                </span>
                
                {/* Specs chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {product.socket && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
                      {product.socket}
                    </span>
                  )}
                  {product.ramType && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
                      {product.ramType}
                    </span>
                  )}
                  {product.capacityGb && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                      {product.capacityGb} GB
                    </span>
                  )}
                  {product.tdp && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-mono">
                      {product.tdp}W TDP
                    </span>
                  )}
                  {product.psuWattage && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
                      {product.psuWattage}W
                    </span>
                  )}
                  {product.gpuLength && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                      {product.gpuLength} mm
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-xs text-gray-500 italic block mt-0.5">
                {t.builder.choosePart}
              </span>
            )}
          </div>
        </div>

        {/* Right: Price & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {product ? (
            <>
              <div className="text-right">
                <span className="font-bold text-cyan-300 font-mono text-sm sm:text-base block">
                  {formatPrice(product.priceUzs)}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenSelector}
                title={t.common.change}
                className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 border border-white/10 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                title={t.builder.removePart}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenSelector}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-black font-semibold text-xs border border-cyan-500/30 hover:border-cyan-500 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.common.select}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
