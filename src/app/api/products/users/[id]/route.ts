
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export async function GET(request: Request, { params }: { params: { id?: string } }) {
  const { id } = params;

  try {
    let products;

    // If ID is provided, fetch products by seller ID
    if (id) {
      products = await prisma.product.findMany({
        where: { sellerId: id },
      });

      // Check if products exist for this user
      if (products.length === 0) {
        return NextResponse.json({ message: 'No products found for this user' }, { status: 404 });
      }
    } else {
      // If no ID is provided, fetch all products
      products = await prisma.product.findMany();
      console.log(products)

      if (products.length === 0) {
        return NextResponse.json({ message: 'No products found' }, { status: 404 });
      }
    }

    // Return the products
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);

    // Handle the error type safely
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch products due to an unknown error' }, { status: 500 });
    }
  }
}
