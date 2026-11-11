import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        nameRu: data.nameRu,
        nameUz: data.nameUz,
        categoryId: data.categoryId,
        brand: data.brand,
        model: data.model,
        priceUzs: parseInt(data.priceUzs),
        image: data.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500',
        inStock: data.inStock !== false,
        tdp: data.tdp ? parseInt(data.tdp) : null,
        socket: data.socket || null,
        ramType: data.ramType || null,
        formFactor: data.formFactor || null,
        gpuLength: data.gpuLength ? parseInt(data.gpuLength) : null,
        maxGpuLength: data.maxGpuLength ? parseInt(data.maxGpuLength) : null,
        coolerHeight: data.coolerHeight ? parseInt(data.coolerHeight) : null,
        maxCoolerHeight: data.maxCoolerHeight ? parseInt(data.maxCoolerHeight) : null,
        coolerType: data.coolerType || null,
        psuWattage: data.psuWattage ? parseInt(data.psuWattage) : null,
        capacityGb: data.capacityGb ? parseInt(data.capacityGb) : null,
        cpuScore: data.cpuScore ? parseInt(data.cpuScore) : null,
        gpuScore: data.gpuScore ? parseInt(data.gpuScore) : null,
        descriptionRu: data.descriptionRu || null,
        descriptionUz: data.descriptionUz || null,
      },
    });
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
