import React, { useEffect, useState } from 'react';
import { Product } from '@/types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  currentUserId: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, currentUserId }) => {
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading of image URLs
    const checkImages = setInterval(() => {
      // Check if all image URLs are available
      const allUrlsAvailable = products.every(product => product.imageUrl);
      
      if (allUrlsAvailable) {
        setImageUrls(products.map(product => product.imageUrl!));
        setLoading(false);
        clearInterval(checkImages);
      }
    }, 500);

    return () => clearInterval(checkImages);
  }, [products]);

  if (loading) {
    return <div>Loading images...</div>; 
  }

  // Filter products to show only those owned by the current user
  const userProducts = products.filter(product => product.sellerId === currentUserId);

  if (userProducts.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userProducts.map((product, index) => {
        // Check if the product is defined
        if (!product) {
          return null;
        }

        // Ensure the price is a number
        const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

        return (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-md">
            <img
              src={imageUrls[index] || '/placeholder.jpg'}
              alt={product.name || 'Product Image'}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name || 'Unknown Product'}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-gray-800 font-semibold mb-1">
                Price: ${typeof price === 'number' ? price.toFixed(2) : 'N/A'}
              </p>
              <p className="text-gray-800 mb-1">Quantity: {product.quantity}</p>
              <p className="text-gray-800 mb-2">Category: {product.category}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
