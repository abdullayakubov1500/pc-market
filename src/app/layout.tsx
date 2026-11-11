import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/common/Providers';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'CYBER-MARKET.UZ | Интернет-магазин ПК, 3D Конструктор и Расчет FPS',
  description: 'Купить компьютерные комплектующие в Ташкенте. Интерактивный 3D конфигуратор ПК с проверкой совместимости и калькулятором FPS в 20 тяжелых играх.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090d14] dark:text-gray-100 selection:bg-cyan-500 selection:text-black transition-colors duration-200">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
