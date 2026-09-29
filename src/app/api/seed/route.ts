import { NextResponse } from 'next/server';
import { resetDb } from '@/lib/db';

export async function POST() {
  const db = resetDb();
  return NextResponse.json({
    success: true,
    message: 'Vendogo database successfully reset and seeded with initial demo data!',
    machinesCount: db.machines.length,
    productsCount: db.products.length,
    usersCount: db.users.length,
    ordersCount: db.orders.length,
  });
}
