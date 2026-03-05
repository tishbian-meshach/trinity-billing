'use client';

import { updateMember, updateFamily } from '@/lib/actions';
import InlineEdit from '@/components/InlineEdit';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  address: string;
  mobile: string;
  createdAt: Date;
}

interface Family {
  id: string;
  familyName: string | null;
  members: Member[];
}

export default function FamilyDetail({ family }: { family: Family }) {
  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/families" className="text-[#8888a0] hover:text-white text-sm transition-colors">
              Families
            </Link>
            <span className="text-[#555570]">/</span>
          </div>
          <InlineEdit
            value={family.familyName || 'Unnamed Family'}
            onSave={async (newName) => {
              await updateFamily(family.id, newName);
            }}
            className="text-2xl md:text-3xl font-bold text-white"
          />
          <p className="text-[#8888a0] mt-1 text-sm">{family.members.length} member(s)</p>
        </div>
        <Link
          href={`/members/new?familyId=${family.id}`}
          className="bg-[#6c5ce7] hover:bg-[#7c6ef7] text-white px-5 py-2.5 rounded-xl text-sm font-medium 
                     transition-all duration-200 hover:shadow-lg hover:shadow-[#6c5ce7]/25"
          id="add-member-to-family-btn"
        >
          + Add Member
        </Link>
      </div>

      {family.members.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-[#8888a0] mb-4">No members in this family yet</p>
          <Link
            href={`/members/new?familyId=${family.id}`}
            className="text-[#6c5ce7] hover:text-[#a29bfe] text-sm font-medium transition-colors"
          >
            Add the first member →
          </Link>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {family.members.map((member) => (
            <div key={member.id} className="glass-card p-5 hover:border-[#6c5ce7]/30 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b894]/20 to-[#00b894]/10 
                                flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#00b894]">
                    {member.name[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <InlineEdit
                    value={member.name}
                    onSave={async (newName) => {
                      await updateMember(member.id, { name: newName });
                    }}
                    className="font-medium text-white"
                  />
                  <p className="text-xs text-[#8888a0] mt-0.5">{member.mobile}</p>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-4">
                  <p className="text-xs text-[#8888a0]">{member.address}</p>
                  <Link
                    href={`/members/${member.id}/edit`}
                    className="p-2 text-[#8888a0] hover:text-[#6c5ce7] rounded-xl hover:bg-[#6c5ce7]/10 transition-colors"
                    title="Edit member"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
