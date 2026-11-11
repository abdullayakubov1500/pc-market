'use client';

import React from 'react';
import { useBuilder } from '@/lib/builder-context';
import { useI18n } from '@/lib/i18n/context';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Info, 
  ShieldAlert 
} from 'lucide-react';

export function CompatibilityAlerts() {
  const { compatibility, build } = useBuilder();
  const { lang, t } = useI18n();

  const psuWattage = build.psu?.psuWattage || 0;
  const wattagePercent = psuWattage > 0 
    ? Math.min(100, Math.round((compatibility.estimatedWattage / psuWattage) * 100))
    : 0;

  return (
    <div className="space-y-4">
      
      {/* Power Consumption Gauge */}
      <div className="bg-[#0e1422] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t.builder.estimatedWattage}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {compatibility.estimatedWattage} W
            {psuWattage > 0 && <span className="text-gray-400 font-normal"> / {psuWattage} W</span>}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              psuWattage === 0
                ? 'bg-cyan-500 w-1/4'
                : wattagePercent > 90
                ? 'bg-rose-500'
                : wattagePercent > 75
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: psuWattage > 0 ? `${wattagePercent}%` : '35%' }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
          <span>{t.builder.recommendedPsu}: <strong className="text-amber-300 font-mono">{compatibility.recommendedPsuWattage}W</strong></span>
          {psuWattage > 0 && (
            <span>Загрузка БП: <strong className={wattagePercent > 85 ? 'text-rose-400' : 'text-emerald-400'}>{wattagePercent}%</strong></span>
          )}
        </div>
      </div>

      {/* Compatibility Status Banner */}
      {compatibility.isCompatible ? (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-emerald-300 font-bold text-sm">
              {t.builder.allCompatible}
            </h4>
            <p className="text-xs text-emerald-200/70 mt-0.5">
              {lang === 'ru'
                ? 'Сокеты, слоты памяти, габариты видеокарты и системы охлаждения идеально согласованы.'
                : 'Soketlar, xotira slotlari, videokarta va sovutish tizimi o\'lchamlari to\'liq mos keladi.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <h4 className="text-rose-300 font-bold text-sm">
              {t.builder.incompatibleDetected}
            </h4>
          </div>

          <div className="space-y-2">
            {compatibility.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                  issue.type === 'error'
                    ? 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                    : 'bg-amber-950/50 border-amber-500/30 text-amber-200'
                }`}
              >
                {issue.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{lang === 'ru' ? issue.messageRu : issue.messageUz}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
