'use client';

import { updateMember, deleteMember } from '@/lib/actions';
import DeleteButton from '@/components/DeleteButton';
import InlineEdit from '@/components/InlineEdit';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  address: string;
  mobile: string;
  family: { familyName: string | null };
}

export default function MemberList({ members }: { members: Member[] }) {
  return (
    <div className="space-y-3 stagger-children">
      {members.map((member) => (
        <div key={member.id} className="glass-card p-5 hover:border-[#6c5ce7]/30 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b894]/20 to-[#00b894]/10 
                              flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#00b894]">
                  {member.name[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <InlineEdit
                  value={member.name}
                  onSave={async (newName) => {
                    await updateMember(member.id, { name: newName });
                  }}
                  className="font-medium text-white"
                />
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs text-[#8888a0]">{member.mobile}</p>
                  <span className="text-[#2a2a40]">•</span>
                  <p className="text-xs text-[#6c5ce7]">{member.family.familyName || 'No Family Name'}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[#8888a0] hidden sm:block">{member.address}</span>
              <div className="flex items-center gap-1">
                <Link
                  href={`/members/${member.id}/edit`}
                  className="p-2 text-[#8888a0] hover:text-[#6c5ce7] rounded-xl hover:bg-[#6c5ce7]/10 transition-colors"
                  title="Edit member"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <DeleteButton id={member.id} action={deleteMember} label="member" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
