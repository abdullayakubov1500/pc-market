'use client';

import React from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import { I18nProvider } from '@/lib/i18n/context';
import { CartProvider } from '@/lib/cart-context';
import { BuilderProvider } from '@/lib/builder-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CartProvider>
          <BuilderProvider>{children}</BuilderProvider>
        </CartProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
