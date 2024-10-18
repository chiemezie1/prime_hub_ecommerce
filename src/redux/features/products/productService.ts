import axiosInstance from '@/utils/axiosConfig';
import { Product } from '@/types';

const API_URL = '/api/products';

// Fetch products with optional filters
export const fetchProducts = async (params?: {
  sellerId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/search`, { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch products';
  }
};

// Fetch products created by a specific user (admin feature)
export const fetchProductsByUser = async (userId: string): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch user products';
  }
};

// Fetch a single product by its ID (as query parameter)
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`${API_URL}?id=${productId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch product';
  }
};

// Create a new product
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axiosInstance.post(API_URL, productData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to create product';
  }
};

// Update an existing product by ID
export const updateProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${productData.id}`, productData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to update product';
  }
};

// Delete a product by ID
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to delete product';
  }
};

const productService = {
  fetchProducts,
  fetchProductsByUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;