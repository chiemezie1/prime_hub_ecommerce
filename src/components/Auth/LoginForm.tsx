// components/auth/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { login } from '../../redux/features/auth/authSlice';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import { AppDispatch } from '../../redux/store';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError('Email and Password are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        // Store token in localStorage
        const { token } = resultAction.payload;
        localStorage.setItem('token', token);

        // Redirect to the home page
        router.push('/');
      } else if (login.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload?.message || 'Invalid email or password';
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6 text-gray-700 font-medium" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        {/* Email Input */}
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <MailIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#D84727] focus:border-[#D84727] focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#D84727] focus:border-[#D84727] focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm text-center"
          role="alert"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D84727] hover:bg-[#D84727]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D84727] ${
            isLoading && 'opacity-50 cursor-not-allowed'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
