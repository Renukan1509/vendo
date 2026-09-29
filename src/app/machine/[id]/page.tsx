'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { VendingMachine, Product } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { ProductQuickView } from '@/components/ProductQuickView';
import { QRModal } from '@/components/QRModal';
import { MachineSelectorModal } from '@/components/MachineSelectorModal';
import {
  MapPin,
  QrCode,
  Thermometer,
  Box,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Zap,
} from 'lucide-react';

export default function MachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { setSelectedMachine } = useCart();

  const [machine, setMachine] = useState<VendingMachine | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isMachineSelectorOpen, setIsMachineSelectorOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/machines/${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load vending machine');
        }
        setMachine(data.machine);
        setProducts(data.products || []);
        // Automatically make this machine active in customer's session
        setSelectedMachine(data.machine);
      })
      .catch((err: any) => {
        setError(err.message || 'Machine not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        onOpenMachineSelector={() => setIsMachineSelectorOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Machines</span>
          </Link>

          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Connecting to Vendogo Machine #{id}...</p>
          </div>
        ) : error || !machine ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-red-200 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Unknown Vendogo Machine</h2>
            <p className="text-xs text-slate-500">{error || 'This QR code is not registered.'}</p>
            <div className="pt-2">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Browse All Online Machines
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Machine Header Banner */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">
                    {machine.id}
                  </span>
                  {machine.status === 'ONLINE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live & Dispensing
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                      {machine.status}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    Instant UPI Dispense
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-black text-slate-900">{machine.name}</h1>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {machine.location}
                </p>
                <p className="text-xs text-slate-600">{machine.description}</p>
              </div>

              {/* Machine Specs Badges */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto flex-shrink-0">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stocked Slots
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm mt-0.5">
                    <Box className="w-4 h-4 text-emerald-600" />
                    <span>{products.length} / {machine.totalSlots}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chute Temp
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm mt-0.5">
                    <Thermometer className="w-4 h-4 text-teal-600" />
                    <span>{machine.temperature || '4.0°C'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products inside this machine */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Available In This Machine</h2>
                  <p className="text-xs text-slate-500">
                    Select items below to dispense directly from {machine.id}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {filteredProducts.length} items ready
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
                  <p className="text-sm font-bold text-slate-800">No products found</p>
                  <p className="text-xs text-slate-400">This machine may currently be restocking.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      <QRModal isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />
      <MachineSelectorModal
        isOpen={isMachineSelectorOpen}
        onClose={() => setIsMachineSelectorOpen(false)}
        onOpenQRScanner={() => {
          setIsMachineSelectorOpen(false);
          setIsQRScannerOpen(true);
        }}
      />
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
