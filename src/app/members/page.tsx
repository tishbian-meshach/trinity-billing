import { getMembers } from '@/lib/actions';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import MemberList from '@/components/MemberList';

export const dynamic = 'force-dynamic';

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const members = await getMembers(searchParams.search);

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Members</h1>
          <p className="text-[#8888a0] mt-1 text-sm">{members.length} members registered</p>
        </div>
        <Link
          href="/members/new"
          className="bg-[#6c5ce7] hover:bg-[#7c6ef7] text-white px-5 py-2.5 rounded-xl text-sm font-medium 
                     transition-all duration-200 hover:shadow-lg hover:shadow-[#6c5ce7]/25"
          id="add-member-btn"
        >
          + Add Member
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar defaultValue={searchParams.search} />
      </div>

      {members.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00b894]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#00b894]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-[#8888a0] mb-4">
            {searchParams.search ? 'No members found matching your search' : 'No members registered yet'}
          </p>
          {!searchParams.search && (
            <Link href="/members/new" className="text-[#6c5ce7] hover:text-[#a29bfe] text-sm font-medium transition-colors">
              Add your first member →
            </Link>
          )}
        </div>
      ) : (
        <MemberList members={members} />
      )}
    </div>
  );
}
