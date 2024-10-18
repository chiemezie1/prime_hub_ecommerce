'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/features/auth/authSlice';
import { RootState, AppDispatch } from '@/redux/store';
import CartModal from './CartModal';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold">Prime Hub</span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-900 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button onClick={() => setIsCartModalOpen(true)} className="relative">
              <ShoppingCart className="h-6 w-6 text-white hover:text-blue-200" />
              {Array.isArray(items) && items.length > 0 && ( // Ensure items is an array
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm font-medium text-white hover:text-blue-200 focus:outline-none"
                >
                  <User className="h-6 w-6 mr-2" />
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Home
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Orders
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      {user.role === 'SELLER' && (
                        <Link href="/seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Seller Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-row space-x-4">
                <Link
                  href="/auth/register"
                  className="block text-center bg-green-700 text-white font-medium hover:bg-green-800 rounded-md p-2 transition duration-200 shadow-md"
                >
                  Sign up
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-center bg-[#D84727] text-white font-medium hover:bg-[#7d3626] rounded-md p-2 transition duration-200 shadow-md"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </nav>
  );
}
