import { User } from '@/types';
import authService from '@/redux/features/auth/authService';

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const token = authService.getToken();
  const response = await fetch('/api/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch users');
  return (await response.json()) as User[];
};

// Save (Create or Update) a user
export const saveUser = async (data: User): Promise<User> => {
  const token = authService.getToken();
  const response = await fetch(`/api/admin/users/${data.id ?? ''}`, {
    method: data.id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to save user');
  return (await response.json()) as User;
};

// Delete a user by ID
export const deleteUser = async (id: string): Promise<void> => {
  const token = authService.getToken();
  const response = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to delete user');
};
