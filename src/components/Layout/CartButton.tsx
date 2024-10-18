import { ShoppingCart, Check } from 'lucide-react';

interface CartButtonProps {
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ isInCart, onAddToCart, onRemoveFromCart }) => {
  return (
    <button
      onClick={isInCart ? onRemoveFromCart : onAddToCart}
      className={`px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center space-x-2 ${
        isInCart
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isInCart ? (
        <>
          <Check className="w-5 h-5" />
          <span>Remove from Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default CartButton;