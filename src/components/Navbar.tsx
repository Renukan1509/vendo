'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { VendogoLogo } from './VendogoLogo';
import {
  MapPin,
  QrCode,
  ShoppingCart,
  User as UserIcon,
  Search,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
} from 'lucide-react';

interface NavbarProps {
  onOpenMachineSelector?: () => void;
  onOpenQRScanner?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Navbar({
  onOpenMachineSelector,
  onOpenQRScanner,
  searchQuery = '',
  onSearchChange,
}: NavbarProps) {
  const { user, isOperator, logout } = useAuth();
  const { itemCount, totalAmount, setIsCartOpen, selectedMachine } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo & Location Pill */}
          <div className="flex items-center gap-3 sm:gap-6">
            <VendogoLogo size="md" showTagline={false} />

            {/* Machine Location Selector Pill */}
            <button
              onClick={onOpenMachineSelector}
              type="button"
              className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-left transition-all duration-150 group"
              title="Click to select another Vendogo machine"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col max-w-[200px] lg:max-w-[260px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900 truncate">
                    {selectedMachine ? selectedMachine.name : 'Select Machine'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                </div>
                <span className="text-[10px] text-slate-500 truncate">
                  {selectedMachine ? selectedMachine.location : 'Find nearest vending machine'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chips, drinks, chocolates, pens..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Scan QR Button */}
            <button
              onClick={onOpenQRScanner}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 transition-colors shadow-sm"
              title="Scan machine QR code"
            >
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span className="hidden xs:inline">Scan QR</span>
            </button>

            {/* Operator Portal Link (if operator) */}
            {isOperator && (
              <Link
                href="/operator/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Operator</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[11px] font-bold">
                  {itemCount > 0 ? `${itemCount} items` : 'My Cart'}
                </span>
                {itemCount > 0 && (
                  <span className="text-[10px] text-emerald-100 font-medium">₹{totalAmount}</span>
                )}
              </div>
            </button>

            {/* User Profile / Login dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    type="button"
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-emerald-200 object-cover"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        My Orders
                      </Link>

                      {isOperator && (
                        <Link
                          href="/operator/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          Operator Dashboard
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Machine Pill & Search Bar */}
        <div className="pb-3 pt-1 space-y-2 md:hidden">
          <button
            onClick={onOpenMachineSelector}
            type="button"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {selectedMachine ? selectedMachine.name : 'Select Machine'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold ml-2 flex-shrink-0">Change ▾</span>
          </button>

          <div className="relative sm:hidden">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search snacks, drinks, stationery..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
