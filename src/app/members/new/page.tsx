'use client';

import { createMember } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import toast from 'react-hot-toast';
import CustomDropdown from '@/components/CustomDropdown';

interface Family {
  id: string;
  familyName: string | null;
}

export default function NewMemberPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto fade-in">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Add Member</h1>
          <p className="text-[#8888a0] mt-1 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <NewMemberForm />
    </Suspense>
  );
}

function NewMemberForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFamilyId = searchParams.get('familyId') || '';

  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(true);
  const [selectedFamilyId, setSelectedFamilyId] = useState(preselectedFamilyId);

  useEffect(() => {
    fetch('/api/families')
      .then((res) => res.json())
      .then((data) => {
        setFamilies(data);
        setLoadingFamilies(false);
      })
      .catch(() => {
        toast.error('Failed to load families');
        setLoadingFamilies(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const mobile = formData.get('mobile') as string;
    const address = formData.get('address') as string;

    if (!name || !mobile || !address || !selectedFamilyId) {
      toast.error('All fields are required');
      return;
    }

    formData.set('familyId', selectedFamilyId);

    setLoading(true);
    try {
      await createMember(formData);
      toast.success('Member added successfully!');
      // Reset form but keep the selected family for convenience
      form.reset();
      // Restore the default address value since form.reset clears it
      const addressField = form.querySelector('#address') as HTMLTextAreaElement;
      if (addressField) addressField.value = 'பண்டாரம்பட்டி';
    } catch {
      toast.error('Failed to add member');
    } finally {
      setLoading(false);
    }
  }

  const familyOptions = families.map((f) => ({
    value: f.id,
    label: f.familyName || 'Unnamed Family',
  }));

  return (
    <div className="max-w-lg mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Add Member</h1>
        <p className="text-[#8888a0] mt-1 text-sm">Register a new church member</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {loadingFamilies ? (
              <div className="flex items-center gap-2 py-3 text-sm text-[#8888a0]">
                <span className="spinner" /> Loading families...
              </div>
            ) : (
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
            )}
          </div>
          <div>
            <label htmlFor="name">Member Name *</label>
            <input type="text" id="name" name="name" placeholder="Enter full name" required />
          </div>

          <div>
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter address"
              rows={3}
              required
              className="resize-none"
              defaultValue="பண்டாரம்பட்டி"
            />
          </div>

          <div>
            <label htmlFor="mobile">Mobile Number *</label>
            <input type="tel" id="mobile" name="mobile" placeholder="e.g., 9876543210" required />
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
              id="submit-member-btn"
            >
              {loading && <span className="spinner" />}
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
