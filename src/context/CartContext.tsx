'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem, VendingMachine } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  selectedMachine: VendingMachine | null;
  setSelectedMachine: (m: VendingMachine) => void;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedMachine, setSelectedMachineState] = useState<VendingMachine | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart and selected machine from localStorage on initial client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vendogo_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedMachine = localStorage.getItem('vendogo_machine');
      if (savedMachine) {
        setSelectedMachineState(JSON.parse(savedMachine));
      } else {
        // Fetch default machine
        fetch('/api/machines')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.machines.length > 0) {
              const defaultM = data.machines[0];
              setSelectedMachineState(defaultM);
              localStorage.setItem('vendogo_machine', JSON.stringify(defaultM));
            }
          })
          .catch(() => {});
      }
    } catch {
      // Storage access disabled or error
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('vendogo_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const setSelectedMachine = (m: VendingMachine) => {
    // If machine changed and cart has items from different machine, prompt or clear
    if (selectedMachine && selectedMachine.id !== m.id && items.length > 0) {
      if (window.confirm(`Switch to "${m.name}"? Your current cart items from "${selectedMachine.name}" will be reset.`)) {
        setItems([]);
      } else {
        return;
      }
    }
    setSelectedMachineState(m);
    try {
      localStorage.setItem('vendogo_machine', JSON.stringify(m));
    } catch {}
  };

  const addItem = (product: Product) => {
    if (product.stock <= 0) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty >= product.stock) {
          alert(`Only ${product.stock} units available in this vending machine.`);
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock) {
              alert(`Only ${item.product.stock} units in stock.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedMachine,
        setSelectedMachine,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
