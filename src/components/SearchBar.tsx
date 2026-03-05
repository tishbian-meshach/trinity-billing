'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search) {
        router.push(`/members?search=${encodeURIComponent(search)}`);
      } else {
        router.push('/members');
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, router]);

  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888a0]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or mobile..."
        className="!pl-11"
        id="member-search"
      />
    </div>
  );
}
