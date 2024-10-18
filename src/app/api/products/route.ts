import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Product } from '@/types';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function createResponse(success: boolean, data?: any, error?: string) {
  return { success, data, error };
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

// Updated GET: Fetch either all products or a product by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single product by ID if 'id' parameter is provided
      const product = await prisma.product.findUnique({
        where: { id },
        include: { seller: true }, // Include seller information
      });

      // If no product is found, return a 404 response
      if (!product) {
        return NextResponse.json(createResponse(false, null, 'Product not found'), { status: 404 });
      }

      return NextResponse.json(createResponse(true, product), { status: 200 });
    } else {
      // Fetch all products if no 'id' parameter is provided
      const products = await prisma.product.findMany({
        include: { seller: true },
      });
      return NextResponse.json(createResponse(true, products), { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(createResponse(false, null, 'Failed to fetch products'), { status: 500 });
  }
}

// POST: Create a new product associated with the current user
export async function POST(request: NextRequest) {
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
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, sellerId, ...data } = body;

    // Validate if ID is provided
    if (!id) {
      return NextResponse.json(createResponse(false, null, 'Product ID is required'), { status: 400 });
    }

    // Validate the required fields
    if (!data.name || !data.description || data.price === undefined || !data.category || !data.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get token from request headers
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the token to get the userId
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Ensure that the user is the owner of the product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(createResponse(false, null, 'Product not found'), { status: 404 });
    }

    if (existingProduct.sellerId !== user.userId) {
      return NextResponse.json(createResponse(false, null, 'You are not authorized to edit this product'), { status: 403 });
    }

    // Update the product and associate it with a seller using `connect`
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        seller: {
          connect: { id: sellerId },
        },
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
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(createResponse(false, null, 'Product ID is required'), { status: 400 });
    }

    // Get token from request headers
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the token to get the userId
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch the product to check if it exists and who the seller is
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(createResponse(false, null, 'Product not found'), { status: 404 });
    }

    // Ensure that the user is the owner of the product
    if (existingProduct.sellerId !== user.userId) {
      return NextResponse.json(createResponse(false, null, 'You are not authorized to delete this product'), { status: 403 });
    }

    // Proceed to delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(createResponse(true, { message: 'Product deleted successfully' }));
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(createResponse(false, null, 'Failed to delete product'), { status: 500 });
  }
}

