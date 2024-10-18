import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

function createResponse(success: boolean, data?: any, error?: string) {
  return { success, data, error };
}

// Initialize PrismaClient
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// GET: Fetch products by user ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Validate the provided ID
  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Find products by the user ID
    const products = await prisma.product.findMany({
      where: { sellerId: id },
    });

    // Check if products exist for this user
    if (products.length === 0) {
      return NextResponse.json({ message: 'No products found for this user' }, { status: 404 });
    }

    // Return the products
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);

    // Narrowing the error type
    if (error instanceof Error) {
      // Handle server or database errors
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
