import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient, OrderStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, productId, quantity } = await request.json();

    // Check that paymentIntentId is provided
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Find the order by paymentIntentId using findFirst
      const order = await prisma.order.findFirst({
        where: { paymentIntentId },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Update the order status in the database
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.DELIVERED,
        },
      });

      // Update product inventory
      await prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      return NextResponse.json({ success: true, order: updatedOrder });
    } else {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}
