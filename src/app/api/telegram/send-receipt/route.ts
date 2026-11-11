import { NextResponse } from 'next/server';
import { sendReceiptToTelegram } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, targetChatId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const result = await sendReceiptToTelegram(orderId, targetChatId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error sending receipt to telegram:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch receipt' }, { status: 500 });
  }
}
