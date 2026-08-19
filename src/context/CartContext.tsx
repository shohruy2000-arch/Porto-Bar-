'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dish, OrderItem } from '../types';

interface CartContextType {
  items: OrderItem[];
  roomNumber: string;
  setRoomNumber: (num: string) => void;
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, qty: number) => void;
  clearCart: () => void;
  setCartItems: (items: OrderItem[]) => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [roomNumber, setRoomNumberState] = useState<string>('');

  // Load from localStorage on client init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('porto_cart_items');
      const storedRoom = localStorage.getItem('porto_room_number');
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (e) {
          console.error(e);
        }
      }
      if (storedRoom) {
        setRoomNumberState(storedRoom);
      }
    }
  }, []);

  // Save changes to localStorage
  const saveCart = (newItems: OrderItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('porto_cart_items', JSON.stringify(newItems));
    }
  };

  const setRoomNumber = (num: string) => {
    setRoomNumberState(num);
    if (typeof window !== 'undefined') {
      localStorage.setItem('porto_room_number', num);
    }
  };

  const addToCart = (dish: Dish) => {
    const existingIndex = items.findIndex(item => item.dish.id === dish.id);
    const quantityInCart = existingIndex > -1 ? items[existingIndex].quantity : 0;

    if (dish.quantityLimit !== undefined && dish.quantityLimit !== null) {
      if (quantityInCart >= dish.quantityLimit) {
        return;
      }
    }

    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      saveCart(newItems);
    } else {
      saveCart([...items, { dish, quantity: 1 }]);
    }
  };

  const removeFromCart = (dishId: string) => {
    const newItems = items.filter(item => item.dish.id !== dishId);
    saveCart(newItems);
  };

  const updateQuantity = (dishId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(dishId);
      return;
    }
    const newItems = items.map(item => {
      if (item.dish.id === dishId) {
        let finalQty = qty;
        if (item.dish.quantityLimit !== undefined && item.dish.quantityLimit !== null) {
          finalQty = Math.min(qty, item.dish.quantityLimit);
        }
        return { ...item, quantity: finalQty };
      }
      return item;
    });
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const setCartItems = (newItems: OrderItem[]) => {
    saveCart(newItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        roomNumber,
        setRoomNumber,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartItems,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
