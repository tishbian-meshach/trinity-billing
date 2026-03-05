import { getMemberById, getFamilies } from '@/lib/actions';
import EditMemberForm from './EditMemberForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const [member, families] = await Promise.all([
    getMemberById(params.id),
    getFamilies(),
  ]);

  if (!member) {
    notFound();
  }

  // Map to simple family objects for dropdown
  const formattedFamilies = families.map((f) => ({
    id: f.id,
    familyName: f.familyName,
  }));

  return (
    <div className="max-w-lg mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Edit Member</h1>
        <p className="text-[#8888a0] mt-1 text-sm">Update member details</p>
      </div>

      <div className="glass-card p-6">
        <EditMemberForm member={member} families={formattedFamilies} />
      </div>
    </div>
  );
}
