'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Home, Package, LogOut } from 'lucide-react';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex h-screen bg-gray-100 px-4 py-2">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <User className="w-5 h-5 mr-2" />
            Profile
          </Link>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeTab === 'users' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-4 py-2 w-full text-left ${
              activeTab === 'products' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Manage Products
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left mt-auto">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'products' && <ProductManagement />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;