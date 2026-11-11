import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');

    const where: any = {};

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { nameRu: { contains: search } },
        { nameUz: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.priceUzs = {};
      if (minPrice) where.priceUzs.gte = parseInt(minPrice);
      if (maxPrice) where.priceUzs.lte = parseInt(maxPrice);
    }

    if (brand) {
      where.brand = brand;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { priceUzs: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
