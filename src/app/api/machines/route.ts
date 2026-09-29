import { NextRequest, NextResponse } from 'next/server';
import { getAllMachines, createMachine, getMachineById } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET() {
  const machines = getAllMachines();
  return NextResponse.json({ success: true, machines });
}

export async function POST(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user || user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Unauthorized: Operator privileges required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, name, location, description, status = 'ONLINE', contactPhone, totalSlots = 40 } = body;

    if (!id || !name || !location) {
      return NextResponse.json({ error: 'Machine ID, Name, and Location are required' }, { status: 400 });
    }

    const cleanId = id.trim().toUpperCase();
    const existing = getMachineById(cleanId);
    if (existing) {
      return NextResponse.json({ error: `Machine ID "${cleanId}" already exists. Please choose a unique ID.` }, { status: 409 });
    }

    const newMachine = createMachine({
      id: cleanId,
      name: name.trim(),
      location: location.trim(),
      description: description?.trim() || 'Modern Vendogo Smart Dispenser',
      status: status || 'ONLINE',
      contactPhone: contactPhone?.trim() || '+91 98765 00000',
      totalSlots: Number(totalSlots) || 40,
      availableSlots: Number(totalSlots) || 40,
      temperature: '4.5°C',
      lastServiced: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ success: true, machine: newMachine }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
