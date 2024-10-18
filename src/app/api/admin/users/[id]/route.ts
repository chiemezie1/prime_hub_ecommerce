import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define the Role type
export type Role = 'ADMIN' | 'SELLER' | 'SHOPPER';

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// JWT secret for token verification
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Function to verify if the user is admin
const verifyAdmin = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { role: Role };
    return decoded.role === 'ADMIN';
  } catch {
    return false;
  }
};

// GET: Fetch a user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);

    return NextResponse.json({ error: 'Failed to fetch user', details: (error as Error).message }, { status: 500 });
  }
}

// PUT: Update a user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token || !verifyAdmin(token)) {
    return NextResponse.json({ error: 'Permission denied: Admins only' }, { status: 403 });
  }

  try {
    // Parse the incoming request body
    const { name, email, role } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    // Update the user in the database
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);

    // Handle errors (e.g., user not found, database issues)
    return NextResponse.json({ error: 'Failed to update user', details: (error as Error).message }, { status: 500 });
  }
}

// DELETE: Delete a user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token || !verifyAdmin(token)) {
    return NextResponse.json({ error: 'Permission denied: Admins only' }, { status: 403 });
  }

  try {
    // Delete the user from the database
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);

    return NextResponse.json({ error: 'Failed to delete user', details: (error as Error).message }, { status: 500 });
  }
}
