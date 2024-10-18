'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/UserProfile/Profile';
import Navbar from '@/components/Layout/Navbar';

const UserProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('user');
    if (id) {
      setUserId(id);
    } else {
      // Redirect to login if no user ID is found
      router.push('/auth/login');
    }
  }, [router]);

  if (!userId) {
    return <div className="text-center p-8">Loading user profile...</div>;
  }

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <UserProfile/>
    </div>
  );
};

export default UserProfilePage;
