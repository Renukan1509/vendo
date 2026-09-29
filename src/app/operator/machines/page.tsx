'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { OperatorSidebar } from '@/components/OperatorSidebar';
import { OperatorHeader } from '@/components/OperatorHeader';
import { VendingMachine, MachineStatus } from '@/lib/types';
import { generateMachineQRDataUrl } from '@/lib/qr';
import {
  Store,
  Plus,
  QrCode,
  Edit2,
  Trash2,
  Download,
  Printer,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Box,
  Layers,
  X,
} from 'lucide-react';

export default function OperatorMachinesPage() {
  const { isOperator } = useAuth();
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<VendingMachine | null>(null);

  // QR Modal
  const [qrModalMachine, setQrModalMachine] = useState<VendingMachine | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    description: '',
    contactPhone: '+91 98765 00000',
    totalSlots: 40,
    status: 'ONLINE' as MachineStatus,
  });

  const fetchMachines = () => {
    setLoading(true);
    fetch('/api/machines')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMachines(data.machines);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleOpenQR = async (m: VendingMachine) => {
    setQrModalMachine(m);
    const dataUrl = await generateMachineQRDataUrl(m.id);
    setQrDataUrl(dataUrl);
  };

  const handleCreateMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({
          id: '',
          name: '',
          location: '',
          description: '',
          contactPhone: '+91 98765 00000',
          totalSlots: 40,
          status: 'ONLINE',
        });
        fetchMachines();
      } else {
        alert(data.error || 'Failed to create machine');
      }
    } catch {
      alert('Error creating machine');
    }
  };

  const handleEditMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;
    try {
      const res = await fetch(`/api/machines/${selectedMachine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchMachines();
      }
    } catch {
      alert('Error updating machine');
    }
  };

  const handleDeleteMachine = async (id: string) => {
    if (!window.confirm(`Are you sure you want to deactivate and remove machine "${id}"?`)) return;
    try {
      const res = await fetch(`/api/machines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMachines();
      }
    } catch {
      alert('Error deleting machine');
    }
  };

  const downloadQRImage = () => {
    if (!qrDataUrl || !qrModalMachine) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `vendogo-qr-${qrModalMachine.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const printSticker = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <OperatorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OperatorHeader
          title="Vending Fleet Management"
          subtitle="Deploy new dispensers, generate printable QR stickers, and monitor online telemetry."
          actionButton={
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Machine</span>
            </button>
          }
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full">
          {loading ? (
            <div className="py-24 text-center text-xs font-bold text-slate-500">
              Loading machine network...
            </div>
          ) : machines.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl p-8 border border-slate-200">
              <Store className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Vending Machines Registered</h3>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                + Register First Machine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {machines.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        {m.id}
                      </span>
                      {m.status === 'ONLINE' ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <AlertCircle className="w-3 h-3" />
                          {m.status}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">{m.name}</h3>
                      <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{m.location}</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{m.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 block font-medium">Slots</span>
                        <span className="font-bold text-slate-800">{m.availableSlots} / {m.totalSlots}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-[10px] text-slate-400 block font-medium">Chilled Temp</span>
                        <span className="font-bold text-slate-800">{m.temperature || '4.2°C'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Machine Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenQR(m)}
                      type="button"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-emerald-700" />
                      <span>Generate & Print Machine QR</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/machine/${m.id}`}
                        target="_blank"
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-colors"
                      >
                        View Shop
                      </Link>

                      <Link
                        href="/operator/inventory"
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inventory</span>
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedMachine(m);
                          setFormData({
                            id: m.id,
                            name: m.name,
                            location: m.location,
                            description: m.description,
                            contactPhone: m.contactPhone,
                            totalSlots: m.totalSlots,
                            status: m.status,
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Edit Machine"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteMachine(m.id)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete Machine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* QR Code Sticker Modal */}
      {qrModalMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Machine QR Sticker</h3>
                <p className="text-[11px] text-slate-400 font-mono">{qrModalMachine.id}</p>
              </div>
              <button
                onClick={() => setQrModalMachine(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable sticker card */}
            <div className="p-6 bg-slate-50 overflow-y-auto flex flex-col items-center">
              <div
                id="printable-sticker"
                className="w-full max-w-[320px] bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-xl text-center space-y-4"
              >
                {/* Brand header */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="font-black text-lg text-slate-900">
                    VENDO<span className="text-emerald-600">GO</span>
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                    Smart Vending. Simple Shopping.
                  </p>
                </div>

                {/* QR Code image */}
                <div className="p-2 bg-white rounded-2xl border border-slate-100 shadow-inner inline-block">
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${qrModalMachine.id}`}
                      className="w-48 h-48 mx-auto"
                    />
                  )}
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-black">
                    MACHINE ID: {qrModalMachine.id}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{qrModalMachine.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{qrModalMachine.location}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 text-[10px] text-emerald-800 font-bold">
                  ⚡ Scan with any phone camera to browse & dispense
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <button
                onClick={downloadQRImage}
                type="button"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={printSticker}
                type="button"
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Sticker</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Machine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Vending Machine</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateMachine} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Machine ID (Unique)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VG-YTL-004"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono uppercase font-bold focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Total Dispense Slots</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={100}
                    value={formData.totalSlots}
                    onChange={(e) => setFormData({ ...formData, totalSlots: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Machine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GCOE Yavatmal — Mechanical Wing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Location Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Floor Lobby, Near Workshop 2"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Refrigerated beverages, high-energy snacks & stationery..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Support Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Deploy Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Machine Modal */}
      {isEditModalOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Machine #{selectedMachine.id}</h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleEditMachine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Machine Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Total Slots</label>
                  <input
                    type="number"
                    value={formData.totalSlots}
                    onChange={(e) => setFormData({ ...formData, totalSlots: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
