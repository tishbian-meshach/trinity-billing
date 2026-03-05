'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  label: string;
}

export default function DeleteButton({ id, action, label }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await action(id);
      toast.success(`${label} deleted successfully`);
    } catch {
      toast.error(`Failed to delete ${label}`);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-[#e74c3c] hover:text-white bg-[#e74c3c]/10 hover:bg-[#e74c3c] 
                     px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 font-medium"
        >
          {loading ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-[#8888a0] hover:text-white px-2.5 py-1.5 rounded-lg 
                     hover:bg-[#1f1f35] transition-all"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-[#8888a0] hover:text-[#e74c3c] px-2 py-1.5 rounded-lg 
                 hover:bg-[#e74c3c]/10 transition-all"
      title={`Delete ${label}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
