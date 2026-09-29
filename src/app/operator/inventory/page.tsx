'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { OperatorSidebar } from '@/components/OperatorSidebar';
import { OperatorHeader } from '@/components/OperatorHeader';
import { VendingMachine, Product } from '@/lib/types';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Box,
  MapPin,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function OperatorInventoryPage() {
  const { isOperator } = useAuth();
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMachineId, setActiveMachineId] = useState<string>('ALL');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/machines').then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([mData, pData]) => {
        if (mData.success) setMachines(mData.machines);
        if (pData.success) setProducts(pData.products);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestock = async (productId: string, amount: number) => {
    try {
      const res = await fetch('/api/products/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, delta: amount }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch {}
  };

  // Low stock products across all machines
  const lowStockItems = products.filter((p) => p.stock <= 5);

  const displayMachines =
    activeMachineId === 'ALL'
      ? machines
      : machines.filter((m) => m.id === activeMachineId);

  return (
    <div className="min-h-screen flex bg-slate-100">
      <OperatorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OperatorHeader
          title="Machine-Wise Inventory & Slot Matrix"
          subtitle="Real-time physical slot replenishment, low-stock threshold triggers, and stock levels."
          actionButton={
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh Inventory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          }
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full">
          {/* Low Stock Urgent Alerts Banner */}
          {lowStockItems.length > 0 && (
            <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-900">
                      Low-Stock Replenishment Needed ({lowStockItems.length} SKUs)
                    </h3>
                    <p className="text-[11px] text-amber-700">
                      The following products have dropped to 5 or fewer units in their respective dispensers:
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {lowStockItems.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5 border border-slate-100"
                      />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 text-xs truncate block">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold">
                          {p.machineId} • only {p.stock} units remaining
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestock(p.id, 10)}
                      className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold flex-shrink-0 ml-2"
                    >
                      +10 Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Machine Filter Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveMachineId('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeMachineId === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              All Machines ({machines.length})
            </button>
            {machines.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMachineId(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeMachineId === m.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {m.id} — {m.name.slice(0, 18)}...
              </button>
            ))}
          </div>

          {/* Machine Wise Inventory Matrix */}
          <div className="space-y-6">
            {displayMachines.map((machine) => {
              const machineProducts = products.filter((p) => p.machineId === machine.id);
              const inStockCount = machineProducts.filter((p) => p.stock > 5).length;
              const lowStockCount = machineProducts.filter((p) => p.stock <= 5 && p.stock > 0).length;
              const outOfStockCount = machineProducts.filter((p) => p.stock === 0).length;

              return (
                <div
                  key={machine.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4"
                >
                  {/* Machine Header */}
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {machine.id}
                        </span>
                        <h3 className="font-black text-base">{machine.name}</h3>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {machine.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{inStockCount} In Stock</span>
                      </div>
                      {lowStockCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>{lowStockCount} Low Stock</span>
                        </div>
                      )}
                      {outOfStockCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <span>{outOfStockCount} Empty</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slot Items Matrix */}
                  <div className="p-5 pt-0">
                    {machineProducts.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        No products currently assigned to this dispenser slot matrix.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {machineProducts.map((p) => {
                          const isLow = p.stock <= 5 && p.stock > 0;
                          const isOut = p.stock <= 0;

                          return (
                            <div
                              key={p.id}
                              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                isOut
                                  ? 'border-red-200 bg-red-50/30'
                                  : isLow
                                  ? 'border-amber-200 bg-amber-50/40'
                                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-900 truncate">
                                    {p.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400">{p.unit} • ₹{p.price}</p>
                                  <div className="mt-1 flex items-center gap-1.5">
                                    <span
                                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                        isOut
                                          ? 'bg-red-100 text-red-700'
                                          : isLow
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}
                                    >
                                      {p.stock} Units
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Restock action buttons */}
                              <div className="flex flex-col gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleRestock(p.id, 5)}
                                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-300 transition-colors shadow-2xs"
                                  title="Add 5 units"
                                >
                                  +5 Fill
                                </button>
                                <button
                                  onClick={() => handleRestock(p.id, 10)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs transition-colors"
                                  title="Add 10 units"
                                >
                                  +10 Fill
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
