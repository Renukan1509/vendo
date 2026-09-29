'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Order } from '@/lib/types';
import {
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti celebration on arrival
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6'],
      });
    } catch {}

    fetch(`/api/orders/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const copyOtp = () => {
    if (order?.pickupOtp) {
      navigator.clipboard.writeText(order.pickupOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Preparing your order receipt...</p>
          </div>
        ) : !order ? (
          <div className="py-16 text-center bg-white rounded-3xl p-8 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
            <Link
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Celebration Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 sm:p-8 text-center space-y-3 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto border border-white/30 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-200" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">Order Confirmed 🎉</h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-sm mx-auto">
                Your items are reserved in the dispenser chute ready for pickup.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Pickup OTP Box */}
              <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Your 4-Digit Dispense OTP
                </span>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    {order.pickupOtp.split('').map((digit, idx) => (
                      <span
                        key={idx}
                        className="w-12 h-14 rounded-2xl bg-white border-2 border-emerald-500 flex items-center justify-center text-2xl font-black text-slate-900 shadow-md font-mono"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={copyOtp}
                    className="p-3 rounded-2xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors shadow-xs"
                    title="Copy OTP"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-emerald-900 font-semibold pt-1">
                  Punch this 4-digit code on the Vendogo machine keypad to dispense.
                </p>
              </div>

              {/* Order Quick Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium">Order ID</span>
                  <p className="text-sm font-black text-slate-900 font-mono mt-0.5">{order.id}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium">Total Paid</span>
                  <p className="text-sm font-black text-emerald-700 mt-0.5">₹{order.totalAmount}</p>
                </div>
              </div>

              {/* Machine Destination */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">{order.machineName || order.machineId}</span>
                  <p className="text-slate-500 mt-0.5">{order.machineLocation}</p>
                  <span className="inline-block mt-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Machine ID: {order.machineId}
                  </span>
                </div>
              </div>

              {/* Items Ordered List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ordered Items ({order.items.length})
                </h3>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2 px-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.productName}</p>
                          <p className="text-slate-400 text-[11px]">
                            Qty: {item.quantity} × ₹{item.unitPrice}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/orders"
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center shadow-md transition-colors"
                >
                  View in My Orders
                </Link>

                <Link
                  href="/"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center shadow-md shadow-emerald-600/20 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
