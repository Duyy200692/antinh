import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartButtonProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  cartItems,
  onOpenCart,
}) => {
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce-subtle">
      <button
        onClick={onOpenCart}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#2D463E] hover:bg-[#1f332d] text-white rounded-full shadow-2xl border-2 border-[#E5E1D8] font-sans font-bold uppercase tracking-wider text-xs transition-all cursor-pointer hover:scale-105"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#C05A3D]" />
          <span className="absolute -top-2 -right-2 bg-[#C05A3D] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
            {totalCount}
          </span>
        </div>
        <span>Giỏ Hàng / Xem Bill</span>
      </button>
    </div>
  );
};
