import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const machineId = searchParams.get('machineId');
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search')?.toLowerCase();
  const inStockOnly = searchParams.get('inStockOnly') === 'true';

  let products = getAllProducts();

  if (machineId) {
    products = products.filter((p) => p.machineId.toUpperCase() === machineId.toUpperCase());
  }

  if (categoryId && categoryId !== 'all') {
    products = products.filter((p) => p.categoryId === categoryId);
  }

  if (search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.categoryName?.toLowerCase().includes(search)
    );
  }

  if (inStockOnly) {
    products = products.filter((p) => p.stock > 0 && p.status === 'AVAILABLE');
  }

  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user || user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'Unauthorized: Operator privileges required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      categoryId,
      categoryName,
      price,
      mrp,
      stock = 10,
      machineId,
      image,
      unit = '1 pc',
      calories,
    } = body;

    if (!name || !price || !machineId || !categoryId) {
      return NextResponse.json({ error: 'Name, price, machine assignment, and category are required' }, { status: 400 });
    }

    const newProduct = createProduct({
      name: name.trim(),
      description: description?.trim() || '',
      categoryId,
      categoryName,
      price: Number(price),
      mrp: mrp ? Number(mrp) : Number(price),
      stock: Math.max(0, Number(stock) || 0),
      machineId: machineId.trim().toUpperCase(),
      status: Number(stock) > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
      image: image?.trim() || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      unit: unit || '1 pc',
      calories: calories || undefined,
      rating: 4.8,
      ratingCount: 1,
      isBestseller: false,
      isVegetarian: true,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
