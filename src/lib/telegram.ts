import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';

export interface TelegramReceiptData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerTelegram?: string | null;
  deliveryAddress?: string | null;
  totalUzs: number;
  items: Array<{
    nameRu: string;
    nameUz: string;
    priceUzs: number;
    quantity: number;
    isCustomPc?: boolean;
    buildSpecs?: any;
  }>;
  paymentReceiptUrl?: string | null;
  paymentReceiptName?: string | null;
  createdAt: Date;
}

export function formatUzsPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount) + " so'm";
}

export function generateTelegramReceiptMessage(data: TelegramReceiptData, lang: 'ru' | 'uz' = 'ru'): string {
  const dateFormatted = new Date(data.createdAt).toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
    timeZone: 'Asia/Tashkent',
  });

  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━';

  if (lang === 'uz') {
    let msg = `🧾 <b>TO'LOV VA BUYURTMA CHEKI #${data.orderNumber}</b>\n`;
    msg += `🏢 <b>CYBER-MARKET.UZ</b> (Toshkent)\n`;
    msg += `${divider}\n`;
    msg += `👤 <b>Mijoz:</b> ${data.customerName}\n`;
    msg += `📞 <b>Telefon:</b> ${data.customerPhone}\n`;
    if (data.customerTelegram) {
      msg += `✈️ <b>Telegram:</b> ${data.customerTelegram}\n`;
    }
    if (data.deliveryAddress) {
      msg += `📍 <b>Yetkazish:</b> ${data.deliveryAddress}\n`;
    }
    if (data.paymentReceiptName) {
      msg += `📎 <b>To'lov kvitansiyasi:</b> ${data.paymentReceiptName} (Biriktirildi)\n`;
    }
    msg += `📅 <b>Sana:</b> ${dateFormatted} (Toshkent vaqti)\n`;
    msg += `${divider}\n`;
    msg += `📦 <b>BUYURTMA TARKIBI:</b>\n\n`;

    data.items.forEach((item, index) => {
      msg += `<b>${index + 1}. ${item.nameUz}</b>\n`;
      if (item.isCustomPc && item.buildSpecs) {
        const b = item.buildSpecs;
        if (b.cpu) msg += `   ▫️ CPU: ${b.cpu.model}\n`;
        if (b.motherboard) msg += `   ▫️ Ona plata: ${b.motherboard.model}\n`;
        if (b.ram) msg += `   ▫️ RAM: ${b.ram.model}\n`;
        if (b.gpu) msg += `   ▫️ GPU: ${b.gpu.model}\n`;
        if (b.cooler) msg += `   ▫️ Kuler: ${b.cooler.model}\n`;
        if (b.storage) msg += `   ▫️ SSD: ${b.storage.model}\n`;
        if (b.psu) msg += `   ▫️ Blok: ${b.psu.model}\n`;
        if (b.case) msg += `   ▫️ Korpus: ${b.case.model}\n`;
      }
      msg += `   💵 <i>${item.quantity} dona x ${formatUzsPrice(item.priceUzs)}</i>\n\n`;
    });

    msg += `${divider}\n`;
    msg += `💰 <b>JAMI TO'LOV:</b> <code>${formatUzsPrice(data.totalUzs)}</code>\n`;
    msg += `🛡 <b>Kafolat:</b> Rasmiy 36 oygacha\n`;
    msg += `📌 <b>Holat:</b> Qabul qilindi / Yig'ish jarayonida\n`;
    msg += `${divider}\n`;
    msg += `📞 <b>Menejer bilan aloqa:</b> +998 (71) 200-50-50\n`;
    msg += `🌐 <b>Sayt:</b> CYBER-MARKET.UZ`;

    return msg;
  }

  // Russian version
  let msg = `🧾 <b>ЭЛЕКТРОННЫЙ ЧЕК ЗАКАЗА #${data.orderNumber}</b>\n`;
  msg += `🏢 <b>CYBER-MARKET.UZ</b> (г. Ташкент)\n`;
  msg += `${divider}\n`;
  msg += `👤 <b>Покупатель:</b> ${data.customerName}\n`;
  msg += `📞 <b>Телефон:</b> ${data.customerPhone}\n`;
  if (data.customerTelegram) {
    msg += `✈️ <b>Telegram:</b> ${data.customerTelegram}\n`;
  }
  if (data.deliveryAddress) {
    msg += `📍 <b>Адрес доставки:</b> ${data.deliveryAddress}\n`;
  }
  if (data.paymentReceiptName) {
    msg += `📎 <b>Файл чека оплаты:</b> ${data.paymentReceiptName} (Прикреплен)\n`;
  }
  msg += `📅 <b>Дата:</b> ${dateFormatted} (Ташкент)\n`;
  msg += `${divider}\n`;
  msg += `📦 <b>СОСТАВ СБОРКИ / ТОВАРОВ:</b>\n\n`;

  data.items.forEach((item, index) => {
    msg += `<b>${index + 1}. ${item.nameRu}</b>\n`;
    if (item.isCustomPc && item.buildSpecs) {
      const b = item.buildSpecs;
      if (b.cpu) msg += `   ▫️ Процессор: ${b.cpu.model}\n`;
      if (b.motherboard) msg += `   ▫️ Матплата: ${b.motherboard.model}\n`;
      if (b.ram) msg += `   ▫️ Память: ${b.ram.model}\n`;
      if (b.gpu) msg += `   ▫️ Видеокарта: ${b.gpu.model}\n`;
      if (b.cooler) msg += `   ▫️ Охлаждение: ${b.cooler.model}\n`;
      if (b.storage) msg += `   ▫️ Накопитель: ${b.storage.model}\n`;
      if (b.psu) msg += `   ▫️ Блок питания: ${b.psu.model}\n`;
      if (b.case) msg += `   ▫️ Корпус: ${b.case.model}\n`;
    }
    msg += `   💵 <i>${item.quantity} шт. x ${formatUzsPrice(item.priceUzs)}</i>\n\n`;
  });

  msg += `${divider}\n`;
  msg += `💰 <b>ИТОГО К ОПЛАТЕ:</b> <code>${formatUzsPrice(data.totalUzs)}</code>\n`;
  msg += `🛡 <b>Гарантия:</b> Официальная до 36 месяцев\n`;
  msg += `📌 <b>Статус:</b> Принят / Передан в сборку\n`;
  msg += `${divider}\n`;
  msg += `📞 <b>Отдел заботы о клиентах:</b> +998 (71) 200-50-50\n`;
  msg += `🌐 <b>Сайт:</b> CYBER-MARKET.UZ`;

  return msg;
}

