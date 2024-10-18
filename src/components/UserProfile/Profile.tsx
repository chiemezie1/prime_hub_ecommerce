'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUserProfile, updateUserProfile } from '@/redux/features/user/userProfileSlice';
import { User } from '@/types';
import { Loader2, User as UserIcon, Mail, Briefcase, Camera } from 'lucide-react';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        dispatch(fetchUserProfile(user.id));
        setFormData((prev) => ({ ...prev, id: user.id }));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id,
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      try {
        // TODO: Implement avatar upload logic
        const updatedUser = await dispatch(updateUserProfile(formData as User)).unwrap();
        setIsEditing(false);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Update error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-lg p-4 bg-red-100 rounded-md">
        Error: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-lg p-4">
        No profile data available. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className=" max-w-4xl mx-auto p-8">
      <div className="my-36 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
          <h2 className="text-3xl font-bold text-white">User Profile</h2>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : (profile.avatarUrl || '/default-avatar.png')}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <div className="flex-grow">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-gray-800 font-semibold">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                    <UserIcon className="mr-2 h-6 w-6 text-gray-600" />
                    {profile.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-2 flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-gray-500" />
                    {profile.email}
                  </p>
                  <p className="text-md text-gray-500 mb-4 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                    {profile.role}
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;