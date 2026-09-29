import { NextRequest, NextResponse } from 'next/server';
import { getMachineById, updateMachine, deleteMachine, getProductsByMachine } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { generateMachineQRDataUrl } from '@/lib/qr';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const machine = getMachineById(id);

  if (!machine) {
    return NextResponse.json({ error: `Vending machine with ID "${id}" was not found.` }, { status: 404 });
  }

  const products = getProductsByMachine(machine.id);
  const qrDataUrl = await generateMachineQRDataUrl(machine.id, req.nextUrl.origin);

  return NextResponse.json({
    success: true,
    machine: {
      ...machine,
      qrDataUrl,
    },
    products,
    productCount: products.length,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUserFromRequest(req);
  if (!user || user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Unauthorized: Operator privileges required' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = updateMachine(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, machine: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUserFromRequest(req);
  if (!user || user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Unauthorized: Operator privileges required' }, { status: 403 });
  }

  const { id } = await params;
  const deleted = deleteMachine(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Machine removed successfully' });
}
