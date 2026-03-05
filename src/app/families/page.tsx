import { getFamilies } from '@/lib/actions';
import Link from 'next/link';
import FamilyList from '@/components/FamilyList';

export const dynamic = 'force-dynamic';

export default async function FamiliesPage() {
  const families = await getFamilies();

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Families</h1>
          <p className="text-[#8888a0] mt-1 text-sm">{families.length} families registered</p>
        </div>
        <Link
          href="/families/new"
          className="bg-[#6c5ce7] hover:bg-[#7c6ef7] text-white px-5 py-2.5 rounded-xl text-sm font-medium 
                     transition-all duration-200 hover:shadow-lg hover:shadow-[#6c5ce7]/25"
          id="add-family-btn"
        >
          + Add Family
        </Link>
      </div>

      <FamilyList families={families} />
    </div>
  );
}
