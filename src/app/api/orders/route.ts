import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerPhone, 
      customerTelegram, 
      deliveryAddress, 
      totalUzs, 
      items, 
      isCustomPc,
      paymentReceiptUrl,
      paymentReceiptName
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    const orderNumber = `UZS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerTelegram: customerTelegram || null,
        deliveryAddress: deliveryAddress || null,
        totalUzs: Math.round(totalUzs),
        isCustomPc: Boolean(isCustomPc),
        itemsJson: JSON.stringify(items),
        paymentReceiptUrl: paymentReceiptUrl || null,
        paymentReceiptName: paymentReceiptName || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
