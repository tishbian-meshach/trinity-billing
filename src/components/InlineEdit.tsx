'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export default function InlineEdit({ value, onSave, placeholder = 'Enter value', className = '' }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (editValue.trim() === value) {
      setEditing(false);
      return;
    }

    setLoading(true);
    try {
      await onSave(editValue.trim());
      toast.success('Updated successfully!');
      setEditing(false);
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(value);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className="!py-1.5 !px-3 !text-sm !rounded-lg max-w-[200px]"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-xs text-[#00b894] hover:text-white bg-[#00b894]/10 hover:bg-[#00b894] 
                     px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 font-medium"
        >
          {loading ? '...' : 'Save'}
        </button>
        <button
          onClick={() => {
            setEditValue(value);
            setEditing(false);
          }}
          className="text-xs text-[#8888a0] hover:text-white px-2.5 py-1.5 rounded-lg 
                     hover:bg-[#1f1f35] transition-all"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <span>{value || placeholder}</span>
      <button
        onClick={() => setEditing(true)}
        className="opacity-0 group-hover:opacity-100 text-[#8888a0] hover:text-[#6c5ce7] transition-all"
        title="Edit"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>
  );
}
