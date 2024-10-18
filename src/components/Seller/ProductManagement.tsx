"use client";

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Product } from '@/types';
import authService from '@/redux/features/auth/authService';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the current user ID
  const currentUserId = authService.getCurrentUserId() || ''; 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('form');
  };

  const handleDelete = async (id: string) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        setError(data.error || 'Failed to delete product');
      }
    } catch (error) {
      setError('An error occurred while deleting the product');
    }
  };

  const handleSubmit = async (productData: Partial<Product>) => {
    try {
      const url = editingProduct ? `/api/products` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = JSON.stringify(editingProduct ? { ...productData, id: editingProduct.id } : productData);
      const token = authService.getToken();

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      const data = await response.json();

      if (data.success) {
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? data.data : p));
        } else {
          setProducts([...products, data.data]);
        }
        setEditingProduct(null);
        setActiveTab('list');
      } else {
        setError(data.error || `Failed to ${editingProduct ? 'update' : 'create'} product`);
      }
    } catch (error) {
      setError(`An error occurred while ${editingProduct ? 'updating' : 'creating'} the product`);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
        <p className="text-sm text-gray-600">Manage your product inventory</p>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Product List
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'form'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('form')}
            >
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </button>
          </div>
          {activeTab === 'list' && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('form');
              }}
            >
              <Plus className="inline-block mr-2 h-4 w-4" /> Add New Product
            </button>
          )}
        </div>
        {activeTab === 'list' && (
          <ProductList
            products={products}
            currentUserId={currentUserId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'form' && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setActiveTab('list');
              setEditingProduct(null);
            }}
            loading={false}
          />
        )}
      </div>
    </div>
  );
}
