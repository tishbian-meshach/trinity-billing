'use client';

import { createBillingYear } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CustomDropdown from '@/components/CustomDropdown';

const monthOptions = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function NewBillingYearPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string;
    const startYear = formData.get('startYear') as string;
    const endYear = formData.get('endYear') as string;

    if (!name || !startMonth || !startYear || !endMonth || !endYear) {
      toast.error('All fields are required');
      return;
    }

    formData.set('startMonth', startMonth);
    formData.set('endMonth', endMonth);

    setLoading(true);
    try {
      await createBillingYear(formData);
      toast.success('Billing year created successfully!');
      router.push('/billing-years');
    } catch {
      toast.error('Failed to create billing year');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Create Billing Year</h1>
        <p className="text-[#8888a0] mt-1 text-sm">Set up a new billing period</p>
      </div>

      <div className="glass-card p-6">
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name">Billing Year Name *</label>
            <input type="text" id="name" name="name" placeholder="e.g., 2025-2026" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomDropdown
              options={monthOptions}
              value={startMonth}
              onChange={setStartMonth}
              placeholder="Select month"
              label="Start Month"
              required
              name="startMonth"
              id="startMonth"
            />
            <div>
              <label htmlFor="startYear">Start Year *</label>
              <input type="number" id="startYear" name="startYear" placeholder="e.g., 2025" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomDropdown
              options={monthOptions}
              value={endMonth}
              onChange={setEndMonth}
              placeholder="Select month"
              label="End Month"
              required
              name="endMonth"
              id="endMonth"
            />
            <div>
              <label htmlFor="endYear">End Year *</label>
              <input type="number" id="endYear" name="endYear" placeholder="e.g., 2026" required />
            </div>
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
              id="submit-billing-year-btn"
            >
              {loading && <span className="spinner" />}
              {loading ? 'Creating...' : 'Create Billing Year'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
