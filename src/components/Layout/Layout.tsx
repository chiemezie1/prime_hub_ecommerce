'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Gift, Truck, LucideIcon } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';

interface Category {
  name: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl?: string;
  rating?: number;
  category: 'Clothing' | 'Electronics' | 'Home' | 'Jewelry' | 'Art' | 'Books';
  quantity: number;
  sellerId: string;
}

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const categories: Category[] = [
  { name: 'All', href: '/' },
  { name: 'Clothing', href: '/category/clothing' },
  { name: 'Electronics', href: '/category/electronics' },
  { name: 'Home', href: '/category/home' },
  { name: 'Jewelry', href: '/category/jewelry' },
  { name: 'Art', href: '/category/art' },
  { name: 'Books', href: '/category/books' },
];

const defaultImage = 'default-image.jpg';
const defaultRating = 3;

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const result = await res.json();

        if (res.ok && result?.data) {
          setProducts(result.data);
        } else {
          console.error(result.error || result.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = Array.isArray(products) 
    ? products
        .filter(product => selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase())
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((product) => ({
          ...product,
          imageUrl: product.imageUrl || defaultImage,
          rating: product.rating || defaultRating,
        }))
        .slice(0, selectedCategory === 'All' ? 15 : undefined) // Limit to 15 for 'All'
    : [];

  const benefits: Benefit[] = [
    { icon: TrendingUp, title: 'Latest Tech', description: 'Stay up-to-date with the newest gadgets and innovations' },
    { icon: Gift, title: 'Exclusive Deals', description: 'Enjoy special discounts and promotions for our loyal customers' },
    { icon: Truck, title: 'Fast Shipping', description: 'Quick and reliable delivery to your doorstep' },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow pt-24">
        <div className="sticky top-0 z-10 bg-gray-200 shadow-md py-2">
          <section className="flex flex-wrap justify-center gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.name ? 'bg-red-600 text-white' : 'bg-gray-300 text-blue-950 hover:bg-gray-400'
                }`}
              >
                {category.name}
              </button>
            ))}
          </section>
        </div>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {!isLoaded ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-[200px]">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} isLoaded={isLoaded} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center text-blue-950">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-red-600">
                    <benefit.icon className="w-12 h-12 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-blue-950">{benefit.title}</h3>
                  <p className="text-gray-600 text-lg">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
