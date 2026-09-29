'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, ShieldCheck } from 'lucide-react';

interface OperatorHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function OperatorHeader({ title, subtitle, actionButton }: OperatorHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actionButton}

        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="Operator"
            className="w-8 h-8 rounded-full border border-emerald-300 object-cover"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Operator'}</p>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Operator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
