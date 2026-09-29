'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VendogoLogo } from './VendogoLogo';
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  ListOrdered,
  Store,
  Layers,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function OperatorSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { href: '/operator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/operator/machines', label: 'Machines & QRs', icon: Store },
    { href: '/operator/products', label: 'Products Catalog', icon: ShoppingBag },
    { href: '/operator/inventory', label: 'Inventory & Slots', icon: Layers },
    { href: '/operator/orders', label: 'Live Orders', icon: ListOrdered },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 flex-shrink-0 min-h-screen">
      {/* Brand & Badge */}
      <div className="p-6 space-y-6">
        <div>
          <VendogoLogo size="md" showTagline={false} className="[&_span]:text-white" />
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
              Operator Control Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Customer View</span>
          </div>
          <span className="text-[10px] text-slate-400">Shop →</span>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
