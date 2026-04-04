import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Service } from './utils/data';

interface CartContextType {
  cart: Service[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Service[]>([]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      // Prevent duplicates to keep MVP clean
      if (prev.find(item => item.serviceId === service.serviceId)) return prev;
      return [...prev, service];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter(item => item.serviceId !== serviceId));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.length;
  const subtotal = cart.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
