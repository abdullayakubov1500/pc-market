import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendStripePaymentSuccessNotification } from '@/lib/telegram';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development or when webhook secret is optional, parse directly
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle relevant events
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const orderNumber = session.metadata?.orderNumber;

    try {
      // Find the order
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            ...(orderId ? [{ id: orderId }] : []),
            ...(orderNumber ? [{ orderNumber }] : []),
            { stripeSessionId: session.id },
          ],
        },
      });

      if (order) {
        // Mark as PAID
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paymentMethod: 'STRIPE',
            stripeSessionId: session.id,
          },
        });

        // Send Telegram notification
        await sendStripePaymentSuccessNotification(order.id, session.id);
        console.log(`Order #${order.orderNumber} successfully marked as PAID via Stripe!`);
      } else {
        console.warn(`Order not found for Stripe session: ${session.id}`);
      }
    } catch (dbError) {
      console.error('Error updating order on Stripe webhook:', dbError);
    }
  }

  return NextResponse.json({ received: true });
}
