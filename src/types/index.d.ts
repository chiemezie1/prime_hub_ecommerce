import { PrismaClient } from '@prisma/client';

// Global PrismaClient declaration to prevent implicit any error
declare global {
  var prisma: PrismaClient | undefined;
}

// Define Role type as a string literal union type
export type Role = 'ADMIN' | 'SELLER' | 'SHOPPER';

// User Interface Definition
export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  role: Role;
  avatarUrl?:string;
}


// Product Interface Definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Clothing' | 'Electronics' | 'Home' | 'Jewelry' | 'Art' | 'Books';
  quantity: number;
  sellerId: string;
}


export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

// Order Interface Definition
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
