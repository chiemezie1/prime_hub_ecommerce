'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '@/redux/features/admin/userSlice';
import { fetchProductsByUser, createProduct, updateProduct, deleteProduct } from '@/redux/features/products/productSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { User, Product } from '@/types';
import { Search, Plus, Users } from 'lucide-react';

const ProductManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users = [], loading: usersLoading = false, error: usersError = null } = useSelector((state: RootState) => state.users || {});
  const { products = [], isLoading: productsLoading = false, error: productsError = null } = useSelector((state: RootState) => state.products || {});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchProductsByUser(selectedUser.id));
    }
  }, [dispatch, selectedUser]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedProduct(null);
    setIsFormVisible(false);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormVisible(true);
  };

  const handleProductDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
      if (selectedUser) {
        dispatch(fetchProductsByUser(selectedUser.id));
      }
    }
  };

  const handleProductSubmit = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        await dispatch(updateProduct(productData)).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      if (selectedUser) {
        dispatch(fetchProductsByUser(selectedUser.id));
      }
      setIsFormVisible(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to submit product:', error);
      // You can add error handling here, such as showing an error message to the user
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (usersLoading) return <div className="flex justify-center items-center h-screen">Loading users...</div>;
  if (usersError) return <div className="text-red-500 text-center">Error loading users: {usersError}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Product Management</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="mr-2" size={20} />
                    Users
                  </h2>
                  <div className="mt-4 flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {users.map((user) => (
                        <li
                          key={user.id}
                          className={`py-4 cursor-pointer transition-colors duration-200 ${
                            selectedUser?.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                              <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                            <div className="inline-flex items-center text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {user.role}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-3/4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  {selectedUser ? (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Products for {selectedUser.name}</h2>
                        <button
                          onClick={() => setIsFormVisible(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="mr-2" size={16} />
                          Add New Product
                        </button>
                      </div>
                      <div className="mb-6">
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            name="search"
                            id="search"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      {isFormVisible && (
                        <div className="mb-6">
                          <ProductForm
                            product={selectedProduct}
                            onSubmit={handleProductSubmit}
                            onCancel={() => {
                              setIsFormVisible(false);
                              setSelectedProduct(null);
                            }}
                            loading={productsLoading}
                            user={JSON.stringify(selectedUser)}
                          />
                        </div>
                      )}
                      {productsLoading ? (
                        <div className="text-center py-8">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          <p className="mt-2 text-gray-600">Loading products...</p>
                        </div>
                      ) : productsError ? (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6" role="alert">
                          <p className="font-bold text-red-800">Error</p>
                          <p className="text-red-700">Error loading products: {productsError}</p>
                        </div>
                      ) : (
                        <ProductList
                          products={filteredProducts}
                          onEdit={handleProductEdit}
                          onDelete={handleProductDelete}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No user selected</h3>
                      <p className="mt-1 text-sm text-gray-500">Select a user to manage their products</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;