export async function sendReceiptToTelegram(orderId: string, targetChatId?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  let items = [];
  try {
    items = JSON.parse(order.itemsJson);
  } catch {
    items = [];
  }

  const receiptData: TelegramReceiptData = {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerTelegram: order.customerTelegram,
    deliveryAddress: order.deliveryAddress,
    totalUzs: order.totalUzs,
    items,
    paymentReceiptUrl: order.paymentReceiptUrl,
    paymentReceiptName: order.paymentReceiptName,
    createdAt: order.createdAt,
  };

  const textRu = generateTelegramReceiptMessage(receiptData, 'ru');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'cybermarket_uz_bot';

  const botDeepLink = `https://t.me/${botUsername}?start=${order.orderNumber}`;

  // If a real bot token is provided, send real HTTP request to Telegram API
  if (token && token.trim() !== '') {
    const recipients = [targetChatId, adminChatId].filter(Boolean);

    for (const chatId of recipients) {
      try {
        // If order has an attached payment receipt file (image or PDF)
        if (order.paymentReceiptUrl) {
          let fileBuffer: Buffer | null = null;
          const isPdf = order.paymentReceiptUrl.toLowerCase().includes('.pdf') || 
            (order.paymentReceiptName ? order.paymentReceiptName.toLowerCase().endsWith('.pdf') : false);

          if (order.paymentReceiptUrl.startsWith('http://') || order.paymentReceiptUrl.startsWith('https://')) {
            try {
              const res = await fetch(order.paymentReceiptUrl);
              if (res.ok) {
                const arrayBuf = await res.arrayBuffer();
                fileBuffer = Buffer.from(arrayBuf);
              }
            } catch (err) {
              console.error('Failed to fetch receipt from storage URL:', err);
            }
          } else {
            const filePath = path.join(process.cwd(), 'public', order.paymentReceiptUrl);
            if (fs.existsSync(filePath)) {
              fileBuffer = fs.readFileSync(filePath);
            }
          }

          if (fileBuffer) {
            const endpoint = isPdf ? 'sendDocument' : 'sendPhoto';
            const fileField = isPdf ? 'document' : 'photo';

            const formData = new FormData();
            formData.append('chat_id', chatId as string);
            formData.append('caption', textRu.slice(0, 1024)); // Telegram caption limit 1024 chars
            formData.append('parse_mode', 'HTML');
            formData.append(fileField, new Blob([new Uint8Array(fileBuffer)]), order.paymentReceiptName || (isPdf ? 'receipt.pdf' : 'receipt.jpg'));

            await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
              method: 'POST',
              body: formData,
            });
            continue;
          }
        }

        // Standard text message dispatch
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: textRu,
            parse_mode: 'HTML',
          }),
        });
      } catch (err) {
        console.error('Telegram dispatch error to chatId:', chatId, err);
      }
    }
  }

  // Update order in database to reflect receipt status
  await prisma.order.update({
    where: { id: orderId },
    data: { telegramReceiptSent: true },
  });

  return {
    success: true,
    orderNumber: order.orderNumber,
    botDeepLink,
    paymentReceiptUrl: order.paymentReceiptUrl,
    paymentReceiptName: order.paymentReceiptName,
    receiptText: textRu,
  };
}

export async function sendStripePaymentSuccessNotification(orderId: string, stripeSessionId?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (token && adminChatId) {
    const text = `💳 <b>ОПЛАТА ПОЛУЧЕНА ЧЕРЕЗ STRIPE!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 <b>Заказ:</b> #${order.orderNumber}\n` +
      `💰 <b>Сумма:</b> ${formatUzsPrice(order.totalUzs)}\n` +
      `👤 <b>Покупатель:</b> ${order.customerName}\n` +
      `📞 <b>Телефон:</b> ${order.customerPhone}\n` +
      (order.customerTelegram ? `✈️ <b>Telegram:</b> ${order.customerTelegram}\n` : '') +
      `⚡ <b>Статус:</b> ОПЛАЧЕНО (Картой онлайн)\n` +
      (stripeSessionId ? `🔗 <b>Stripe Session:</b> <code>${stripeSessionId}</code>\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `<i>Заказ готов к передаче на сборку и доставку!</i>`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text,
          parse_mode: 'HTML',
        }),
      });
    } catch (e) {
      console.error('Error sending Stripe notification to telegram:', e);
    }
  }

  // Also send itemized breakdown
  try {
    await sendReceiptToTelegram(orderId, adminChatId);
  } catch (e) {
    console.error('Error sending full order receipt after Stripe payment:', e);
  }
}

