'use client';

import { createFamily } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewFamilyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    try {
      await createFamily(formData);
      toast.success('Family created successfully!');
      router.push('/families');
    } catch {
      toast.error('Failed to create family');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Create Family</h1>
        <p className="text-[#8888a0] mt-1 text-sm">Add a new family to the system</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="familyName">Family Name</label>
            <input
              type="text"
              id="familyName"
              name="familyName"
              placeholder="Enter family name (optional)"
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
              id="submit-family-btn"
            >
              {loading && <span className="spinner" />}
              {loading ? 'Creating...' : 'Create Family'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
