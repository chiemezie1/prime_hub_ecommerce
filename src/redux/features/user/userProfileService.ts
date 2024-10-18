import { User } from '@/types';

export const fetchUserProfile = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/profile/${userId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user profile');
  }
  return await response.json();
};

export const updateUserProfile = async (data: User): Promise<User> => {
  const response = await fetch(`/api/profile/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user profile');
  }
  return await response.json();
};