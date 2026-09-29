'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(otp);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ACTIVE') return o.status !== 'COMPLETED' && o.status !== 'CANCELLED';
    if (filter === 'COMPLETED') return o.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View your dispense codes, receipts, and order statuses
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-bold gap-1 self-start sm:self-auto">
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === tab
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? 'All Orders' : tab === 'ACTIVE' ? 'Active / Dispensing' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading your order history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <h3 className="text-sm font-bold text-slate-800">No orders found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet in this filter.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isCompleted = order.status === 'COMPLETED';
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900">{order.id}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>

                    {/* Dispense Code Badge */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase">
                          Dispense OTP:
                        </span>
                        <span className="font-mono font-black text-sm text-slate-900 tracking-wider">
                          {order.pickupOtp}
                        </span>
                        <button
                          onClick={() => copyCode(order.pickupOtp)}
                          className="text-emerald-700 hover:text-emerald-900 p-0.5"
                          title="Copy"
                        >
                          {copiedOtp === order.pickupOtp ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-sm font-black text-slate-900 ml-2">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Machine Location */}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-slate-800">{order.machineName || order.machineId}</span>
                    <span className="text-slate-400">•</span>
                    <span className="truncate">{order.machineLocation}</span>
                  </div>

                  {/* Items Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {order.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-slate-200"
                        />
                        <div className="flex-1 truncate">
                          <span className="font-bold text-slate-800 truncate block">
                            {it.productName}
                          </span>
                          <span className="text-slate-400 text-[10px]">Qty: {it.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{it.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Payment: {order.paymentMethod} • {order.paymentStatus}
                    </span>
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-xs"
                    >
                      <span>Receipt & Instructions</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
