import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const game = await prisma.game.create({
      data: {
        title: data.title,
        image: data.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
        genre: data.genre || 'Action RPG',
        releaseYear: parseInt(data.releaseYear) || 2024,
        gpuIntensity: parseFloat(data.gpuIntensity) || 1.8,
        cpuIntensity: parseFloat(data.cpuIntensity) || 1.5,
        baseFps1080pUltra: parseInt(data.baseFps1080pUltra) || 60,
        ramMinGb: parseInt(data.ramMinGb) || 16,
        descriptionRu: data.descriptionRu || '',
        descriptionUz: data.descriptionUz || '',
      },
    });
    return NextResponse.json({ success: true, game });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add game' }, { status: 500 });
  }
}
