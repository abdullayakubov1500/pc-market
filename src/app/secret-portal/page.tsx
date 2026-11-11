'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Layers, 
  Gamepad2, 
  ShoppingCart, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  Cpu, 
  Box, 
  Eye, 
  AlertCircle,
  FileText,
  File,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSecretPortalPage() {
  const { formatPrice, lang } = useI18n();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'games' | 'telegram'>('orders');

  // Admin Data
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    nameRu: '',
    nameUz: '',
    brand: '',
    model: '',
    categoryId: 'cpu',
    priceUzs: '',
    socket: '',
    ramType: '',
    tdp: '',
    gpuLength: '',
    psuWattage: '',
    cpuScore: '',
    gpuScore: '',
  });

  // New Game Form State
  const [newGame, setNewGame] = useState({
    title: '',
    genre: 'Action RPG',
    releaseYear: '2024',
    gpuIntensity: '2.0',
    cpuIntensity: '1.5',
    baseFps1080pUltra: '60',
    ramMinGb: '16',
    descriptionRu: '',
    descriptionUz: '',
  });

  const [telegramStatusNotice, setTelegramStatusNotice] = useState<string | null>(null);

  // Check login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setLoginError('Неверный секретный ключ или PIN. Попробуйте 2026');
      }
    } catch {
      setLoginError('Ошибка аутентификации');
    }
  };

  const loadAdminData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/orders').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/games').then((r) => r.json()),
    ])
      .then(([ordersData, productsData, gamesData]) => {
        setOrders(ordersData || []);
        setProducts(productsData || []);
        setGames(gamesData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTelegramReceipt = async (orderId: string) => {
    setTelegramStatusNotice(`Отправка чека для заказа...`);
    try {
      const res = await fetch('/api/telegram/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramStatusNotice(`Чек успешно отправлен! Ссылка: ${data.botDeepLink}`);
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, telegramReceiptSent: true } : o)));
      } else {
        setTelegramStatusNotice(`Ошибка отправки: ${data.error}`);
      }
    } catch (err: any) {
      setTelegramStatusNotice(`Ошибка: ${err.message}`);
    }
    setTimeout(() => setTelegramStatusNotice(null), 5000);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts([data.product, ...products]);
        setNewProd({
          nameRu: '',
          nameUz: '',
          brand: '',
          model: '',
          categoryId: 'cpu',
          priceUzs: '',
          socket: '',
          ramType: '',
          tdp: '',
          gpuLength: '',
          psuWattage: '',
          cpuScore: '',
          gpuScore: '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Удалить данный товар из базы?')) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGames([data.game, ...games]);
        setNewGame({
          title: '',
          genre: 'Action RPG',
          releaseYear: '2024',
          gpuIntensity: '2.0',
          cpuIntensity: '1.5',
          baseFps1080pUltra: '60',
          ramMinGb: '16',
          descriptionRu: '',
          descriptionUz: '',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If not authenticated, render Passcode / PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#0e1422] border border-slate-300 dark:border-cyan-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-500 dark:text-cyan-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Скрытый доступ администратора
            </h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Введите PIN-код или секретный ключ для входа в панель управления
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Секретный ключ (по умолчанию: 2026)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono tracking-widest text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              Войти в панель управления
            </button>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-gray-500 font-mono">
            CYBER-MARKET.UZ • Vault Security
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalUzs || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Скрытый доступ авторизован
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Панель Управления Магазином
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
            Управление заказами, комплектующими, базой 20 игр и Telegram-ботом
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-white/10 text-xs font-bold transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Обновить данные</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-gray-400 font-mono uppercase block">Всего заказов</span>
          <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono">{orders.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-gray-400 font-mono uppercase block">Оборот в сумах</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono truncate block">
            {formatPrice(totalRevenue)}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-gray-400 font-mono uppercase block">Товаров в каталоге</span>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">{products.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-gray-400 font-mono uppercase block">Игр для FPS</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">{games.length}</span>
        </div>
      </div>

      {/* Notification Toast */}
      {telegramStatusNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-500 shrink-0" />
          <span>{telegramStatusNotice}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Заказы и Чеки ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Комплектующие ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'games'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>База Игр ({games.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-gray-300">
                <thead className="bg-slate-100 dark:bg-black/40 text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-4">Номер чека</th>
                    <th className="p-4">Покупатель</th>
                    <th className="p-4">Контакты</th>
                    <th className="p-4">Сумма (UZS)</th>
                    <th className="p-4">Чек оплаты</th>
                    <th className="p-4">Тип</th>
                    <th className="p-4">Статус</th>
                    <th className="p-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Заказов пока нет
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          {order.orderNumber}
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {order.customerName}
                        </td>
                        <td className="p-4 space-y-0.5 font-mono text-[11px]">
                          <div>📞 {order.customerPhone}</div>
                          {order.customerTelegram && <div className="text-cyan-600 dark:text-cyan-400">✈️ {order.customerTelegram}</div>}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-cyan-300">
                          {formatPrice(order.totalUzs)}
                        </td>
                        <td className="p-4">
                          {order.paymentMethod === 'STRIPE' ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] border shadow-sm ${
                              order.status === 'PAID'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                            }`}>
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Stripe ({order.status === 'PAID' ? 'Оплачено' : 'Ожидание'})</span>
                            </span>
                          ) : order.paymentReceiptUrl ? (
                            <a
                              href={order.paymentReceiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 hover:text-black dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/30 transition-all shadow-sm"
                              title="Открыть чек оплаты"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Чек ({order.paymentReceiptUrl.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Фото'})</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 dark:text-gray-600 text-xs italic">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                            order.isCustomPc
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30'
                          }`}>
                            {order.isCustomPc ? 'Кастом ПК' : 'Товары'}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-gray-300 focus:outline-none"
                          >
                            <option value="PENDING">PENDING (В сборке)</option>
                            <option value="PAID">PAID (Оплачен)</option>
                            <option value="COMPLETED">COMPLETED (Выдан)</option>
                            <option value="CANCELLED">CANCELLED (Отменен)</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleSendTelegramReceipt(order.id)}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-600 hover:text-black dark:text-cyan-400 font-bold text-[11px] border border-cyan-500/30 transition-all inline-flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            <span>Чек в Telegram</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Add Product Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-500" />
              <span>Добавить комплектующую в каталог</span>
            </h3>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Категория</label>
                <select
                  value={newProd.categoryId}
                  onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                >
                  <option value="cpu">Процессор (CPU)</option>
                  <option value="motherboard">Материнская плата</option>
                  <option value="ram">Оперативная память</option>
                  <option value="gpu">Видеокарта (GPU)</option>
                  <option value="cooler">Охлаждение</option>
                  <option value="storage">Накопитель</option>
                  <option value="psu">Блок питания</option>
                  <option value="case">Корпус</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Бренд</label>
                <input
                  type="text"
                  required
                  placeholder="Intel, AMD, ASUS, MSI..."
                  value={newProd.brand}
                  onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Модель</label>
                <input
                  type="text"
                  required
                  placeholder="Core i9-14900K, RTX 4090..."
                  value={newProd.model}
                  onChange={(e) => setNewProd({ ...newProd, model: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Цена в UZS</label>
                <input
                  type="number"
                  required
                  placeholder="5000000"
                  value={newProd.priceUzs}
                  onChange={(e) => setNewProd({ ...newProd, priceUzs: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Название (RU)</label>
                <input
                  type="text"
                  required
                  placeholder="Процессор Intel Core..."
                  value={newProd.nameRu}
                  onChange={(e) => setNewProd({ ...newProd, nameRu: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Название (UZ)</label>
                <input
                  type="text"
                  required
                  placeholder="Intel Core protsessori..."
                  value={newProd.nameUz}
                  onChange={(e) => setNewProd({ ...newProd, nameUz: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Сокет (LGA1700 / AM5)</label>
                <input
                  type="text"
                  placeholder="LGA1700"
                  value={newProd.socket}
                  onChange={(e) => setNewProd({ ...newProd, socket: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">TDP / Мощность (Вт)</label>
                <input
                  type="number"
                  placeholder="125"
                  value={newProd.tdp}
                  onChange={(e) => setNewProd({ ...newProd, tdp: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all"
                >
                  Добавить товар в каталог
                </button>
              </div>
            </form>
          </div>

          {/* Products List Table */}
          <div className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-gray-300">
                <thead className="bg-slate-100 dark:bg-black/40 text-slate-500 dark:text-gray-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="p-4">Товар</th>
                    <th className="p-4">Категория</th>
                    <th className="p-4">Бренд</th>
                    <th className="p-4">Цена</th>
                    <th className="p-4">Спецификации</th>
                    <th className="p-4 text-right">Удалить</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img src={p.image} alt={p.model} className="w-8 h-8 rounded-lg object-cover" />
                        <span>{p.nameRu}</span>
                      </td>
                      <td className="p-4 font-mono uppercase text-cyan-600 dark:text-cyan-400">{p.categoryId}</td>
                      <td className="p-4 font-semibold">{p.brand}</td>
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-cyan-300">{formatPrice(p.priceUzs)}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {p.socket && <span>Socket: {p.socket} • </span>}
                        {p.tdp && <span>TDP: {p.tdp}W</span>}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: GAMES */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          
          {/* Add Game Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-500" />
              <span>Добавить новую игру в базу FPS-калькулятора</span>
            </h3>

            <form onSubmit={handleAddGame} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Название игры</label>
                <input
                  type="text"
                  required
                  placeholder="Grand Theft Auto VI..."
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Жанр</label>
                <input
                  type="text"
                  required
                  placeholder="Open World Action"
                  value={newGame.genre}
                  onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Год релиза</label>
                <input
                  type="number"
                  placeholder="2025"
                  value={newGame.releaseYear}
                  onChange={(e) => setNewGame({ ...newGame, releaseYear: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Коэффициент GPU (0.8 - 2.5)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="2.2"
                  value={newGame.gpuIntensity}
                  onChange={(e) => setNewGame({ ...newGame, gpuIntensity: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Коэффициент CPU (0.8 - 2.0)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="1.6"
                  value={newGame.cpuIntensity}
                  onChange={(e) => setNewGame({ ...newGame, cpuIntensity: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-gray-400 mb-1">Базовый FPS в 1080p Ultra (на RTX 4060)</label>
                <input
                  type="number"
                  placeholder="60"
                  value={newGame.baseFps1080pUltra}
                  onChange={(e) => setNewGame({ ...newGame, baseFps1080pUltra: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all"
                >
                  Добавить игру в калькулятор
                </button>
              </div>
            </form>
          </div>

          {/* Games Grid in Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {games.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 space-y-2">
                <img src={g.image} alt={g.title} className="w-full aspect-video rounded-xl object-cover" />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{g.title}</h4>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>GPU: {g.gpuIntensity}x</span>
                  <span>CPU: {g.cpuIntensity}x</span>
                  <span className="text-cyan-600 dark:text-cyan-400">{g.baseFps1080pUltra} FPS</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
