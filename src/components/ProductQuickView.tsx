'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Star, ShieldCheck, Zap } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { addItem, updateQuantity, getItemQuantity, selectedMachine } = useCart();

  if (!product) return null;

  const quantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Area */}
        <div className="relative h-64 bg-gradient-to-b from-slate-50 to-emerald-50/30 flex items-center justify-center p-6 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow-md"
          />
          {product.isVegetarian && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-xs border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-semibold text-emerald-800">100% Vegetarian</span>
            </div>
          )}
        </div>

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>{product.categoryName}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {product.rating || 4.8} ({product.ratingCount || 120}+ reviews)
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">{product.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{product.unit}</p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {/* Vending machine info badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Dispenser Slot: </span>
                <span className="text-slate-600 font-medium">
                  {selectedMachine ? selectedMachine.name : product.machineId}
                </span>
              </div>
            </div>
            <span className="font-black text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200">
              {product.stock} units available
            </span>
          </div>

          {/* Key Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {product.calories && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-medium">Energy / Serving</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{product.calories}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-400 font-medium">Dispense Speed</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">Instant ~ 30 sec</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Automated temperature-controlled storage & certified hygiene</span>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
              )}
            </div>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addItem(product)}
              type="button"
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              ADD TO CART
            </button>
          ) : (
            <div className="flex items-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md overflow-hidden">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                type="button"
                className="px-4 py-2.5 hover:bg-emerald-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-black select-none">{quantity} in cart</span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                type="button"
                className="px-4 py-2.5 hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
