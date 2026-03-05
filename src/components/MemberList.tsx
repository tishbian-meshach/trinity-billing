'use client';

import { updateMember, deleteMember } from '@/lib/actions';
import DeleteButton from '@/components/DeleteButton';
import InlineEdit from '@/components/InlineEdit';

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
              <DeleteButton id={member.id} action={deleteMember} label="member" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
