import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTelegramReceiptMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const update = await request.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    // Check if command is /start order_XXXXXX or /receipt order_XXXXXX
    if (text.startsWith('/start order_') || text.startsWith('/start UZS-')) {
      const orderNumber = text.replace('/start order_', '').replace('/start ', '').trim();

      const order = await prisma.order.findUnique({
        where: { orderNumber },
      });

      if (order) {
        let items = [];
        try {
          items = JSON.parse(order.itemsJson);
        } catch {
          items = [];
        }

        const receiptMessage = generateTelegramReceiptMessage({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerTelegram: order.customerTelegram,
          deliveryAddress: order.deliveryAddress,
          totalUzs: order.totalUzs,
          items,
          createdAt: order.createdAt,
        }, 'ru');

        if (token) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: receiptMessage,
              parse_mode: 'HTML',
            }),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: false, error: 'Webhook processing error' }, { status: 500 });
  }
}
