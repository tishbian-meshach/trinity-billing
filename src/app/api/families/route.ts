import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const families = await prisma.family.findMany({
    orderBy: { familyName: 'asc' },
    select: {
      id: true,
      familyName: true,
    },
  });
  return NextResponse.json(families);
}
