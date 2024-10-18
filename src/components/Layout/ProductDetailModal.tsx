'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingCart, CreditCard, Heart, Share2, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, selectCartItems } from '@/redux/features/cart/cartSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import CartButton from './CartButton';

interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    imageUrl: string;
    category: string;
    rating: number;
    description: string;
  };
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const router = useRouter();
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  const isInCart = cartItems.some(item => item.productId === product.id);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  const handleRemoveFromCart = () => {
    const cartItem = cartItems.find(item => item.productId === product.id);
    if (cartItem) {
      dispatch(removeFromCart(cartItem.id));
    }
  };

  const handleBuyNow = () => {
    // Redirect to the buy now page with the product details
    router.push(`/buy-now?productId=${product.id}&quantity=${quantity}`);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl mx-auto relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left: Image Section */}
          <div className="relative w-full lg:w-3/5 h-[60vh] lg:h-[80vh] overflow-hidden group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <motion.div
              className="absolute bottom-4 left-4 flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
                <Share2 className="w-5 h-5 text-gray-800" />
              </button>
              <button
                className={`p-2 rounded-full transition-colors ${isWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                onClick={() => setIsWishlist(!isWishlist)}
              >
                <Heart className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Right: Product Details */}
          <div className="p-8 lg:w-2/5 flex flex-col justify-between bg-gray-50">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{product.category}</p>
              </motion.div>

              <motion.div
                className="flex items-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">{product.rating.toFixed(1)} ({Math.floor(Math.random() * 1000) + 100} reviews)</span>
              </motion.div>

              <motion.p
                className="text-gray-700 text-sm leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.description}
              </motion.p>

              <motion.div
                className="flex items-center space-x-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-3xl font-bold text-gray-800">${price.toFixed(2)}</span>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">In Stock</span>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  className="bg-gray-200 text-gray-600 px-3 py-2 rounded-full"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  className="bg-gray-200 text-gray-600 px-3 py-2 rounded-full"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CartButton
                isInCart={isInCart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                onClick={handleBuyNow} 
              >
                <CreditCard className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
