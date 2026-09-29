import { NextRequest, NextResponse } from 'next/server';
import { updateProductStock, getProductById } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user || user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Unauthorized: Operator privileges required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { productId, newStock, delta } = body;

    const prod = getProductById(productId);
    if (!prod) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const targetStock = delta !== undefined ? Math.max(0, prod.stock + Number(delta)) : Math.max(0, Number(newStock));
    const updated = updateProductStock(productId, targetStock);

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
