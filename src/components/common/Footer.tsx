'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { Cpu, Phone, MapPin, Clock, ShieldCheck, Truck, Wrench, Send } from 'lucide-react';

export function Footer() {
  const { lang, t } = useI18n();

  return (
    <footer className="bg-slate-100 dark:bg-[#080b0f] border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 text-sm mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg tracking-wider text-slate-900 dark:text-white">
                CYBER<span className="text-cyan-500 dark:text-cyan-400">MARKET</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-gray-400">
              {lang === 'ru' 
                ? 'Крупнейший специализированный гипермаркет компьютерных комплектующих в Узбекистане. Официальная гарантия до 36 месяцев на все детали.' 
                : "O'zbekistondagi eng yirik ixtisoslashtirilgan kompyuter qismlari gipermarketi. Barcha qismlarga 36 oygacha rasmiy kafolat."}
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>{lang === 'ru' ? '100% Оригинальная продукция' : '100% Original mahsulotlar'}</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {lang === 'ru' ? 'Навигация' : 'Bo\'limlar'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  {t.common.catalog}
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>{t.common.builder} (3D / 2D)</span>
                  <span className="text-[10px] px-1 bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 rounded border border-cyan-300 dark:border-cyan-700/50">3D</span>
                </Link>
              </li>
              <li>
                <Link href="/fps" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  {t.common.fpsCalculator} (20 Games)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  {t.common.cart}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Advantages */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {lang === 'ru' ? 'Преимущества' : 'Afzalliklarimiz'}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>{lang === 'ru' ? 'Быстрая экспресс-доставка по Ташкенту и в регионы Узбекистана' : "Toshkent va viloyatlar bo'ylab tezkor yetkazib berish"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Wrench className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>{lang === 'ru' ? 'Бесплатная сборка и кабель-менеджмент при заказе ПК' : "Kompyuter buyurtma qilinganda bepul yig'ish va kabel tekislash"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Send className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>{lang === 'ru' ? 'Электронный чек с деталями сборки прямо в Telegram' : "To'liq hisob-kitob cheki to'g'ridan-to'g'ri Telegramga"}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {lang === 'ru' ? 'Контакты' : 'Bog\'lanish'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span className="text-slate-900 dark:text-white font-mono">{t.common.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>{t.common.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>{t.common.workingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-gray-500 gap-4">
          <p>© 2026 CYBER-MARKET.UZ. {t.common.allRightsReserved}</p>
          <p className="font-mono text-cyan-600 dark:text-cyan-500/60">Валюта: Узбекский сум (UZS)</p>
        </div>
      </div>
    </footer>
  );
}
