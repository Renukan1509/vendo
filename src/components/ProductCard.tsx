'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.isVegetarian && (
            <span
              className="w-4 h-4 rounded-sm border border-emerald-600 flex items-center justify-center bg-white/90 shadow-xs"
              title="100% Vegetarian"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </span>
          )}

          {product.isBestseller && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
              <Flame className="w-2.5 h-2.5" />
              HOT
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        {isOutOfStock ? (
          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold border border-red-200">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-200 animate-pulse">
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      {/* Image Area - click opens QuickView */}
      <div
        onClick={() => onQuickView && onQuickView(product)}
        className="relative pt-[80%] w-full bg-slate-50 cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />
        {product.calories && (
          <span className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-medium bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs">
            {product.calories}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div onClick={() => onQuickView && onQuickView(product)} className="cursor-pointer space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
            {product.categoryName || 'Snacks'}
          </p>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">{product.unit}</p>
        </div>

        {/* Price and Add/Counter Section */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[11px] text-slate-400 line-through">₹{product.mrp}</span>
              )}
            </div>
            {product.stock > 0 && (
              <span className="text-[10px] text-emerald-600 font-semibold">In Vending Slot</span>
            )}
          </div>

          {/* Quick-Commerce Action Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addItem(product)}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-extrabold text-xs border border-emerald-200 hover:border-emerald-600 transition-all duration-150 shadow-xs flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD
            </button>
          ) : (
            <div className="flex items-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 overflow-hidden">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                type="button"
                className="px-2.5 py-1.5 hover:bg-emerald-700 transition-colors"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 font-black text-xs select-none min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                type="button"
                className="px-2.5 py-1.5 hover:bg-emerald-700 transition-colors"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
