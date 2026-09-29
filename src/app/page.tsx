'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Product, Category } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { ProductQuickView } from '@/components/ProductQuickView';
import { MachineSelectorModal } from '@/components/MachineSelectorModal';
import { QRModal } from '@/components/QRModal';
import {
  MapPin,
  QrCode,
  Zap,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { selectedMachine, itemCount, totalAmount, setIsCartOpen } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  // Modals state
  const [isMachineSelectorOpen, setIsMachineSelectorOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fetch products and categories based on active machine
  useEffect(() => {
    setLoading(true);
    const machineParam = selectedMachine ? `?machineId=${selectedMachine.id}` : '';

    Promise.all([
      fetch(`/api/products${machineParam}`).then((res) => res.json()),
      fetch('/api/machines').then((res) => res.json()),
    ])
      .then(([prodData]) => {
        if (prodData.success) {
          setProducts(prodData.products);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedMachine]);

  // Categories list
  const categoryList: { id: string; name: string; icon: string }[] = [
    { id: 'all', name: 'All Items', icon: '⚡' },
    { id: 'cat-snacks', name: 'Snacks & Crisps', icon: '🍿' },
    { id: 'cat-drinks', name: 'Beverages & Juices', icon: '🥤' },
    { id: 'cat-chocolates', name: 'Chocolates', icon: '🍫' },
    { id: 'cat-biscuits', name: 'Biscuits', icon: '🍪' },
    { id: 'cat-instant', name: 'Instant Food', icon: '🍜' },
    { id: 'cat-stationery', name: 'Stationery', icon: '✏️' },
    { id: 'cat-personal', name: 'Personal Care', icon: '🧴' },
    { id: 'cat-munchies', name: 'Healthy & Nuts', icon: '🥜' },
  ];

  // Filtered & Sorted products
  const filteredProducts = products.filter((product) => {
    // Category match
    if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.categoryName?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    // Stock filter
    if (onlyInStock && (product.stock <= 0 || product.status === 'OUT_OF_STOCK')) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return (b.ratingCount || 0) - (a.ratingCount || 0);
  });

  const bestsellers = products.filter((p) => p.isBestseller && p.stock > 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar
        onOpenMachineSelector={() => setIsMachineSelectorOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Welcome & Machine Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl p-6 sm:p-8 border border-emerald-900/50">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold tracking-wide">
                <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>30-SECOND INSTANT OPTICAL DISPENSE</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Hello, {user ? user.name.split(' ')[0] : 'Shopper'} 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                Find what you need from your nearest <span className="text-emerald-400 font-bold">Vendogo</span> machine. Pick, pay & collect instantly with zero wait time.
              </p>
            </div>

            {/* Active Machine Card inside Hero */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col gap-3 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Current Machine
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                    {selectedMachine?.id || 'VG-YTL-001'}
                  </span>
                  <h3 className="font-bold text-sm text-white truncate">
                    {selectedMachine?.name || 'GCOE Yavatmal — Tech Block'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  {selectedMachine?.location || 'Yavatmal Campus'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsMachineSelectorOpen(true)}
                  type="button"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-colors text-center"
                >
                  Change Machine
                </button>
                <button
                  onClick={() => setIsQRScannerOpen(true)}
                  type="button"
                  className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors flex items-center gap-1 shadow-sm"
                  title="Scan physical machine QR"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Explore Categories</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {filteredProducts.length} items available
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter:
            </span>

            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              type="button"
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                onlyInStock
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ✓ In Stock Only
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border-none rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Bestsellers Carousel (if viewing all and no search) */}
        {selectedCategory === 'all' && !searchQuery && bestsellers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Campus Bestsellers</span>
              </h2>
              <span className="text-xs text-emerald-700 font-bold">Fastest Moving</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {bestsellers.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Product Catalog Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products in Machine'}
            </h2>
            <span className="text-xs text-slate-500">
              Showing {sortedProducts.length} products
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">Loading Vendogo Dispenser...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-sm font-bold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing your search query or selecting another category or vending machine.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyInStock(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Pill for Mobile */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            type="button"
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-900/30 border border-emerald-500"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                {itemCount}
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-bold block">Items in Cart</span>
                <span className="text-sm font-black">₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-black bg-white text-emerald-800 px-3 py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <MachineSelectorModal
        isOpen={isMachineSelectorOpen}
        onClose={() => setIsMachineSelectorOpen(false)}
        onOpenQRScanner={() => {
          setIsMachineSelectorOpen(false);
          setIsQRScannerOpen(true);
        }}
      />

      <QRModal isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />

      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
