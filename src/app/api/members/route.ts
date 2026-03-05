import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      mobile: true,
      family: {
        select: {
          familyName: true,
        },
      },
    },
  });
  return NextResponse.json(members);
}
