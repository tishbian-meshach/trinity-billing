'use server';

import { prisma } from '@/lib/prisma';
import { sendWhatsApp } from '@/lib/wasender';
import { getTamilMonthName } from '@/lib/tamilMonths';
import { revalidatePath } from 'next/cache';

// ============ FAMILY ACTIONS ============

export async function createFamily(formData: FormData) {
  const familyName = formData.get('familyName') as string;

  await prisma.family.create({
    data: {
      familyName: familyName || null,
    },
  });

  revalidatePath('/families');
}

export async function updateFamily(id: string, familyName: string) {
  await prisma.family.update({
    where: { id },
    data: { familyName: familyName || null },
  });

  revalidatePath('/families');
  revalidatePath(`/families/${id}`);
}

export async function getFamilies() {
  return prisma.family.findMany({
    include: {
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getFamilyById(id: string) {
  return prisma.family.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function deleteFamily(id: string) {
  await prisma.family.delete({ where: { id } });
  revalidatePath('/families');
}

// ============ MEMBER ACTIONS ============

export async function createMember(formData: FormData) {
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const mobile = formData.get('mobile') as string;
  const familyId = formData.get('familyId') as string;

  if (!name || !address || !mobile || !familyId) {
    throw new Error('All fields are required');
  }

  await prisma.member.create({
    data: { name, address, mobile, familyId },
  });

  revalidatePath('/members');
  revalidatePath(`/families/${familyId}`);
}

export async function updateMember(id: string, data: { name?: string; address?: string; mobile?: string; familyId?: string }) {
  await prisma.member.update({
    where: { id },
    data,
  });

  revalidatePath('/members');
  revalidatePath('/families');
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
  });
}

export async function getMembers(search?: string) {
  return prisma.member.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { family: { familyName: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    include: {
      family: true,
    },
    orderBy: { family: { familyName: 'asc' } },
  });
}

export async function deleteMember(id: string) {
  await prisma.member.delete({ where: { id } });
  revalidatePath('/members');
}

export async function updateMemberOrder(memberIds: string[], familyId: string) {
  const updates = memberIds.map((id, index) =>
    prisma.member.update({
      where: { id },
      data: { order: index },
    })
  );

  await Promise.all(updates);
  revalidatePath(`/families/${familyId}`);
  revalidatePath('/payments');
}

// ============ BILLING YEAR ACTIONS ============

export async function createBillingYear(formData: FormData) {
  const name = formData.get('name') as string;
  const startMonth = parseInt(formData.get('startMonth') as string);
  const startYear = parseInt(formData.get('startYear') as string);
  const endMonth = parseInt(formData.get('endMonth') as string);
  const endYear = parseInt(formData.get('endYear') as string);

  if (!name || !startMonth || !startYear || !endMonth || !endYear) {
    throw new Error('All fields are required');
  }

  await prisma.billingYear.create({
    data: { name, startMonth, startYear, endMonth, endYear },
  });

  revalidatePath('/billing-years');
}

export async function getBillingYears() {
  return prisma.billingYear.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteBillingYear(id: string) {
  await prisma.billingYear.delete({ where: { id } });
  revalidatePath('/billing-years');
}

// ============ PAYMENT ACTIONS ============

export async function createPayment(formData: FormData) {
  const memberId = formData.get('memberId') as string;
  const billingYearId = formData.get('billingYearId') as string;
  const month = parseInt(formData.get('month') as string);
  const amount = parseInt(formData.get('amount') as string);
  const sendReceipt = formData.get('sendReceipt') === 'true';

  if (!memberId || !billingYearId || !month || !amount) {
    throw new Error('All fields are required');
  }

  // Create the payment
  await prisma.payment.create({
    data: { memberId, billingYearId, month, amount },
  });

  // Calculate total paid for this billing year
  const totalResult = await prisma.payment.aggregate({
    where: {
      memberId,
      billingYearId,
    },
    _sum: {
      amount: true,
    },
  });

  const totalPaid = totalResult._sum.amount || 0;

  // Get member details
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new Error('Member not found');
  }

  if (sendReceipt) {
    // Construct WhatsApp message
    const tamilMonth = getTamilMonthName(month);
    const message = `*தூய திரித்துவ ஆலயம்*\n*பண்டாரம்பட்டி*\n*சங்க காணிக்கை*\n\n${member.name}\n\n${tamilMonth} வரவு : ₹${amount}\n\nஇதுவரை மொத்த வரவு : ₹${totalPaid}`;

    // Send WhatsApp message
    try {
      await sendWhatsApp(member.mobile, message);
    } catch (error) {
      console.error('WhatsApp send failed:', error);
    }
  }

  revalidatePath('/payments');
  revalidatePath('/dashboard');

  return {
    success: true,
    totalPaid,
    message: sendReceipt ? 'Payment recorded and WhatsApp sent!' : 'Payment recorded successfully.'
  };
}

export async function updatePayment(id: string, data: { month?: number; amount?: number }) {
  await prisma.payment.update({
    where: { id },
    data,
  });

  revalidatePath('/payments');
  revalidatePath('/dashboard');
}

export async function deletePayment(id: string) {
  await prisma.payment.delete({ where: { id } });
  revalidatePath('/payments');
  revalidatePath('/dashboard');
}

export async function getPayments() {
  return prisma.payment.findMany({
    include: {
      member: true,
      billingYear: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPaymentsByBillingYear(billingYearId: string) {
  // Get all families with their members and payments for this billing year
  const families = await prisma.family.findMany({
    include: {
      members: {
        include: {
          payments: {
            where: { billingYearId },
            orderBy: { month: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { familyName: 'asc' },
  });

  return families;
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats(billingYearId?: string) {
  const paymentFilter = billingYearId ? { billingYearId } : {};

  const [totalFamilies, totalMembers, currentYearCollections, recentPayments] =
    await Promise.all([
      prisma.family.count(),
      prisma.member.count(),
      prisma.payment.aggregate({
        where: paymentFilter,
        _sum: { amount: true },
      }),
      prisma.payment.findMany({
        where: paymentFilter,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          member: true,
          billingYear: true,
        },
      }),
    ]);

  return {
    totalFamilies,
    totalMembers,
    totalCollections: currentYearCollections._sum.amount || 0,
    recentPayments,
  };
}
