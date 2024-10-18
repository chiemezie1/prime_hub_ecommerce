'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const [status, setStatus] = useState<'success' | 'failure' | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentIntentStatus = searchParams.get('payment_intent');
    if (paymentIntentStatus === 'succeeded') {
      setStatus('success');
    } else {
      setStatus('failure');
    }
  }, [searchParams]);

  if (status === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        {status === 'success' ? (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Payment Failed</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We're sorry, but there was an issue processing your payment. Please try again.
            </p>
          </>
        )}
        <div className="mt-6">
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}