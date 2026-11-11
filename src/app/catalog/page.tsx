'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useCart } from '@/lib/cart-context';
import { useBuilder } from '@/lib/builder-context';
import { ProductSpec } from '@/lib/compatibility';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Sliders, 
  Check, 
  Layers, 
  ArrowUpDown,
  X,
  Cpu,
  Monitor,
  CircuitBoard,
  Fan,
  HardDrive,
  Zap,
  Box
} from 'lucide-react';

interface CategoryItem {
  id: string;
  nameRu: string;
  nameUz: string;
  icon: string;
  _count?: { products: number };
}

export default function CatalogPage() {
  const { lang, t, formatPrice } = useI18n();
  const { addToCart } = useCart();
  const { build, setPart } = useBuilder();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductSpec[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'name'>('priceAsc');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<ProductSpec | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = `/api/products?categoryId=${selectedCategory}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory, search]);

  const brands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  const filteredAndSortedProducts = products
    .filter((p) => {
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceUzs - b.priceUzs;
      if (sortBy === 'priceDesc') return b.priceUzs - a.priceUzs;
      if (sortBy === 'name') return a.nameRu.localeCompare(b.nameRu);
      return 0;
    });

  const handleAddToCart = (product: ProductSpec) => {
    addToCart(product);
    setAddedItemNotice(product.id);
    setTimeout(() => setAddedItemNotice(null), 2000);
  };

  const handleAddToBuilder = (product: ProductSpec) => {
    const slotKey = product.categoryId as any;
    setPart(slotKey, product);
    setAddedItemNotice(`builder-${product.id}`);
    setTimeout(() => setAddedItemNotice(null), 2000);
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'cpu': return Cpu;
      case 'gpu': return Monitor;
      case 'motherboard': return CircuitBoard;
      case 'ram': return Layers;
      case 'cooler': return Fan;
      case 'storage': return HardDrive;
      case 'psu': return Zap;
      case 'case': return Box;
      default: return Layers;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t.common.catalog}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {lang === 'ru'
              ? 'Комплектующие с гарантией до 3-х лет и ценами в узбекских сумах (UZS)'
              : '3 yilgacha kafolat va o\'zbek so\'mida (UZS) ko\'rsatilgan narxlardagi qismlar'}
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300">
          {t.catalog.productsFound}: <span className="font-bold text-white">{filteredAndSortedProducts.length}</span>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
            setSelectedBrand('all');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-[#0e1422] border border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.catalog.allCategories}</span>
        </button>

        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedBrand('all');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-[#0e1422] border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{lang === 'ru' ? cat.nameRu : cat.nameUz}</span>
              {cat._count && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/30 text-black' : 'bg-white/10 text-gray-300'
                }`}>
                  {cat._count.products}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0e1422] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.common.search}
            className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Brand & Sort Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Brand selector */}
          {brands.length > 0 && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-black/60 border border-white/10 text-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">{lang === 'ru' ? 'Все бренды' : 'Barcha brendlar'}</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="priceAsc" className="bg-gray-900">{t.catalog.sortPriceAsc}</option>
              <option value="priceDesc" className="bg-gray-900">{t.catalog.sortPriceDesc}</option>
              <option value="name" className="bg-gray-900">{t.catalog.sortName}</option>
            </select>
          </div>

        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-sm">{t.common.loading}</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="py-24 text-center bg-[#0e1422] rounded-3xl border border-white/10">
          <p className="text-gray-400 text-sm">
            {lang === 'ru' ? 'Товары по вашему запросу не найдены' : 'Sizning so\'rovingiz bo\'yicha mahsulot topilmadi'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((prod) => {
            const isAddedToCart = addedItemNotice === prod.id;
            const isAddedToBuilder = addedItemNotice === `builder-${prod.id}`;
            const isCurrentlyInBuilder = build[prod.categoryId as keyof typeof build]?.id === prod.id;

            return (
              <div
                key={prod.id}
                className="bg-[#0e1422] border border-white/10 hover:border-cyan-500/40 rounded-3xl p-4 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {/* Product Card Top */}
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedProduct(prod)}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/5 cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10 uppercase">
                      {prod.brand}
                    </span>
                    {prod.inStock && (
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-800">
                        {t.common.inStock}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3
                      onClick={() => setSelectedProduct(prod)}
                      className="font-bold text-white text-sm line-clamp-2 cursor-pointer hover:text-cyan-300 transition-colors"
                    >
                      {lang === 'ru' ? prod.nameRu : prod.nameUz}
                    </h3>

                    {/* Specs Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {prod.socket && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 font-mono border border-blue-900/40">
                          {prod.socket}
                        </span>
                      )}
                      {prod.ramType && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 font-mono border border-amber-900/40">
                          {prod.ramType}
                        </span>
                      )}
                      {prod.capacityGb && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono border border-emerald-900/40">
                          {prod.capacityGb}GB
                        </span>
                      )}
                      {prod.tdp && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 font-mono border border-rose-900/40">
                          {prod.tdp}W
                        </span>
                      )}
                      {prod.psuWattage && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 font-mono border border-purple-900/40">
                          {prod.psuWattage}W
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Card Bottom: Price and Actions */}
                <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono block">
                      {t.common.price}
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">
                      {formatPrice(prod.priceUzs)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Add to Cart button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold text-xs transition-all ${
                        isAddedToCart
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      }`}
                    >
                      {isAddedToCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.common.selected}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t.common.addToCart}</span>
                        </>
                      )}
                    </button>

                    {/* Add to Builder button */}
                    <button
                      type="button"
                      onClick={() => handleAddToBuilder(prod)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-bold text-xs transition-all ${
                        isAddedToBuilder || isCurrentlyInBuilder
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'bg-cyan-500/15 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/30'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isCurrentlyInBuilder ? t.catalog.alreadyInBuilder : t.catalog.addToBuilder}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e1422] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.model}
                className="w-48 h-48 rounded-2xl object-cover bg-black/40 border border-white/10 shrink-0"
              />
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  {selectedProduct.brand} • {selectedProduct.categoryId.toUpperCase()}
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {lang === 'ru' ? selectedProduct.nameRu : selectedProduct.nameUz}
                </h3>
                <span className="text-2xl font-black text-cyan-300 font-mono block">
                  {formatPrice(selectedProduct.priceUzs)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                {t.catalog.specs}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ru' ? selectedProduct.descriptionRu : selectedProduct.descriptionUz}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {selectedProduct.socket && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Сокет</span>
                  <span className="text-white font-mono font-bold">{selectedProduct.socket}</span>
                </div>
              )}
              {selectedProduct.ramType && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Память</span>
                  <span className="text-white font-mono font-bold">{selectedProduct.ramType}</span>
                </div>
              )}
              {selectedProduct.tdp && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block text-[10px]">TDP</span>
                  <span className="text-white font-mono font-bold">{selectedProduct.tdp} W</span>
                </div>
              )}
              {selectedProduct.psuWattage && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Мощность</span>
                  <span className="text-white font-mono font-bold">{selectedProduct.psuWattage} W</span>
                </div>
              )}
              {selectedProduct.gpuLength && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Длина</span>
                  <span className="text-white font-mono font-bold">{selectedProduct.gpuLength} мм</span>
                </div>
              )}
              {selectedProduct.coolerHeight && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block text-[10px]">Высота кулера</span>
                  <span className="text-white font-mono font-bold">{selectedProduct.coolerHeight} мм</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>{t.common.addToCart}</span>
              </button>
              <button
                onClick={() => {
                  handleAddToBuilder(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Sliders className="w-4 h-4" />
                <span>{t.catalog.addToBuilder}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
