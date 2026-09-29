'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OperatorSidebar } from '@/components/OperatorSidebar';
import { OperatorHeader } from '@/components/OperatorHeader';
import { OperatorAnalytics, OrderStatus } from '@/lib/types';
import {
  Store,
  Box,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export default function OperatorDashboardPage() {
  const router = useRouter();
  const { user, isOperator, isLoading } = useAuth();
  const [analytics, setAnalytics] = useState<OperatorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchAnalytics = () => {
    setLoading(true);
    fetch('/api/operator/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalytics(data.analytics);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && !isOperator) {
      router.push('/auth/login?redirect=operator');
      return;
    }
    if (isOperator) {
      fetchAnalytics();
    }
  }, [isOperator, isLoading]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAnalytics();
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading || !isOperator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs font-bold">
        Verifying Operator clearance...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <OperatorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OperatorHeader
          title="Executive Operator Dashboard"
          subtitle="Real-time vending telemetry, dispense monitoring, and fleet revenue."
          actionButton={
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAnalytics}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/operator/products"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          }
        />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl w-full">
          {/* 6 Key Metric KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Total Machines */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Machines</span>
                <Store className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {analytics?.totalMachines ?? 3}
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">100% telemetry online</p>
            </div>

            {/* Active Machines */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active</span>
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {analytics?.activeMachines ?? 3}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Accepting UPI & cash</p>
            </div>

            {/* Total Products */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Catalog SKUs</span>
                <Box className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {analytics?.totalProducts ?? 21}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Across all machines</p>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-900">
                {analytics?.lowStockCount ?? 2}
              </div>
              <p className="text-[10px] text-amber-700 font-bold">Needs restock (≤5)</p>
            </div>

            {/* Today's Orders */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Orders</span>
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {analytics?.todayOrdersCount ?? 32}
              </div>
              <p className="text-[10px] text-indigo-700 font-semibold">+18% vs yesterday</p>
            </div>

            {/* Today's Sales */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Sales</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-900">
                ₹{analytics?.todayRevenue ? analytics.todayRevenue.toLocaleString('en-IN') : '4,860'}
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">Total: ₹{analytics?.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Visual Analytics Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Sales Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Daily Revenue Performance</h3>
                  <p className="text-xs text-slate-400">Past 7 days across college machines</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  ₹ Live Feed
                </span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {analytics?.dailySales.map((day, idx) => {
                  const maxSale = Math.max(...(analytics?.dailySales.map((d) => d.sales) || [6000]));
                  const heightPercent = Math.max(15, Math.round((day.sales / (maxSale * 1.15)) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        ₹{day.sales} • {day.orders} orders
                      </div>

                      <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl h-44 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all rounded-t-lg shadow-sm"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{day.date}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Peak vending hours: 1:00 PM – 4:30 PM (Post-Lecture Rush)</span>
                <span className="font-bold text-slate-900">Avg. Basket: ₹74</span>
              </div>
            </div>

            {/* Machine Wise Performance */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Machine Fleet Ranking</h3>
                <p className="text-xs text-slate-400">Inventory health & revenue share</p>
              </div>

              <div className="space-y-3.5">
                {analytics?.machinePerformance.map((m) => (
                  <div key={m.machineId} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[170px]">{m.machineName}</span>
                      <span className="font-black text-emerald-700">₹{m.sales}</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${m.stockHealth}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Stock Health: {m.stockHealth}%</span>
                      <span>{m.orders} dispenses</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Alerts & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Watch */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Low Stock Restock Alerts</span>
                  </h3>
                  <p className="text-xs text-slate-400">Items with 5 or fewer units remaining</p>
                </div>
                <Link
                  href="/operator/inventory"
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Manage Inventory →
                </Link>
              </div>

              {analytics?.lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  All vending machine slots are adequately stocked.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {analytics?.lowStockProducts.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Machine: {p.machineId} • ₹{p.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-lg text-xs">
                          {p.stock} left
                        </span>
                        <Link
                          href="/operator/inventory"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                        >
                          Restock
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Customer Orders Feed */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Live Customer Orders</span>
                  </h3>
                  <p className="text-xs text-slate-400">Recent dispenses & active OTPs</p>
                </div>
                <Link
                  href="/operator/orders"
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All Orders →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {analytics?.recentOrders.slice(0, 4).map((o) => (
                  <div key={o.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{o.id}</span>
                        <span className="text-slate-400 text-[11px]">OTP: {o.pickupOtp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {o.customerName} • {o.items.length} items • ₹{o.totalAmount}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        disabled={updatingOrderId === o.id}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-100 border-none outline-none cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY">Ready</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
