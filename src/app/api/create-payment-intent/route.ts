import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { amount, productId, quantity, userId } = await request.json();

    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        productId,
        quantity,
      },
    });

    // Create a pending order in the database
    await prisma.order.create({
      data: {
        status: 'PENDING',
        total: amount / 100,
        paymentIntentId: paymentIntent.id,
        user: {
          connect: { id: userId },
        },
        items: {
          create: [{
            product: {
              connect: { id: productId },
            },
            quantity,
            price: amount / 100 / quantity,
          }],
        },
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 });
  }
}