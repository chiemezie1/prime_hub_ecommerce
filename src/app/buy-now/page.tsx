'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BuyNowPage() {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);

  // Fetch the product by ID directly from the API
  useEffect(() => {
    const fetchProductById = async (id: string) => {
      try {
        const res = await fetch(`/api/products/?id=${id}`);
        const result = await res.json();

        if (res.ok && result?.data) {
          setProduct(result.data);
        } else {
          setError(result.error || result.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError('Error fetching product');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductById(productId);
    } else {
      setError('No productId provided.');
      setIsLoading(false);
    }
  }, [productId]);

  const handleProceedToPayment = async () => {
    if (!product || isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(product.price * quantity * 100), // Convert to smallest currency unit (cents)
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error('Failed to create payment intent:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Conditional Rendering based on state
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8 text-center">Product not found.</div>;
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Complete Your Purchase</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="mt-1 text-sm text-gray-500">Quantity: {quantity}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        {!clientSecret ? (
          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className={`w-full ${isProcessing ? 'bg-blue-400' : 'bg-blue-600'} text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors`}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        ) : (
          <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
            <CheckoutForm productId={product.id} quantity={quantity} />
          </Elements>
        )}
      </div>
    </div>
  );
}
