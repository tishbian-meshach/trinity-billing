import { getFamilyById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import FamilyDetail from '@/components/FamilyDetail';

export const dynamic = 'force-dynamic';

export default async function FamilyDetailPage({ params }: { params: { id: string } }) {
  const family = await getFamilyById(params.id);

  if (!family) {
    notFound();
  }

  return <FamilyDetail family={family} />;
}
