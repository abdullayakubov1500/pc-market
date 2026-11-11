'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useBuilder } from '@/lib/builder-context';
import { useCart } from '@/lib/cart-context';
import { FpsWidget } from '@/components/fps/FpsWidget';
import { GameSpec } from '@/lib/fps-calculator';
import { 
  Sliders, 
  Gamepad2, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Layers, 
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { lang, t, formatPrice } = useI18n();
  const { loadPreset } = useBuilder();
  const [featuredGames, setFeaturedGames] = useState<GameSpec[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameSpec | null>(null);

  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((games: GameSpec[]) => {
        if (games && games.length > 0) {
          setFeaturedGames(games);
          setSelectedGame(games[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const prebuilts = [
    {
      id: 'budget',
      titleRu: 'CYBER START 1080p',
      titleUz: 'CYBER START 1080p',
      specsRu: 'Core i5-12400F • RTX 4060 8GB • 16GB DDR4 • 1TB NVMe',
      specsUz: 'Core i5-12400F • RTX 4060 8GB • 16GB DDR4 • 1TB NVMe',
      priceUzs: 9850000,
      fpsRu: '75-100 FPS в новинках',
      fpsUz: 'Yangiliklarda 75-100 FPS',
      badge: 'Популярный выбор',
      presetKey: 'budget' as const,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'mid',
      titleRu: 'CYBER PRO 1440p',
      titleUz: 'CYBER PRO 1440p',
      specsRu: 'Ryzen 5 7500F • RTX 4070 SUPER 12GB • 32GB DDR5 • 1TB 980 Pro',
      specsUz: 'Ryzen 5 7500F • RTX 4070 SUPER 12GB • 32GB DDR5 • 1TB 980 Pro',
      priceUzs: 18200000,
      fpsRu: '110-140 FPS в 2K Ultra',
      fpsUz: '2K Ultra formatda 110-140 FPS',
      badge: 'Хит продаж',
      presetKey: 'mid' as const,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'highEnd',
      titleRu: 'CYBER MONSTER 4K',
      titleUz: 'CYBER MONSTER 4K',
      specsRu: 'Ryzen 7 7800X3D • RTX 4080 SUPER 16GB • 64GB DDR5 • 2TB 990 Pro',
      specsUz: 'Ryzen 7 7800X3D • RTX 4080 SUPER 16GB • 64GB DDR5 • 2TB 990 Pro',
      priceUzs: 34500000,
      fpsRu: '120+ FPS в 4K Ultra Ray Tracing',
      fpsUz: '4K Ultra Ray Tracingda 120+ FPS',
      badge: 'Флагман',
      presetKey: 'highEnd' as const,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/10 bg-gradient-to-b from-[#0e1524] via-[#090d14] to-[#090d14]">
        {/* Ambient lighting effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Top Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ru' ? 'Премиум гипермаркет компьютерного железа в Ташкенте' : 'Toshkentdagi premium kompyuter qismlari gipermarketi'}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            {lang === 'ru' ? (
              <>
                Собери свой <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">идеальный ПК</span> с проверкой совместимости
              </>
            ) : (
              <>
                Moslik tekshiruvi bilan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">orzuingizdagi kompyuterni</span> yig'ing
              </>
            )}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {lang === 'ru'
              ? 'Интерактивный конструктор нового поколения: автоматическая проверка сокетов, габаритов и расчет FPS в 20 самых тяжелых играх на 4-х пресетах графики.'
              : 'Yangi avlod interaktiv konstruktori: soketlar, o\'lchamlar mosligini avtomatik tekshirish va 20 ta og\'ir o\'yinda aniq FPS hisoblash.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/builder"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
            >
              <Sliders className="w-5 h-5" />
              <span>{t.common.builder}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <Link
              href="/fps"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-900/90 hover:bg-white/10 text-white font-bold text-base border border-white/20 hover:border-cyan-400 transition-all"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <span>{t.common.fpsCalculator} (20 Игр)</span>
            </Link>

            <Link
              href="/catalog"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-sm border border-white/10 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>{t.common.catalog}</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#0e1422]/60 border border-white/5 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono block">100%</span>
              <span className="text-xs text-gray-400 font-medium">
                {lang === 'ru' ? 'Контроль совместимости' : 'Moslik nazorati'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1422]/60 border border-white/5 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono block">20 Игр</span>
              <span className="text-xs text-gray-400 font-medium">
                {lang === 'ru' ? 'Бенчмарк калькулятор' : 'Og\'ir o\'yinlar bazasi'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1422]/60 border border-white/5 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">36 Мес</span>
              <span className="text-xs text-gray-400 font-medium">
                {lang === 'ru' ? 'Официальная гарантия' : 'Rasmiy kafolat'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1422]/60 border border-white/5 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">UZS</span>
              <span className="text-xs text-gray-400 font-medium">
                {lang === 'ru' ? 'Оплата в сумах / Telegram' : 'So\'mda to\'lov / Telegram'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Popular Pre-Assembled PC Systems */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Готовые конфигурации' : 'Tayyor kompyuterlar'}</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            {lang === 'ru' ? 'Популярные сбалансированные сборки' : 'Eng ko\'p tanlanadigan optimal yig\'malar'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {lang === 'ru'
              ? 'Протестированы нашими инженерами на максимальную стабильность, нагрев и бесшумность.'
              : 'Muhandislarimiz tomonidan qizish, shovqin va barqarorlik bo\'yicha to\'liq sinovdan o\'tkazilgan.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prebuilts.map((pc) => (
            <div
              key={pc.id}
              className="bg-[#0e1422] rounded-3xl border border-white/10 hover:border-cyan-500/50 p-6 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-cyan-500/10 group"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={pc.image}
                    alt={pc.titleRu}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-cyan-500 text-black font-extrabold text-[11px] shadow">
                    {pc.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-white group-hover:text-cyan-400 transition-colors">
                    {lang === 'ru' ? pc.titleRu : pc.titleUz}
                  </h3>
                  <p className="text-xs text-cyan-300/80 font-mono mt-1">
                    {lang === 'ru' ? pc.specsRu : pc.specsUz}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400">{lang === 'ru' ? 'Производительность:' : 'Tezlik:'}</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {lang === 'ru' ? pc.fpsRu : pc.fpsUz}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono block">Цена с гарантией</span>
                  <span className="text-xl font-black text-cyan-300 font-mono">
                    {formatPrice(pc.priceUzs)}
                  </span>
                </div>

                <Link
                  href="/builder"
                  onClick={() => loadPreset(pc.presetKey)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold text-xs border border-cyan-500/30 transition-all flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'В конструктор' : 'Konstruktorda ochish'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive FPS Benchmark Preview Station */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Интерактивный расчет FPS' : 'Interaktiv FPS hisoblagich'}</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              {lang === 'ru' ? 'Проверьте FPS в 20 самых тяжелых играх' : '20 ta eng og\'ir o\'yinda FPS ko\'rsatkichlarini sinang'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {lang === 'ru'
                ? 'Выберите любую игру и переключайте пресеты графики от Low до Ultra.'
                : 'Istalgan o\'yinni tanlang va Low dan Ultra gacha sozlamalarni sinab ko\'ring.'}
            </p>
          </div>

          <Link
            href="/fps"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm"
          >
            <span>{lang === 'ru' ? 'Посмотреть все 20 игр' : 'Barcha 20 ta o\'yinni ko\'rish'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Selected Game Widget */}
        {selectedGame && (
          <div className="mb-8">
            <FpsWidget selectedGame={selectedGame} />
          </div>
        )}

        {/* Quick game selector chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          {featuredGames.slice(0, 10).map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g)}
              className={`shrink-0 flex items-center gap-3 p-2 pr-4 rounded-2xl border transition-all ${
                selectedGame?.id === g.id
                  ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-[#0e1422] border-white/10 text-gray-300 hover:border-white/30'
              }`}
            >
              <img src={g.image} alt={g.title} className="w-10 h-10 rounded-xl object-cover" />
              <div className="text-left">
                <span className="text-xs font-bold block truncate max-w-[150px]">{g.title}</span>
                <span className="text-[10px] text-gray-400">{g.releaseYear}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Service Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0e1422] border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                {lang === 'ru' ? 'Автоматическая совместимость' : 'Avtomatik moslik tekshiruvi'}
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'ru'
                  ? 'Никаких ошибок: система проверяет сокеты процессора, тип памяти DDR4/DDR5 и вместимость корпуса.'
                  : 'Xatoliklar yo\'q: tizim CPU soketlari, DDR4/DDR5 turi va korpus o\'lchamlarini avtomatik tekshiradi.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e1422] border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                {lang === 'ru' ? '3 года официальной гарантии' : '3 yil rasmiy kafolat'}
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'ru'
                  ? 'Только оригинальные сертифицированные комплектующие с гарантийным талоном и сервисным обслуживанием в Ташкенте.'
                  : 'Faqat kafolat taloni va Toshkentdagi servis xizmatiga ega bo\'lgan original sertifikatlangan qismlar.'}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0e1422] border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                {lang === 'ru' ? 'Быстрая доставка и Telegram чек' : 'Tezkor yetkazish va Telegram chek'}
              </h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {lang === 'ru'
                  ? 'Доставка готового ПК за 24 часа. Мгновенная отправка электронного чека и спецификации сборки в ваш Telegram.'
                  : 'Tayyor kompyuter 24 soat ichida yetkaziladi. To\'liq yig\'ma cheki va hisob-kitob Telegramingizga yuboriladi.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
