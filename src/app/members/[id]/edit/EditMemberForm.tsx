'use client';

import { updateMember } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CustomDropdown from '@/components/CustomDropdown';

interface Family {
  id: string;
  familyName: string | null;
}

interface Member {
  id: string;
  name: string;
  mobile: string;
  address: string;
  familyId: string;
}

interface Props {
  member: Member;
  families: Family[];
}

export default function EditMemberForm({ member, families }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(member.familyId);

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;

    if (!name || !mobile || !address || !selectedFamilyId) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await updateMember(member.id, {
        name,
        mobile,
        address,
        familyId: selectedFamilyId,
      });
      toast.success('Member updated successfully!');
      router.push('/members');
    } catch {
      toast.error('Failed to update member');
    } finally {
      setLoading(false);
    }
  }

  const familyOptions = families.map((f) => ({
    value: f.id,
    label: f.familyName || 'Unnamed Family',
  }));

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name">Member Name *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          defaultValue={member.name}
          placeholder="Enter full name" 
          required 
        />
      </div>

      <div>
        <label htmlFor="address">Address *</label>
        <textarea
          id="address"
          name="address"
          defaultValue={member.address}
          placeholder="Enter address"
          rows={3}
          required
          className="resize-none"
        />
      </div>

      <div>
        <label htmlFor="mobile">Mobile Number *</label>
        <input 
          type="tel" 
          id="mobile" 
          name="mobile" 
          defaultValue={member.mobile}
          placeholder="e.g., 9876543210" 
          required 
        />
      </div>

      <div>
        <CustomDropdown
          options={familyOptions}
          value={selectedFamilyId}
          onChange={setSelectedFamilyId}
          placeholder="Select a family"
          label="Family"
          required
          searchable
          id="familyId"
          name="familyId"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-3 rounded-xl border border-[#2a2a40] text-[#8888a0] 
                     hover:text-white hover:border-[#555570] transition-all text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#6c5ce7] hover:bg-[#7c6ef7] text-white px-4 py-3 rounded-xl 
                     text-sm font-medium transition-all duration-200 hover:shadow-lg 
                     hover:shadow-[#6c5ce7]/25 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading && <span className="spinner" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
