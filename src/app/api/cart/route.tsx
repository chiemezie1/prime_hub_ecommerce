import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function getTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

async function getUserFromToken(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: { product: true },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();
    
    // Check if the product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.userId,
          productId: productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: user.userId,
        productId: productId,
        quantity: quantity,
      },
      include: { product: true },
    });
    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = getTokenFromHeader(request);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const url = new URL(request.url);
  const itemId = url.searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  try {
    await prisma.cartItem.delete({
      where: {
        id: itemId,
        userId: user.userId,
      },
    });
    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}