// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import productReducer from './features/products/productSlice';
import cartReducer from './features/cart/cartSlice';
import orderReducer from './features/order/orderSlice';
import userReducer from './features/admin/userSlice';
import userProfileSlice from './features/user/userProfileSlice';


// Configure the Redux store with all the necessary reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
    users: userReducer,
    userProfile: userProfileSlice,
  },
});

// Define types for the RootState and AppDispatch to use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
