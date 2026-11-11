'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductSpec, BuildConfiguration } from './compatibility';

export interface CartItem {
  id: string; // unique item id in cart
  productId?: string;
  nameRu: string;
  nameUz: string;
  priceUzs: number;
  image: string;
  quantity: number;
  isCustomPc?: boolean;
  buildSpecs?: BuildConfiguration;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductSpec) => void;
  addCustomPcToCart: (build: BuildConfiguration, totalPrice: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pc_market_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('pc_market_cart', JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addToCart = (product: ProductSpec) => {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      saveCart(
        items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      saveCart([
        ...items,
        {
          id: `item-${Date.now()}-${product.id}`,
          productId: product.id,
          nameRu: product.nameRu,
          nameUz: product.nameUz,
          priceUzs: product.priceUzs,
          image: product.image,
          quantity: 1,
        },
      ]);
    }
  };

  const addCustomPcToCart = (build: BuildConfiguration, totalPrice: number) => {
    const partsCount = Object.values(build).filter(Boolean).length;
    if (partsCount === 0) return;

    const customPcItem: CartItem = {
      id: `custom-pc-${Date.now()}`,
      nameRu: `Кастомный игровой ПК (${partsCount} комплектующих)`,
      nameUz: `Maxsus yig'ilgan o'yin kompyuteri (${partsCount} ta qism)`,
      priceUzs: totalPrice,
      image: build.case?.image || build.gpu?.image || '/images/products/case-h6flow.png',
      quantity: 1,
      isCustomPc: true,
      buildSpecs: build,
    };

    saveCart([...items, customPcItem]);
  };

  const removeFromCart = (itemId: string) => {
    saveCart(items.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    saveCart(
      items
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.priceUzs * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addCustomPcToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItemsCount,
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
