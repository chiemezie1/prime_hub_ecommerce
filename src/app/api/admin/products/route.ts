import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Product } from '@/types';

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

function createResponse(success: boolean, data?: any, error?: string) {
  return { success, data, error };
}

// GET: Fetch all products with seller information
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { seller: true },
    });
    return NextResponse.json(createResponse(true, products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(createResponse(false, null, 'Failed to fetch products'), { status: 500 });
  }
}

// POST: Create a new product
export async function POST(request: Request) {
  try {
    const body: Partial<Product> = await request.json();

    // Validate the required fields
    if (!body.name || !body.description || body.price === undefined || !body.category || !body.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        quantity: body.quantity || 0,
        category: body.category,
        imageUrl: body.imageUrl,
        sellerId: body.sellerId || '',
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product. Please try again later.' }, { status: 500 });
  }
}

// PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Validate if ID is provided
    if (!id) {
      return NextResponse.json(createResponse(false, null, 'Product ID is required'), { status: 400 });
    }

    // Validate the required fields
    if (!data.name || !data.description || data.price === undefined || !data.category || !data.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update the product and associate it with a seller using `connect`
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        // Assuming the sellerId is included in the request to update the product
        sellerId: data.sellerId ? { connect: { id: data.sellerId } } : undefined, 
      },
      include: { seller: true },
    });

    return NextResponse.json(createResponse(true, product), { status: 200 });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(createResponse(false, null, 'Failed to update product'), { status: 500 });
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(createResponse(false, null, 'Product ID is required'), { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(createResponse(true, { message: 'Product deleted successfully' }));
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(createResponse(false, null, 'Failed to delete product'), { status: 500 });
  }
}
