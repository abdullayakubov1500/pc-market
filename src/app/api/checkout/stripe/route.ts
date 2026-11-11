import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
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
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe API key is not configured on server (STRIPE_SECRET_KEY).' },
        { status: 500 }
      );
    }

    const orderNumber = `UZS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create order in database with PENDING status and STRIPE payment method
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
        paymentMethod: 'STRIPE',
        status: 'PENDING',
      },
    });

    // 2. Prepare line items for Stripe Checkout
    const reqOrigin = request.headers.get('origin') || 
      process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const lineItems = items.map((item: any) => {
      const price = item.priceUzs || item.price || 0;
      const quantity = item.quantity || item.qty || 1;
      const name = item.nameRu || item.name || 'Компьютерные комплектующие';
      
      let imageUrl: string | undefined = undefined;
      if (item.image && typeof item.image === 'string') {
        if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
          imageUrl = item.image;
        } else if (item.image.startsWith('/')) {
          imageUrl = `${reqOrigin}${item.image}`;
        }
      }

      return {
        price_data: {
          currency: 'uzs',
          product_data: {
            name,
            images: imageUrl ? [imageUrl] : undefined,
          },
          unit_amount: Math.round(price * 100), // 1 UZS = 100 minor units in Stripe
        },
        quantity,
      };
    });

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      success_url: `${reqOrigin}/cart?payment_success=true&orderNumber=${order.orderNumber}&orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${reqOrigin}/cart?payment_canceled=true&orderNumber=${order.orderNumber}&orderId=${order.id}`,
    });

    // 4. Update order with stripeSessionId
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      orderId: order.id,
      orderNumber: order.orderNumber,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe checkout session' },
      { status: 500 }
    );
  }
}
