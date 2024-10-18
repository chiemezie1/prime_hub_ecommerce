'use client'; 

import { useState } from 'react';
import { motion } from 'framer-motion'
import Link from 'next/link'
import RegisterForm from '../../../components/Auth/RegisterForm'
import Navbar from '@/components/Layout/Navbar';

export default function RegisterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-[#D84727] hover:text-[#C13D20]">
              sign in to your account
            </Link>
          </p>
        </div>
        <RegisterForm />
      </motion.div>
    </div>
    </div>
  )
}