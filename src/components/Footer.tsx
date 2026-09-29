import React from 'react';
import Link from 'next/link';
import { VendogoLogo } from './VendogoLogo';
import { Shield, Zap, Sparkles, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white/10 p-2 rounded-2xl inline-block">
              <VendogoLogo size="md" showTagline={false} className="[&_span]:text-white" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Vending. Simple Shopping. Experience next-generation instant snack & drink
              dispensing at colleges, transit hubs, and corporate campuses.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Dispense speed: ~30 seconds</span>
            </div>
          </div>

          {/* Machine Network */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Campus Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>VG-YTL-001: GCOE Yavatmal — Tech Block</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>VG-YTL-002: Central Library Hub</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>VG-YTL-003: Bus Terminal Concourse</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-emerald-400 transition-colors">
                  Scan Machine QR
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-emerald-400 transition-colors">
                  My Orders & OTPs
                </Link>
              </li>
              <li>
                <Link href="/operator/dashboard" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  Operator / Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Test Accounts & Support */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Demo Testing Credentials
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-400">Operator: </span>
                <span className="font-mono text-emerald-300 font-bold">operator@vendogo.com</span>
                <span className="text-slate-400"> / admin123</span>
              </div>
              <div>
                <span className="text-slate-400">Customer: </span>
                <span className="font-mono text-emerald-300 font-bold">customer@vendogo.com</span>
                <span className="text-slate-400"> / customer123</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2 text-[10px] text-slate-400">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Smart Support Helpline: +91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VENDOGO Inc. All rights reserved. Smart Vending. Simple Shopping.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Secure 256-Bit UPI & OTP Verification
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
