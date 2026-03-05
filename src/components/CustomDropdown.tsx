'use client';

import { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  searchable?: boolean;
  id?: string;
  name?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  required,
  searchable = false,
  id,
  name,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = searchable && search
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          (o.sublabel && o.sublabel.toLowerCase().includes(search.toLowerCase()))
      )
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-[#8888a0] mb-1.5 block">
          {label} {required && '*'}
        </label>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {/* Trigger button */}
      <button
        type="button"
        id={id}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className={`w-full flex items-center justify-between bg-[#12121a] border rounded-xl px-4 py-3 
                    text-left transition-all duration-200 
                    ${isOpen ? 'border-[#6c5ce7] ring-1 ring-[#6c5ce7]' : 'border-[#2a2a40] hover:border-[#555570]'}
                    ${selectedOption ? 'text-[#f0f0f5]' : 'text-[#8888a0]'}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#8888a0] transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-[#12121a] border border-[#2a2a40] rounded-xl shadow-2xl 
                        shadow-black/40 overflow-hidden animate-dropdown">
          {/* Search field */}
          {searchable && (
            <div className="p-2 border-b border-[#2a2a40]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555570]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="!pl-9 !py-2 !text-sm !rounded-lg !border-[#2a2a40] !bg-[#0a0a0f]"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-[#555570]">
                No options found
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
                    ${
                      option.value === value
                        ? 'bg-[#6c5ce7]/15 text-[#a29bfe]'
                        : 'text-[#f0f0f5] hover:bg-[#1f1f35]'
                    }`}
                >
                  <span className="block truncate">{option.label}</span>
                  {option.sublabel && (
                    <span className="block text-xs text-[#555570] mt-0.5 truncate">{option.sublabel}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropdown-enter {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown-enter 0.15s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a40;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
