import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { fetchUserProfile as fetchUserProfileService, updateUserProfile as updateUserProfileService } from './userProfileService';

export const fetchUserProfile = createAsyncThunk<User, string, { rejectValue: string }>(
  'userProfile/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await fetchUserProfileService(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, User, { rejectValue: string }>(
  'userProfile/updateUserProfile',
  async (data: User, { rejectWithValue }) => {
    try {
      return await updateUserProfileService(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user profile');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null as User | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;