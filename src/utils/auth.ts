// utils/auth.ts
import jwtDecode from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const user = jwtDecode<User>(token);
    return user;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
