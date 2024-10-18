import React from 'react';
import { Product } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="bg-white overflow-hidden shadow-md rounded-lg">
          <div className="relative pb-2/3">
            <img
              className="absolute h-full w-full object-cover"
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
            />
          </div>
          <div className="px-4 py-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">Category: {product.category}</div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => onEdit(product)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;