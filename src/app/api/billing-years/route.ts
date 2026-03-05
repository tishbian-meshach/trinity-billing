import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const billingYears = await prisma.billingYear.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
    },
  });
  return NextResponse.json(billingYears);
}
