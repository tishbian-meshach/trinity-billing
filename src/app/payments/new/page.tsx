'use client';

import { createPayment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import CustomDropdown from '@/components/CustomDropdown';

interface Member {
  id: string;
  name: string;
  mobile: string;
  family: { familyName: string | null };
}

interface BillingYear {
  id: string;
  name: string;
}

const monthOptions = [
  { value: '1', label: 'January - ஜனவரி' },
  { value: '2', label: 'February - பிப்ரவரி' },
  { value: '3', label: 'March - மார்ச்' },
  { value: '4', label: 'April - ஏப்ரல்' },
  { value: '5', label: 'May - மே' },
  { value: '6', label: 'June - ஜூன்' },
  { value: '7', label: 'July - ஜூலை' },
  { value: '8', label: 'August - ஆகஸ்ட்' },
  { value: '9', label: 'September - செப்டம்பர்' },
  { value: '10', label: 'October - அக்டோபர்' },
  { value: '11', label: 'November - நவம்பர்' },
  { value: '12', label: 'December - டிசம்பர்' },
];

export default function NewPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [billingYears, setBillingYears] = useState<BillingYear[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [searchMember, setSearchMember] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBillingYearId, setSelectedBillingYearId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [sendReceipt, setSendReceipt] = useState(true);

  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/members').then((res) => res.json()),
      fetch('/api/billing-years').then((res) => res.json()),
    ])
      .then(([membersData, billingYearsData]) => {
        setMembers(membersData);
        setBillingYears(billingYearsData);
        setLoadingData(false);
      })
      .catch(() => {
        toast.error('Failed to load data');
        setLoadingData(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target as Node)) {
        setMemberDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (memberDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [memberDropdownOpen]);

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      (m.family.familyName && m.family.familyName.toLowerCase().includes(searchMember.toLowerCase()))
  );

  const billingYearOptions = billingYears.map((by) => ({
    value: by.id,
    label: by.name,
  }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!selectedMemberId || !selectedBillingYearId || !selectedMonth || !formData.get('amount')) {
      toast.error('All fields are required');
      return;
    }

    const amount = parseInt(formData.get('amount') as string);
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    formData.set('memberId', selectedMemberId);
    formData.set('billingYearId', selectedBillingYearId);
    formData.set('month', selectedMonth);
    formData.set('sendReceipt', sendReceipt.toString());

    setLoading(true);
    try {
      const result = await createPayment(formData);
      if (result?.success) {
        toast.success(result.message || 'Payment recorded!');
        router.push('/dashboard');
      }
    } catch {
      toast.error('Failed to record payment');
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="max-w-xl mx-auto fade-in">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Record Payment</h1>
          <p className="text-[#8888a0] mt-1 text-sm">Loading data...</p>
        </div>
        <div className="glass-card p-12 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#8888a0]">
            <span className="spinner" />
            <span className="text-sm">Loading members and billing years...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Record Payment</h1>
        <p className="text-[#8888a0] mt-1 text-sm">Record contribution and send WhatsApp receipt</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Selection Card */}
        <div className="glass-card p-5">
          <label className="text-sm font-medium text-[#8888a0] mb-3 block">Select Member *</label>

          {/* Selected member display */}
          {selectedMember && (
            <div className="flex items-center justify-between bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#a29bfe]">{selectedMember.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{selectedMember.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#8888a0]">{selectedMember.mobile}</span>
                    <span className="text-[#2a2a40]">•</span>
                    <span className="text-xs text-[#6c5ce7]">{selectedMember.family.familyName || 'No Family'}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMemberId('');
                  setMemberDropdownOpen(true);
                }}
                className="text-xs text-[#8888a0] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#1f1f35] transition-all"
              >
                Change
              </button>
            </div>
          )}

          {/* Member search & list */}
          {!selectedMember && (
            <div ref={memberDropdownRef} className="relative">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555570]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchMember}
                  onChange={(e) => {
                    setSearchMember(e.target.value);
                    setMemberDropdownOpen(true);
                  }}
                  onFocus={() => setMemberDropdownOpen(true)}
                  placeholder="Search by member name or family name..."
                  className="!pl-11"
                />
              </div>

              {memberDropdownOpen && (
                <div className="mt-2 bg-[#12121a] border border-[#2a2a40] rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    {filteredMembers.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-[#555570]">
                        No members found
                      </div>
                    ) : (
                      filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setMemberDropdownOpen(false);
                            setSearchMember('');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1f1f35] transition-colors border-b border-[#2a2a40]/50 last:border-0"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00b894]/20 to-[#00b894]/10 
                                          flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#00b894]">{member.name[0].toUpperCase()}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{member.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-[#8888a0]">{member.mobile}</span>
                              <span className="text-[#2a2a40]">•</span>
                              <span className="text-xs text-[#6c5ce7] truncate">{member.family.familyName || 'No Family'}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Details Card */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-medium text-white">Payment Details</h3>

          <CustomDropdown
            options={billingYearOptions}
            value={selectedBillingYearId}
            onChange={setSelectedBillingYearId}
            placeholder="Select billing year"
            label="Billing Year"
            required
            name="billingYearId"
            id="billingYearId"
          />

          <CustomDropdown
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="Select month"
            label="Month"
            required
            searchable
            name="month"
            id="month"
          />

          <div>
            <label htmlFor="amount">Amount (₹) *</label>
            <input type="number" id="amount" name="amount" placeholder="Enter amount" min="1" required />
          </div>
        </div>

        {/* WhatsApp Info & Toggle */}
        <div className="bg-[#00b894]/5 border border-[#00b894]/20 rounded-xl p-4 flex gap-4 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-[#00b894]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-sm font-medium text-[#00b894]">Send WhatsApp Receipt</span>
            </div>
            <p className="text-xs text-[#8888a0]">
              Automatically send a Tamil receipt to the member&apos;s WhatsApp after recording.
            </p>
          </div>
          <div className="flex items-center h-full pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={sendReceipt}
              onClick={() => setSendReceipt(!sendReceipt)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none
                ${sendReceipt ? 'bg-[#00b894]' : 'bg-[#2a2a40]'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200
                  ${sendReceipt ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
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
            className="flex-1 bg-[#00b894] hover:bg-[#00d2a0] text-white px-4 py-3 rounded-xl 
                       text-sm font-medium transition-all duration-200 hover:shadow-lg 
                       hover:shadow-[#00b894]/25 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            id="submit-payment-btn"
          >
            {loading ? (
              <>
                <span className="spinner border-t-white" />
                {sendReceipt ? 'Sending Receipt...' : 'Saving...'}
              </>
            ) : (
              sendReceipt ? 'Record Payment & Send Receipt' : 'Record Payment Only'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
