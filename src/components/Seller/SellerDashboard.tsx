"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { User, Home, Package, BarChart2, LogOut, Menu, X } from 'lucide-react'
import ProductManagement from './ProductManagement'

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('products')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const NavItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Products', icon: Package, onClick: () => setActiveTab('products') },
    { name: 'Analytics', icon: BarChart2, onClick: () => setActiveTab('analytics') },
    { name: 'Profile', icon: User, href: '/profile' },
  ]

  const NavContent = () => (
    <>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-4 text-lg font-bold tracking-tight text-gray-700">
            Seller Dashboard
          </h2>
          <div className="space-y-1">
            {NavItems.map((item, index) => {
              const IconComponent = item.icon
              return item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                    activeTab === item.name.toLowerCase()
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                  {item.name}
                </Link>
              ) : (
                <button
                  key={index}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium ${
                    activeTab === item.name.toLowerCase()
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    item.onClick && item.onClick()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <button
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          onClick={() => console.log('Logout clicked')}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-full flex-col overflow-y-auto">
          <NavContent />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 ${
            isMobileMenuOpen ? 'opacity-75 transition-opacity duration-300 ease-linear' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white transition duration-300 ease-in-out transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex h-full flex-col overflow-y-auto">
            <NavContent />
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          className="fixed left-4 top-4 z-40 rounded-md bg-gray-100 p-2 text-gray-600 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="container mx-auto p-6">
          <div className="mb-4">
            <button
              className={`mr-2 rounded-md px-4 py-2 text-sm font-medium ${
                activeTab === 'products'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'analytics' && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Analytics</h2>
              <p>Analytics content coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}