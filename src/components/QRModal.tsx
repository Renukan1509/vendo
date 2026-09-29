'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Camera, AlertTriangle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ isOpen, onClose }: QRModalProps) {
  const router = useRouter();
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedMachine, setDetectedMachine] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  // Initialize camera scanner when modal opens
  useEffect(() => {
    let html5QrCode: any = null;

    if (isOpen) {
      setCameraError(null);
      setDetectedMachine(null);
      setIsScanning(true);

      // Dynamically import html5-qrcode
      import('html5-qrcode')
        .then(({ Html5Qrcode }) => {
          if (!scannerRef.current) return;
          html5QrCode = new Html5Qrcode('qr-reader-container');

          html5QrCode
            .start(
              { facingMode: 'environment' },
              {
                fps: 10,
                qrbox: { width: 220, height: 220 },
              },
              (decodedText: string) => {
                handleScannedData(decodedText);
                if (html5QrCode) {
                  html5QrCode.stop().catch(() => {});
                }
              },
              () => {
                // Ignore frame parse errors
              }
            )
            .catch((err: any) => {
              setCameraError('Camera access not granted or unavailable. You can use Quick Simulation or enter Machine ID below.');
              setIsScanning(false);
            });
        })
        .catch(() => {
          setCameraError('Camera module unavailable in this environment.');
          setIsScanning(false);
        });
    }

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScannedData = (text: string) => {
    let machineId = text.trim();

    // If it's a full URL like https://vendogo.app/machine/VG-YTL-001
    if (text.includes('/machine/')) {
      const parts = text.split('/machine/');
      machineId = parts[1]?.split('?')[0]?.split('#')[0] || '';
    } else if (text.startsWith('{')) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.machineId) machineId = parsed.machineId;
      } catch {}
    }

    cleanAndRedirect(machineId);
  };

  const cleanAndRedirect = (machineId: string) => {
    const clean = machineId.trim().toUpperCase();
    if (!clean.startsWith('VG-')) {
      setCameraError(`"${machineId}" is not a valid Vendogo machine QR code.`);
      return;
    }

    setDetectedMachine(clean);
    setTimeout(() => {
      onClose();
      router.push(`/machine/${clean}`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Scan Machine QR</h2>
              <p className="text-[11px] text-slate-400">Aim at the QR sticker on Vendogo machine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder Area */}
        <div className="p-5 flex flex-col items-center justify-center bg-slate-950 text-white min-h-[260px] relative overflow-hidden">
          {detectedMachine ? (
            <div className="py-12 flex flex-col items-center gap-3 animate-in zoom-in duration-200 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black text-lg text-emerald-400">Machine Detected!</h4>
                <p className="font-mono text-sm text-slate-300 mt-0.5">{detectedMachine}</p>
                <p className="text-xs text-slate-400 mt-2">Opening dispenser inventory...</p>
              </div>
            </div>
          ) : (
            <>
              {/* HTML5 QR Code Mount Element */}
              <div
                id="qr-reader-container"
                ref={scannerRef}
                className="w-full max-w-[260px] rounded-2xl overflow-hidden shadow-inner"
              />

              {/* Viewfinder Target Overlays */}
              <div className="relative w-56 h-56 border-2 border-emerald-500/60 rounded-2xl flex items-center justify-center pointer-events-none mt-2">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                {/* Animated scan bar */}
                <div className="w-48 h-0.5 bg-emerald-400 shadow-md shadow-emerald-400/80 animate-bounce" />
              </div>
            </>
          )}

          {cameraError && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-200 text-xs text-center flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Quick Test Simulator for Testing without physical stickers */}
        <div className="p-4 bg-emerald-50/60 border-t border-emerald-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Quick Test Simulator (Click to test QR detection):
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleScannedData('VG-YTL-001')}
              type="button"
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-[11px] font-bold border border-emerald-200 shadow-2xs transition-colors truncate"
            >
              VG-YTL-001
            </button>
            <button
              onClick={() => handleScannedData('VG-YTL-002')}
              type="button"
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-[11px] font-bold border border-emerald-200 shadow-2xs transition-colors truncate"
            >
              VG-YTL-002
            </button>
            <button
              onClick={() => handleScannedData('VG-YTL-003')}
              type="button"
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-[11px] font-bold border border-emerald-200 shadow-2xs transition-colors truncate"
            >
              VG-YTL-003
            </button>
          </div>
        </div>

        {/* Manual Code Input Option */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Or Enter Machine ID Manually
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. VG-YTL-001"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase focus:border-emerald-500 focus:bg-white outline-none"
            />
            <button
              onClick={() => cleanAndRedirect(manualCode)}
              type="button"
              disabled={!manualCode.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Go</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
