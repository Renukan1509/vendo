import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrdersByCustomer, getOrdersByMachine, createOrder, getMachineById } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Please login to view orders' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const machineId = searchParams.get('machineId');

  // If operator, can see all orders or filtered by machine
  if (user.role === 'OPERATOR') {
    if (machineId) {
      return NextResponse.json({ success: true, orders: getOrdersByMachine(machineId) });
    }
    return NextResponse.json({ success: true, orders: getAllOrders() });
  }

  // Customer only sees their own orders
  const orders = getOrdersByCustomer(user.userId);
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Please login or provide credentials to checkout' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { machineId, items, paymentMethod = 'UPI' } = body;

    if (!machineId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order: Machine and at least one item are required' }, { status: 400 });
    }

    const machine = getMachineById(machineId);
    if (!machine) {
      return NextResponse.json({ error: `Selected machine ${machineId} does not exist.` }, { status: 404 });
    }

    if (machine.status !== 'ONLINE') {
      return NextResponse.json({ error: `Vending machine ${machine.name} is currently ${machine.status.toLowerCase()}. Please select another machine.` }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, it: { subtotal: number }) => sum + it.subtotal, 0);

    const order = createOrder({
      customerId: user.userId,
      customerName: user.name,
      customerPhone: '+91 98765 00000',
      customerEmail: user.email,
      machineId: machine.id,
      machineName: machine.name,
      machineLocation: machine.location,
      items,
      totalAmount,
      status: 'CONFIRMED',
      paymentMethod,
      paymentStatus: 'PAID',
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully! Punch the OTP code at the machine or scan to dispense.',
      order,
    }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
