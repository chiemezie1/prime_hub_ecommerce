'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { register } from '../../redux/features/auth/authService'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const { name, email, password, confirmPassword } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setIsLoading(true)

    try {
      // Call the register function from your auth service
      await register({ name, email, password })
      
      // If registration is successful, redirect to the homepage or login page
      router.push('/auth/login')
    } catch (err: any) {
      // Handle the error thrown from authService and set the error message
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6 text-gray-700 font-medium" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <div className="relative">
            <UserIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-t-md block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 focus:ring-[#D84727] focus:border-[#D84727]"
              placeholder="Name"
              value={name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <MailIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 focus:ring-[#D84727] focus:border-[#D84727]"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <div className="relative">
            <LockIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 focus:ring-[#D84727] focus:border-[#D84727]"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
          <div className="relative">
            <LockIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 rounded-b-md focus:ring-[#D84727] focus:border-[#D84727]"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm text-center">
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white focus:ring-2 focus:ring-offset-2 focus:ring-[#D84727] ${
          isLoading ? 'bg-gray-500' : 'bg-[#D84727] hover:bg-[#BF3F20]'
        }`}
      >
        {isLoading ? 'Registering...' : 'Sign up'}
      </motion.button>
    </form>
  )
}
