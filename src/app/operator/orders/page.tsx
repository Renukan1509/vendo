'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { OperatorSidebar } from '@/components/OperatorSidebar';
import { OperatorHeader } from '@/components/OperatorHeader';
import { Order, OrderStatus, VendingMachine } from '@/lib/types';
import {
  ListOrdered,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';

export default function OperatorOrdersPage() {
  const { isOperator } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [machineFilter, setMachineFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/orders').then((res) => res.json()),
      fetch('/api/machines').then((res) => res.json()),
    ])
      .then(([orderData, machineData]) => {
        if (orderData.success) setOrders(orderData.orders);
        if (machineData.success) setMachines(machineData.machines);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (machineFilter !== 'ALL' && o.machineId !== machineFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.pickupOtp.includes(q) ||
        o.machineId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-100">
      <OperatorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OperatorHeader
          title="Live Dispenser Order Monitor"
          subtitle="Real-time optical chute transactions, customer OTP verifications, and order lifecycle states."
          actionButton={
            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          }
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full">
          {/* Filter Toolbar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer, OTP code, or Machine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Machine:</span>
                <select
                  value={machineFilter}
                  onChange={(e) => setMachineFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="ALL">All Machines</option>
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="py-24 text-center text-xs font-bold text-slate-500">
              Loading orders telemetry...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <ListOrdered className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Orders Matched</h3>
              <p className="text-xs text-slate-400">Try changing your filters or search term.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isCompleted = order.status === 'COMPLETED';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {order.id}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-slate-400">({order.customerEmail})</span>
                        </div>
                      </div>

                      {/* Pickup OTP and Timestamp */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-black text-emerald-900">
                          <span className="text-[10px] text-emerald-700 font-sans font-bold">
                            OTP:
                          </span>
                          <span>{order.pickupOtp}</span>
                        </div>

                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Items & Destination */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Destination Machine */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Dispenser Machine
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{order.machineName || order.machineId}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{order.machineLocation}</p>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-1 md:col-span-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Items Reserved ({order.items.length})
                        </span>
                        <div className="space-y-1">
                          {order.items.map((it) => (
                            <div key={it.id} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-700 font-medium truncate max-w-[180px]">
                                {it.quantity}x {it.productName}
                              </span>
                              <span className="font-bold text-slate-900">₹{it.subtotal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financials & Status Changer */}
                      <div className="flex flex-col justify-between items-start md:items-end space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Total Collected
                          </span>
                          <p className="text-base font-black text-slate-900">
                            ₹{order.totalAmount}
                            <span className="text-[10px] text-emerald-700 font-bold ml-1.5">
                              ({order.paymentMethod})
                            </span>
                          </p>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-500">Status:</span>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-black outline-none border cursor-pointer ${
                              order.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : order.status === 'READY'
                                ? 'bg-teal-50 text-teal-800 border-teal-300'
                                : order.status === 'CANCELLED'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
