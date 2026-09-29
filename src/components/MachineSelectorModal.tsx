'use client';

import React, { useEffect, useState } from 'react';
import { VendingMachine } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { X, MapPin, QrCode, CheckCircle2, AlertCircle, Thermometer, Box } from 'lucide-react';

interface MachineSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQRScanner: () => void;
}

export function MachineSelectorModal({
  isOpen,
  onClose,
  onOpenQRScanner,
}: MachineSelectorModalProps) {
  const { selectedMachine, setSelectedMachine } = useCart();
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/machines')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMachines(data.machines);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Select Vendogo Machine</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the vending machine you want to collect your items from
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scan QR Banner */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-700 text-white flex items-center justify-between shadow-md shadow-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold">Standing in front of a Vendogo?</p>
                <p className="text-[11px] text-emerald-100">Scan machine QR code for instant connect</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenQRScanner();
              }}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-black shadow-xs hover:bg-emerald-50 transition-colors"
            >
              Scan QR
            </button>
          </div>
        </div>

        {/* Machine List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              Loading nearby machines...
            </div>
          ) : machines.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No active vending machines located.
            </div>
          ) : (
            machines.map((machine) => {
              const isSelected = selectedMachine?.id === machine.id;
              const isOnline = machine.status === 'ONLINE';

              return (
                <div
                  key={machine.id}
                  onClick={() => {
                    if (isOnline) {
                      setSelectedMachine(machine);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : isOnline
                      ? 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 cursor-pointer'
                      : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                          {machine.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{machine.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        {machine.location}
                      </p>
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : isOnline ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertCircle className="w-3 h-3" />
                        {machine.status}
                      </span>
                    )}
                  </div>

                  {/* Machine metrics strip */}
                  <div className="pt-2 border-t border-slate-100/80 flex items-center gap-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Box className="w-3 h-3 text-slate-400" />
                      <span>{machine.availableSlots} / {machine.totalSlots} Slots stocked</span>
                    </div>
                    {machine.temperature && (
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-teal-500" />
                        <span>Chilled {machine.temperature}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Smart sensors verify stock in real-time before each dispense transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
