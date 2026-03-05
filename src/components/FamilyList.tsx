'use client';

import { updateFamily, deleteFamily } from '@/lib/actions';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import InlineEdit from '@/components/InlineEdit';

interface Family {
  id: string;
  familyName: string | null;
  _count: { members: number };
}

export default function FamilyList({ families }: { families: Family[] }) {
  return (
    <>
      {families.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#6c5ce7]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#6c5ce7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-[#8888a0] mb-4">No families registered yet</p>
          <Link href="/families/new" className="text-[#6c5ce7] hover:text-[#a29bfe] text-sm font-medium transition-colors">
            Create your first family →
          </Link>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {families.map((family) => (
            <div key={family.id} className="glass-card p-5 hover:border-[#6c5ce7]/30 transition-all duration-200 group/card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link href={`/families/${family.id}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c5ce7]/20 to-[#a29bfe]/20 
                                    flex items-center justify-center group-hover/card:scale-105 transition-transform flex-shrink-0">
                      <span className="text-sm font-bold text-[#a29bfe]">
                        {(family.familyName || 'F')[0].toUpperCase()}
                      </span>
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <InlineEdit
                      value={family.familyName || 'Unnamed Family'}
                      onSave={async (newName) => {
                        await updateFamily(family.id, newName);
                      }}
                      className="font-medium text-white"
                    />
                    <p className="text-xs text-[#8888a0] mt-0.5">
                      {family._count.members} member{family._count.members !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/families/${family.id}`}
                    className="text-xs text-[#8888a0] hover:text-white px-3 py-1.5 rounded-lg 
                               hover:bg-[#1f1f35] transition-all"
                  >
                    View →
                  </Link>
                  <DeleteButton id={family.id} action={deleteFamily} label="family" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
