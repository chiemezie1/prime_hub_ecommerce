import { AppDispatch } from '@/redux/store'; // Adjust path based on your project structure
import { addItemToCart, removeItemFromCart, clearCart } from './cartSlice';
import { CartItem } from '@/types';

// A function to add a product to the cart and persist it
export const addProductToCart = (product: CartItem) => (dispatch: AppDispatch) => {
  dispatch(addItemToCart(product));
};

// A function to remove a product from the cart and persist it
export const removeProductFromCart = (id: string) => (dispatch: AppDispatch) => {
  dispatch(removeItemFromCart({ id }));
};

// A function to clear the cart and persist it
export const clearShoppingCart = () => (dispatch: AppDispatch) => {
  dispatch(clearCart());
};
