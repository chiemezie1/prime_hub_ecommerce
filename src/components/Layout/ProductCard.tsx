import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal'; // Import modal

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    imageUrl: string;
    category: 'Clothing' | 'Electronics' | 'Home' | 'Jewelry' | 'Art' | 'Books';
    rating: number;
    description: string;
  };
  index: number;
  isLoaded: boolean;
}

export default function ProductCard({ product, index, isLoaded }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
  };

  // Determine the size based on the index
  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'large', 'medium', 'small', 'small'];
  const size = sizes[index % sizes.length]; 

  // Ensure price is a number
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <>
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`${sizeClasses[size]} bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.category}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
            <p className="text-xl mb-2">${price.toFixed(2)}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-sm">{product.rating.toFixed(1)}</span>
            </div>
            <button
              className="inline-flex items-center text-white font-medium hover:underline"
              onClick={() => setIsModalOpen(true)}
            >
              View Product
              <ChevronRight className="ml-1 w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <ProductDetailModal 
          product={product} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
