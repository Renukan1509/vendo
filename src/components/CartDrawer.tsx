'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    selectedMachine,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'CASH_AT_MACHINE'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      router.push('/auth/login?redirect=cart');
      return;
    }

    if (!selectedMachine) {
      setErrorMessage('Please select a vending machine before proceeding.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderItems = items.map((it) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: it.product.id,
        productName: it.product.name,
        productImage: it.product.image,
        unitPrice: it.product.price,
        quantity: it.quantity,
        subtotal: it.product.price * it.quantity,
        unit: it.product.unit,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: selectedMachine.id,
          items: orderItems,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to place order.');
        return;
      }

      // Clear cart on successful order
      clearCart();
      setIsCartOpen(false);
      router.push(`/order-confirmation/${data.order.id}`);
    } catch {
      setErrorMessage('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">My Cart</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {items.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Machine Pickup Info Bar */}
          <div className="p-3.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2.5 text-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="font-bold text-slate-900 truncate">
                Dispensing at: {selectedMachine?.name || 'Vendogo Hub'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {selectedMachine?.location || 'Select a machine'}
              </p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  🛒
                </div>
                <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse delicious snacks, cold beverages, and essentials from your Vendogo machine.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                    <p className="text-[11px] text-slate-400">{product.unit}</p>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">
                      ₹{product.price * quantity}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs overflow-hidden shadow-xs">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      type="button"
                      className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-black text-xs min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      type="button"
                      className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}

            {items.length > 0 && (
              <div className="space-y-4 pt-2">
                {/* Payment Selection */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Payment & Dispense Mode
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'UPI'
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-bold">UPI / GPay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'CARD'
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-[11px] font-bold">Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH_AT_MACHINE')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'CASH_AT_MACHINE'
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span className="text-[11px] font-bold">Machine Pay</span>
                    </button>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 mb-1">Bill Summary</h4>
                  <div className="flex justify-between text-slate-600">
                    <span>Item Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Machine Dispense Fee</span>
                    <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform & Taxes</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                    <span>Grand Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Total payable</span>
                <span className="text-lg font-black text-slate-900">₹{totalAmount}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>Generating Dispense OTP...</span>
                ) : (
                  <>
                    <span>Proceed to Pay & Dispense</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant 30s optical chute dispense guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
