'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useCart } from '@/lib/cart-context';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Phone, 
  User, 
  MapPin,
  FileText,
  UploadCloud,
  File,
  X,
  Eye,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { lang, t, formatPrice } = useI18n();
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Payment receipt file attachment state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [telegramDispatched, setTelegramDispatched] = useState(false);
  const [dispatchingTelegram, setDispatchingTelegram] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setReceiptFile(file);

    if (file.type === 'application/pdf') {
      setIsPdf(true);
      setFilePreview(null);
    } else {
      setIsPdf(false);
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  const removeAttachedFile = () => {
    setReceiptFile(null);
    setFilePreview(null);
    setIsPdf(false);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || customerPhone.length < 9) {
      setErrorMessage(
        lang === 'ru'
          ? 'Пожалуйста, укажите имя и контактный телефон'
          : 'Iltimos, ismingiz va telefon raqamingizni kiriting'
      );
      return;
    }

    setSubmitting(true);
    try {
      let uploadedFileUrl: string | null = null;
      let uploadedFileName: string | null = null;

      // 1. If file attached, upload first
      if (receiptFile) {
        const formData = new FormData();
        formData.append('file', receiptFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Ошибка при загрузке чека оплаты');
        }

        uploadedFileUrl = uploadData.fileUrl;
        uploadedFileName = uploadData.fileName;
      }

      // 2. Create Order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerTelegram,
          deliveryAddress,
          totalUzs: totalPrice,
          items,
          isCustomPc: items.some((i) => i.isCustomPc),
          paymentReceiptUrl: uploadedFileUrl,
          paymentReceiptName: uploadedFileName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrder(data.order);
        clearCart();

        // Dispatch receipt to Telegram Bot
        try {
          await fetch('/api/telegram/send-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.order.id }),
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMessage(data.error || 'Failed to submit order');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualTelegramSend = async () => {
    if (!createdOrder) return;
    setDispatchingTelegram(true);
    try {
      const res = await fetch('/api/telegram/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createdOrder.id }),
      });
      if (res.ok) {
        setTelegramDispatched(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDispatchingTelegram(false);
    }
  };

  if (createdOrder) {
    const botUsername = 'cybermarket_uz_bot';
    const telegramBotUrl = `https://t.me/${botUsername}?start=order_${createdOrder.orderNumber}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {t.common.orderSuccess}
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-sm max-w-md mx-auto">
            {lang === 'ru'
              ? 'Ваш заказ и квитанция об оплате зарегистрированы в базе данных. Электронный чек сформирован!'
              : 'Buyurtmangiz va to\'lov cheki muvaffaqiyatli saqlandi. Elektron kvitansiya tayyorlandi!'}
          </p>
        </div>

        {/* High-Tech Order Receipt Card */}
        <div className="bg-white dark:bg-[#0e1422] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-left space-y-5 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
          {/* Neon receipt decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-mono block">Номер чека</span>
              <span className="text-xl font-black text-cyan-600 dark:text-cyan-300 font-mono tracking-wider">{createdOrder.orderNumber}</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 font-semibold font-mono">
              В СБОРКЕ (PENDING)
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-gray-300 font-sans">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">Покупатель:</span>
              <span className="font-bold text-slate-900 dark:text-white">{createdOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-gray-400">Телефон:</span>
              <span className="font-mono text-slate-900 dark:text-white">{createdOrder.customerPhone}</span>
            </div>
            {createdOrder.customerTelegram && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">Telegram:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{createdOrder.customerTelegram}</span>
              </div>
            )}
            {createdOrder.paymentReceiptName && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <File className="w-3.5 h-3.5 text-cyan-500" />
                  <span className="truncate max-w-[200px]">Чек: {createdOrder.paymentReceiptName}</span>
                </span>
                <a
                  href={createdOrder.paymentReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[11px] font-bold ml-2 shrink-0 hover:text-cyan-400"
                >
                  Просмотреть
                </a>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-sm font-bold">
              <span className="text-slate-700 dark:text-gray-300">{t.common.total}:</span>
              <span className="text-cyan-600 dark:text-cyan-300 font-mono text-base">{formatPrice(createdOrder.totalUzs)}</span>
            </div>
          </div>

          {/* Telegram Action Buttons Box */}
          <div className="pt-2 space-y-2.5">
            <a
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Получить чек в Telegram-боте' : 'Telegram bot orqali chekni olish'}</span>
            </a>

            <button
              type="button"
              onClick={handleManualTelegramSend}
              disabled={dispatchingTelegram || telegramDispatched}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                telegramDispatched
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 border-slate-300 dark:border-white/10'
              }`}
            >
              {telegramDispatched ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'ru' ? 'Чек отправлен в Telegram!' : 'Chek Telegramga yuborildi!'}</span>
                </>
              ) : dispatchingTelegram ? (
                <span>{lang === 'ru' ? 'Отправка...' : 'Yuborilmoqda...'}</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{lang === 'ru' ? 'Отправить чек на мой Telegram' : 'Mening Telegramimga yuborish'}</span>
                </>
              )}
            </button>
          </div>

          {/* Barcode Mockup */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400 dark:text-gray-500 font-mono">
            <span>||| | | |||| || | ||||| | ||</span>
            <span>CYBER-MARKET.UZ</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-white/10 transition-all"
          >
            {lang === 'ru' ? 'В каталог' : 'Katalogga qaytish'}
          </Link>
          <Link
            href="/builder"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            {lang === 'ru' ? 'Собрать новый ПК' : 'Yangi kompyuter yig\'ish'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
            <span>{t.cartPage.title}</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
            {lang === 'ru'
              ? 'Проверьте состав заказа перед отправкой и формированием чека'
              : 'Buyurtmani tasdiqlash va chek olishdan oldin tarkibini tekshiring'}
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.cartPage.clearCart}</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-[#0e1422] rounded-3xl border border-slate-200 dark:border-white/10 max-w-2xl mx-auto space-y-4 shadow-sm">
          <ShoppingCart className="w-12 h-12 text-slate-400 dark:text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.common.emptyCart}</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
            {lang === 'ru'
              ? 'Выберите детали в каталоге или соберите конфигурацию в нашем умном конструкторе ПК.'
              : 'Katalogdan qismlarni tanlang yoki aqlli PC konstruktorimizda kompyuter yig\'ing.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/catalog"
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs"
            >
              {t.common.catalog}
            </Link>
            <Link
              href="/builder"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20"
            >
              {t.common.builder}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 Cols): Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-white/20 shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.nameRu}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    {item.isCustomPc && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800 uppercase block w-fit mb-1">
                        Кастомная сборка ПК
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                      {lang === 'ru' ? item.nameRu : item.nameUz}
                    </h3>

                    {/* Breakdown of custom PC specs if applicable */}
                    {item.isCustomPc && item.buildSpecs && (
                      <div className="text-[11px] text-slate-500 dark:text-gray-400 font-mono mt-1 space-y-0.5">
                        {item.buildSpecs.cpu && <div>• CPU: {item.buildSpecs.cpu.model}</div>}
                        {item.buildSpecs.gpu && <div>• GPU: {item.buildSpecs.gpu.model}</div>}
                        {item.buildSpecs.motherboard && <div>• MB: {item.buildSpecs.motherboard.model}</div>}
                        {item.buildSpecs.ram && <div>• RAM: {item.buildSpecs.ram.model}</div>}
                      </div>
                    )}

                    <span className="font-bold text-cyan-600 dark:text-cyan-300 font-mono text-sm block mt-1">
                      {formatPrice(item.priceUzs)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                  {!item.isCustomPc && (
                    <div className="flex items-center bg-slate-100 dark:bg-black/60 rounded-xl border border-slate-200 dark:border-white/10 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 text-slate-500 dark:text-gray-400 hover:text-red-500 border border-slate-200 dark:border-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (5 Cols): Checkout Form */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0e1422] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span>{t.cartPage.orderSummary}</span>
            </h2>

            {/* Total calculation */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>{t.cartPage.itemsCount}:</span>
                <span className="font-mono text-slate-900 dark:text-white">{items.length}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-gray-400">
                <span>Доставка по Ташкенту:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Бесплатно (0 сум)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{t.common.total}:</span>
                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-300 font-mono">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t.cartPage.customerName} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Имя Фамилия"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t.cartPage.phoneNumber} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t.cartPage.telegramUsername}</span>
                </label>
                <input
                  type="text"
                  value={customerTelegram}
                  onChange={(e) => setCustomerTelegram(e.target.value)}
                  placeholder="@username (для отправки чека в Telegram)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t.cartPage.deliveryAddress}</span>
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="г. Ташкент, район, улица, дом..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* PAYMENT RECEIPT FILE ATTACHMENT */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-cyan-500" />
                    <span>Прикрепить чек об оплате (JPG, PNG или PDF)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Payme, Click, Uzum, Банк</span>
                </label>

                {!receiptFile ? (
                  <label className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-black/50">
                    <UploadCloud className="w-7 h-7 text-cyan-500 mb-1.5" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Выберите файл чека или перетащите сюда
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Поддерживаются изображения и PDF до 15 МБ
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-black/60 border border-cyan-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Чек оплаты"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-white/20 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                          {receiptFile.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                          {(receiptFile.size / 1024).toFixed(1)} KB • {isPdf ? 'Документ PDF' : 'Изображение'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeAttachedFile}
                      className="p-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-red-500/20 text-slate-600 dark:text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.cartPage.submitOrder}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 dark:text-gray-400 text-center leading-relaxed">
                Чек оплаты сохраняется в системе и автоматически пересылается менеджеру в Telegram.
              </p>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
