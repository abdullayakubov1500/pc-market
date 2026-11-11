'use client';

import React, { useState, useEffect } from 'react';
import { useBuilder } from '@/lib/builder-context';
import { useI18n } from '@/lib/i18n/context';
import { ProductSpec, BuildConfiguration } from '@/lib/compatibility';
import { 
  X, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Cpu, 
  CircuitBoard, 
  Layers, 
  Monitor, 
  Fan, 
  HardDrive, 
  Zap, 
  Box 
} from 'lucide-react';

interface PartSelectorModalProps {
  slotKey: keyof BuildConfiguration | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PartSelectorModal({
  slotKey,
  isOpen,
  onClose,
}: PartSelectorModalProps) {
  const { setPart, isCompatibleWithCurrentBuild } = useBuilder();
  const { lang, t, formatPrice } = useI18n();
  const [products, setProducts] = useState<ProductSpec[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [onlyCompatible, setOnlyCompatible] = useState(true);

  useEffect(() => {
    if (!isOpen || !slotKey) return;

    setLoading(true);
    fetch(`/api/products?categoryId=${slotKey}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [isOpen, slotKey]);

  if (!isOpen || !slotKey) return null;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameRu.toLowerCase().includes(search.toLowerCase()) ||
      p.nameUz.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (onlyCompatible) {
      const check = isCompatibleWithCurrentBuild(slotKey, p);
      if (!check.compatible) return false;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e1422] border border-cyan-500/30 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="text-cyan-400 uppercase font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                {slotKey.toUpperCase()}
              </span>
              <span>{t.builder.slots[slotKey]}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'ru'
                ? 'Выберите подходящую комплектующую для вашей конфигурации'
                : 'Yig\'mangiz uchun mos qismni tanlang'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-white/5 bg-[#0a0f19] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.common.search}
              className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer self-start sm:self-auto select-none">
            <input
              type="checkbox"
              checked={onlyCompatible}
              onChange={(e) => setOnlyCompatible(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-black/50 border-white/20 accent-cyan-500"
            />
            <span className="flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              {t.builder.onlyCompatible}
            </span>
          </label>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-white/5">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p>{t.common.loading}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-sm font-medium">
                {lang === 'ru' ? 'Нет подходящих товаров' : 'Mos tovarlar topilmadi'}
              </p>
              {onlyCompatible && (
                <button
                  type="button"
                  onClick={() => setOnlyCompatible(false)}
                  className="mt-2 text-xs text-cyan-400 hover:underline"
                >
                  {lang === 'ru' ? 'Показать несовместимые товары' : 'Mos kelmaydigan tovarlarni ham ko\'rsatish'}
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const compCheck = isCompatibleWithCurrentBuild(slotKey, prod);

              return (
                <div
                  key={prod.id}
                  className={`pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-xl transition-all ${
                    compCheck.compatible
                      ? 'bg-black/20 hover:bg-white/[0.03]'
                      : 'bg-rose-950/10 border border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.model}
                      className="w-14 h-14 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                          {prod.brand}
                        </span>
                        {!compCheck.compatible && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            {lang === 'ru' ? 'Несовместимо' : 'Mos kelmaydi'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">
                        {lang === 'ru' ? prod.nameRu : prod.nameUz}
                      </h4>

                      {/* Reasons if incompatible */}
                      {!compCheck.compatible && (
                        <p className="text-[11px] text-rose-300 mt-0.5 font-sans">
                          {lang === 'ru' ? compCheck.reasonRu : compCheck.reasonUz}
                        </p>
                      )}

                      {/* Specs pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {prod.socket && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">
                            {prod.socket}
                          </span>
                        )}
                        {prod.ramType && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                            {prod.ramType}
                          </span>
                        )}
                        {prod.capacityGb && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                            {prod.capacityGb} GB
                          </span>
                        )}
                        {prod.tdp && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-mono">
                            {prod.tdp}W
                          </span>
                        )}
                        {prod.gpuLength && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                            {prod.gpuLength} mm
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                    <span className="font-bold text-cyan-300 font-mono text-base">
                      {formatPrice(prod.priceUzs)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPart(slotKey, prod);
                        onClose();
                      }}
                      className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        compCheck.compatible
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-black border border-rose-500/40'
                      }`}
                    >
                      {t.common.select}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
