// service/admin/userSlice

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { fetchUsers as fetchUsersService, saveUser as saveUserService, deleteUser as deleteUserService } from './userService';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const users = await fetchUsersService();
    return users;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});

export const saveUser = createAsyncThunk('users/saveUser', async (data: User, { rejectWithValue }) => {
  try {
    const user = await saveUserService(data);
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to save user');
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string, { rejectWithValue }) => {
  try {
    await deleteUserService(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [] as User[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.loading = false;
        const existingUserIndex = state.users.findIndex((user) => user.id === action.payload.id);
        if (existingUserIndex !== -1) {
          state.users[existingUserIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;