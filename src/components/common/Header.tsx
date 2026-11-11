'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useCart } from '@/lib/cart-context';
import { useTheme } from '@/lib/theme-context';
import { 
  Cpu, 
  ShoppingCart, 
  Sliders, 
  Gamepad2, 
  Layers, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';

export function Header() {
  const { lang, setLang, t, formatPrice } = useI18n();
  const { totalItemsCount, totalPrice } = useCart();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/catalog', label: t.common.catalog, icon: Layers },
    { href: '/builder', label: t.common.builder, icon: Sliders, highlight: true },
    { href: '/fps', label: t.common.fpsCalculator, icon: Gamepad2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <Cpu className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-slate-900 dark:text-white">CYBER</span>
                <span className="font-black text-xl tracking-wider text-cyan-500 dark:text-cyan-400">MARKET</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800 font-mono ml-1">UZ</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 hidden sm:block tracking-wide">
                {lang === 'ru' ? 'Ташкент • ПК Комплектующие' : 'Toshkent • PC Qismlari'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all relative ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  } ${link.highlight ? 'ring-1 ring-cyan-500/30' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-400 dark:text-gray-400'}`} />
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Theme toggle, Lang Switcher & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-gray-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-yellow-400 hover:scale-105 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-gray-900/80 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'ru'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'uz'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                UZ
              </button>
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-gray-900/90 border border-slate-300 dark:border-cyan-500/30 hover:border-cyan-500 text-slate-900 dark:text-white transition-all group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-[11px] font-bold flex items-center justify-center text-black">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="text-slate-500 dark:text-gray-400">{t.common.cart}</div>
                <div className="font-bold text-cyan-600 dark:text-cyan-300 font-mono">
                  {totalPrice > 0 ? formatPrice(totalPrice) : `0 ${t.common.currency}`}
                </div>
              </div>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
