'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, selectCartItems, selectCartStatus, fetchCart, CartItem as SliceCartItem } from '@/redux/features/cart/cartSlice';
import { X, ShoppingBag, Trash2, CreditCard, Loader2, ArrowRight, MinusCircle, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';

// Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

// CartItem interface
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems) as SliceCartItem[];
  const cartStatus = useSelector(selectCartStatus);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (isOpen && cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [isOpen, cartStatus, dispatch]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      onClose();
      router.push('/checkout');
    }, 2000);
  };

  const handleBuyNow = (productId: string, quantity: number) => {
    router.push(`/buy-now?productId=${productId}&quantity=${quantity}`);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex h-full flex-col text-gray-800">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cartStatus === 'loading' ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-gray-500">Start adding some items to your cart!</p>
                    <button
                      onClick={onClose}
                      className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Continue Shopping
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul role="list" className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="text-lg">{item.product.name}</h3>
                              <p className="ml-4 text-lg font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center">
                              <button className="text-gray-500 hover:text-gray-700">
                                <MinusCircle className="h-5 w-5" />
                              </button>
                              <span className="mx-2 font-medium">{item.quantity}</span>
                              <button className="text-gray-500 hover:text-gray-700">
                                <PlusCircle className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="flex space-x-4">
                              <button
                                type="button"
                                className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200 transition-colors"
                                onClick={() => handleBuyNow(item.product.id, item.quantity)}
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full rounded-full bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {orderPlaced ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <CreditCard className="mr-2 h-5 w-5" />
                          Checkout
                        </span>
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full rounded-full border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}