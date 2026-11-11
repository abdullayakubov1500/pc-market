'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  CreditCard,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function CartContent() {
  const { lang, t, formatPrice } = useI18n();
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const searchParams = useSearchParams();

  const paymentSuccessParam = searchParams.get('payment_success');
  const paymentCanceledParam = searchParams.get('payment_canceled');
  const orderNumberParam = searchParams.get('orderNumber');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Payment method: STRIPE or RECEIPT
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RECEIPT'>('STRIPE');

  // Payment receipt file attachment state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [telegramDispatched, setTelegramDispatched] = useState(false);
  const [dispatchingTelegram, setDispatchingTelegram] = useState(false);

  // Clear cart upon successful Stripe payment return
  useEffect(() => {
    if (paymentSuccessParam === 'true') {
      clearCart();
    }
  }, [paymentSuccessParam]);

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

    // 1. Stripe Checkout Flow
    if (paymentMethod === 'STRIPE') {
      try {
        const res = await fetch('/api/checkout/stripe', {
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
          }),
        });

        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || 'Не удалось открыть страницу оплаты Stripe');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Ошибка при переходе к оплате Stripe');
        setSubmitting(false);
        return;
      }
    }

    // 2. Manual Receipt Upload Flow
    try {
      let uploadedFileUrl: string | null = null;
      let uploadedFileName: string | null = null;

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
          paymentMethod: 'RECEIPT',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrder(data.order);
        clearCart();

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
        throw new Error(data.error || 'Ошибка при создании заказа');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Произошла ошибка при отправке заказа');
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

  // SUCCESS SCREEN (Stripe return)
  if (paymentSuccessParam === 'true') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {lang === 'ru' ? 'Оплата через Stripe успешно получена!' : 'Stripe orqali to\'lov muvaffaqiyatli qabul qilindi!'}
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-sm max-w-md mx-auto">
            {lang === 'ru'
              ? 'Ваш платёж картой онлайн подтверждён. Заказ передан в сборку, а менеджеру отправлено уведомление в Telegram.'
              : 'Onlayn karta orqali to\'lovingiz tasdiqlandi. Buyurtma yig\'ishga topshirildi va Telegramga xabar yuborildi.'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0e1422] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-left space-y-4 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-mono block">Номер заказа</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
                {orderNumberParam || 'Подтверждён'}
              </span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold font-mono">
              ОПЛАЧЕНО (STRIPE)
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
            Спасибо за покупку в CYBER-MARKET.UZ! Наш специалист свяжется с вами для согласования времени доставки.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/catalog"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{lang === 'ru' ? 'В каталог товаров' : 'Katalogga qaytish'}</span>
            </Link>
            <Link
              href="/builder"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ru' ? '3D Конструктор ПК' : '3D PC Konstruktor'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN (Manual receipt upload)
  if (createdOrder) {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'PC-Builder';
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

        <div className="bg-white dark:bg-[#0e1422] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-left space-y-5 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
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

          <div className="pt-2 space-y-2.5">
            <a
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Открыть бота и получить чек в Telegram' : 'Botni ochish va chekni Telegramda olish'}</span>
            </a>

            <button
              onClick={handleManualTelegramSend}
              disabled={dispatchingTelegram || telegramDispatched}
              className="w-full py-2.5 px-4 rounded-xl border border-sky-500/30 hover:border-sky-500/60 bg-sky-500/10 text-sky-600 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {dispatchingTelegram ? (
                <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              ) : telegramDispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Чек отправлен менеджеру в Telegram!</span>
                </>
              ) : (
                <span>Отправить дубликат чека менеджеру</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition-all"
          >
            {lang === 'ru' ? 'В каталог товаров' : 'Katalogga qaytish'}
          </Link>
          <Link
            href="/builder"
            className="px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            {lang === 'ru' ? '3D Конструктор ПК' : '3D PC Konstruktor'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t.cartPage.title}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-xs">
            {items.length === 0 ? (lang === 'ru' ? 'Корзина пуста' : 'Savatcha bo\'sh') : `${items.length} ${t.cartPage.itemsCount}`}
          </p>
        </div>
      </div>

      {/* Stripe Payment Canceled Notice */}
      {paymentCanceledParam === 'true' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            {lang === 'ru'
              ? 'Оплата через Stripe была отменена. Товары сохранены в вашей корзине, вы можете повторить попытку оплаты картой или прикрепить квитанцию перевода.'
              : 'Stripe orqali to\'lov bekor qilindi. Tovarlar savatingizda saqlandi, qayta urinib ko\'rishingiz mumkin.'}
          </span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0c1017] rounded-3xl border border-slate-200 dark:border-white/5 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <ShoppingCart className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {lang === 'ru' ? 'Ваша корзина пуста' : 'Savatchangiz bo\'sh'}
          </h3>
          <p className="text-slate-500 dark:text-gray-400 text-xs mb-6">
            Добавьте комплектующие из каталога или соберите ПК в 3D конфигураторе
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/catalog"
              className="py-3 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>{lang === 'ru' ? 'Перейти в каталог' : 'Katalogga o\'tish'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/builder"
              className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs transition-all"
            >
              {t.common.builder}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                Выбранные товары
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Очистить корзину</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-4 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center p-2 shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.nameRu} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Cpu className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.isCustomPc && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                          3D Сборка ПК
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                      {lang === 'ru' ? item.nameRu : item.nameUz}
                    </h4>
                    <p className="font-mono text-cyan-600 dark:text-cyan-400 text-xs font-bold mt-1">
                      {formatPrice(item.priceUzs)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!item.isCustomPc && (
                      <div className="flex items-center rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-cyan-400 text-slate-600 dark:text-gray-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-cyan-400 text-slate-600 dark:text-gray-400 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-3 text-slate-600 dark:text-gray-400 text-xs">
              <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0" />
              <span>Официальная гарантия до 36 месяцев на все комплектующие и бесплатная сборка ПК при заказе онлайн.</span>
            </div>
          </div>

          {/* Checkout Form & Stripe Selector (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/5 rounded-3xl p-6 space-y-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4">
              {t.cartPage.orderSummary}
            </h3>

            {/* Total Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400">
                <span>Товары ({items.length}):</span>
                <span className="font-mono">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-gray-400">
                <span>Доставка по Ташкенту:</span>
                <span className="text-emerald-500 font-bold">БЕСПЛАТНО</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-base font-black">
                <span className="text-slate-900 dark:text-white">{t.common.total}:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-lg">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
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

              {/* PAYMENT METHOD SELECTOR */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-2">
                  Способ оплаты / To'lov usuli:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('STRIPE')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      paymentMethod === 'STRIPE'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm ring-1 ring-cyan-500/50'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-black/20'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-cyan-500" />
                    <span className="text-xs font-bold">Stripe Checkout</span>
                    <span className="text-[10px] opacity-75">Картой онлайн (Visa/MC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('RECEIPT')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      paymentMethod === 'RECEIPT'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm ring-1 ring-cyan-500/50'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-black/20'
                    }`}
                  >
                    <UploadCloud className="w-5 h-5 text-cyan-500" />
                    <span className="text-xs font-bold">Чек перевода</span>
                    <span className="text-[10px] opacity-75">Payme, Click, Банк</span>
                  </button>
                </div>
              </div>

              {/* RECEIPT ATTACHMENT BOX (Only if RECEIPT is selected) */}
              {paymentMethod === 'RECEIPT' && (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-cyan-500" />
                      <span>Прикрепить квитанцию об оплате (JPG, PNG или PDF)</span>
                    </span>
                  </label>

                  {!receiptFile ? (
                    <label className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-black/50">
                      <UploadCloud className="w-7 h-7 text-cyan-500 mb-1.5" />
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Выберите файл чека или перетащите сюда
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                        Сохраняется в Neon Object Storage до 15 МБ
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
              )}

              {/* ACTION BUTTON */}
              {paymentMethod === 'STRIPE' ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{lang === 'ru' ? 'Оплатить картой через Stripe' : 'Stripe orqali karta bilan to\'lash'}</span>
                    </>
                  )}
                </button>
              ) : (
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
              )}

              <p className="text-[11px] text-slate-500 dark:text-gray-400 text-center leading-relaxed">
                {paymentMethod === 'STRIPE'
                  ? 'Безопасная оплата через официальный защищённый шлюз Stripe (Visa, Mastercard, Apple Pay).'
                  : 'Чек оплаты сохраняется в Neon Object Storage и автоматически пересылается менеджеру в Telegram.'}
              </p>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-sm text-slate-500">Загрузка корзины...</div>}>
      <CartContent />
    </Suspense>
  );
}
