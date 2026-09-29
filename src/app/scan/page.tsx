'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QRModal } from '@/components/QRModal';
import { QrCode, ArrowLeft, Camera, Sparkles, MapPin } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [manualId, setManualId] = useState('');

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      router.push(`/machine/${manualId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Scan Vendogo QR Code</h1>
            <p className="text-xs text-slate-500 mt-1">
              Every Vendogo machine has a unique QR sticker. Scan it to unlock instant vending.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            <span>Launch Live Camera Scanner</span>
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-bold uppercase tracking-wider">
                Or Quick Test
              </span>
            </div>
          </div>

          {/* Quick Click Demo Machines */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 text-left">
              Click any campus machine to simulate QR scan:
            </p>
            <div className="space-y-2 text-left">
              {[
                { id: 'VG-YTL-001', name: 'GCOE Yavatmal — Tech Block A' },
                { id: 'VG-YTL-002', name: 'GCOE Yavatmal — Library Hub' },
                { id: 'VG-YTL-003', name: 'YTL Bus Terminal Concourse' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/machine/${m.id}`)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center justify-between transition-all group"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 group-hover:text-emerald-700">
                      {m.id}
                    </span>
                    <p className="text-[11px] text-slate-500">{m.name}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    Connect →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input */}
          <form onSubmit={handleManual} className="pt-2 text-left space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Enter Machine ID Manually
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. VG-YTL-001"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase focus:border-emerald-500 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Go
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <QRModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
