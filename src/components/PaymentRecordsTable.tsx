'use client';

import { useState } from 'react';
import { updatePayment, deletePayment } from '@/lib/actions';
import { tamilMonths } from '@/lib/tamilMonths';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  month: number;
  amount: number;
  createdAt: Date;
}

interface Member {
  id: string;
  name: string;
  mobile: string;
  payments: Payment[];
}

interface Family {
  id: string;
  familyName: string | null;
  members: Member[];
}

interface Props {
  families: Family[];
  billingYear?: {
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
  } | null;
}

const monthFilters = [
  { value: 0, label: 'All Months' },
  { value: 1, label: 'Jan - ஜனவரி' },
  { value: 2, label: 'Feb - பிப்ரவரி' },
  { value: 3, label: 'Mar - மார்ச்' },
  { value: 4, label: 'Apr - ஏப்ரல்' },
  { value: 5, label: 'May - மே' },
  { value: 6, label: 'Jun - ஜூன்' },
  { value: 7, label: 'Jul - ஜூலை' },
  { value: 8, label: 'Aug - ஆகஸ்ட்' },
  { value: 9, label: 'Sep - செப்டம்பர்' },
  { value: 10, label: 'Oct - அக்டோபர்' },
  { value: 11, label: 'Nov - நவம்பர்' },
  { value: 12, label: 'Dec - டிசம்பர்' },
];

export default function PaymentRecordsTable({ families, billingYear }: Props) {
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [editMonth, setEditMonth] = useState(0);
  const [editAmount, setEditAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [hideNoPayments, setHideNoPayments] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  // Filter logic
  function getFilteredData() {
    return families
      .map((family) => {
        const filteredMembers = family.members
          .map((member) => {
            const filteredPayments =
              selectedMonth === 0
                ? member.payments
                : member.payments.filter((p) => p.month === selectedMonth);
            return { ...member, payments: filteredPayments };
          })
          .filter((member) => {
            if (hideNoPayments) return member.payments.length > 0;
            return true;
          });

        return { ...family, members: filteredMembers };
      })
      .filter((family) => family.members.length > 0);
  }

  const filteredFamilies = getFilteredData();

  let grandTotal = 0;
  let totalMembersShown = 0;
  filteredFamilies.forEach((f) => {
    totalMembersShown += f.members.length;
    f.members.forEach((m) => {
      m.payments.forEach((p) => {
        grandTotal += p.amount;
      });
    });
  });

  async function handleSaveEdit(paymentId: string) {
    if (editAmount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    setLoading(true);
    try {
      await updatePayment(paymentId, { month: editMonth, amount: editAmount });
      toast.success('Payment updated!');
      setEditingPayment(null);
    } catch {
      toast.error('Failed to update payment');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePayment(paymentId: string) {
    setLoading(true);
    try {
      await deletePayment(paymentId);
      toast.success('Payment deleted!');
    } catch {
      toast.error('Failed to delete payment');
    } finally {
      setLoading(false);
    }
  }

  const selectedMonthLabel = monthFilters.find((m) => m.value === selectedMonth)?.label || 'All Months';

  function exportPDF() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to export PDF');
      return;
    }

    // Build filter info text
    const filterParts: string[] = [];
    if (selectedMonth !== 0) {
      filterParts.push(`மாதம்: ${tamilMonths[selectedMonth]}`);
    }
    
    let defaultFilterText = 'அனைத்து மாதங்கள்';
    if (billingYear) {
      defaultFilterText = `${tamilMonths[billingYear.startMonth]} ${billingYear.startYear} - ${tamilMonths[billingYear.endMonth]} ${billingYear.endYear}`;
    }

    const filterText = filterParts.length > 0 ? filterParts.join(' | ') : defaultFilterText;

    // Build table rows
    let tableRows = '';
    let sno = 1;
    filteredFamilies.forEach((family) => {

      // Family header row
      const colspanFamily = selectedMonth !== 0 ? '5' : '4';
      tableRows += `<tr class="family-row">
        <td colspan="${colspanFamily}" style="font-weight:700; background:#f3f0ff; padding:8px 12px; font-size:13px;">
          ${family.familyName || 'Unnamed Family'}
        </td>
      </tr>`;

      family.members.forEach((member) => {
        const memberTotal = member.payments.reduce((a, p) => a + p.amount, 0);
        const paymentsList = member.payments.length > 0
          ? member.payments.map((p) => `${tamilMonths[p.month]}: ₹${p.amount}`).join(', ')
          : '-';

        const paymentsColumn = selectedMonth !== 0 
          ? `<td style="padding:6px 12px; border-bottom:1px solid #e5e5e5; font-size:12px;">${paymentsList}</td>`
          : '';

        tableRows += `<tr>
          <td style="padding:6px 12px; border-bottom:1px solid #e5e5e5; text-align:center; font-size:12px;">${sno++}</td>
          <td style="padding:6px 12px; border-bottom:1px solid #e5e5e5; font-size:12px;">${member.name}</td>
          <td style="padding:6px 12px; border-bottom:1px solid #e5e5e5; font-size:12px;">${member.mobile}</td>
          ${paymentsColumn}
          <td style="padding:6px 12px; border-bottom:1px solid #e5e5e5; text-align:right; font-weight:600; font-size:12px;">₹${memberTotal.toLocaleString()}</td>
        </tr>`;
      });
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Records Export</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222; padding: 0; }
    .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #333; }
    .header h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .header h2 { font-size: 15px; font-weight: 600; color: #555; margin-bottom: 10px; }
    .filter-info { text-align: center; font-size: 12px; color: #666; background: #f8f8f8; padding: 6px 12px; border-radius: 6px; display: inline-block; }
    .summary { display: flex; justify-content: space-between; margin: 15px 0; font-size: 13px; padding: 10px 15px; background: #f3f0ff; border-radius: 8px; }
    .summary span { font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    thead th { background: #333; color: white; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
    thead th:first-child { text-align: center; width: 40px; }
    thead th:last-child { text-align: right; }
    .family-row td { border-top: 2px solid #ddd; }
    tfoot td { background: #333; color: white; padding: 8px 12px; font-weight: 700; font-size: 13px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>தூய திரித்துவ ஆலயம், பண்டாரம்பட்டி</h1>
    <h2>சங்கம் செலுத்திய விபரம்</h2>
    <div class="filter-info">${filterText}</div>
  </div>

  <div class="summary">
    <div>குடும்பங்கள்: <span>${filteredFamilies.length}</span></div>
    <div>உறுப்பினர்கள்: <span>${totalMembersShown}</span></div>
    <div>மொத்த வரவு: <span style="color:#00875a;">₹${grandTotal.toLocaleString()}</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>வ.எண்</th>
        <th>உறுப்பினர்</th>
        <th>தொலைபேசி</th>
        ${selectedMonth !== 0 ? '<th>செலுத்தியவை</th>' : ''}
        <th style="text-align:right;">மொத்தம்</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
    <tfoot>
      <tr>
        <td colspan="${selectedMonth !== 0 ? '4' : '3'}" style="text-align:right; padding-right:12px;">மொத்த வரவு</td>
        <td style="text-align:right;">₹${grandTotal.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  if (families.length === 0 || families.every((f) => f.members.length === 0)) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#f39c12]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[#8888a0] mb-2">No records found for this billing year</p>
        <p className="text-xs text-[#555570]">Add families and members first, then record payments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-[100]">
        {/* Month filter dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
              ${selectedMonth !== 0
                ? 'bg-[#6c5ce7]/15 text-[#a29bfe] border-[#6c5ce7]/30'
                : 'bg-[#12121a] text-[#8888a0] border-[#2a2a40] hover:border-[#555570]'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {selectedMonthLabel}
            <svg className={`w-3.5 h-3.5 transition-transform ${monthDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {monthDropdownOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setMonthDropdownOpen(false)} />
              <div className="absolute z-[70] mt-2 w-52 bg-[#12121a] border border-[#2a2a40] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="max-h-72 overflow-y-auto">
                  {monthFilters.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(m.value);
                        setMonthDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                        ${m.value === selectedMonth
                          ? 'bg-[#6c5ce7]/15 text-[#a29bfe]'
                          : 'text-[#f0f0f5] hover:bg-[#1f1f35]'
                        }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hide no-payments toggle */}
        <button
          type="button"
          onClick={() => setHideNoPayments(!hideNoPayments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
            ${hideNoPayments
              ? 'bg-[#f39c12]/15 text-[#f39c12] border-[#f39c12]/30'
              : 'bg-[#12121a] text-[#8888a0] border-[#2a2a40] hover:border-[#555570]'
            }`}
        >
          <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${hideNoPayments ? 'bg-[#f39c12]' : 'bg-[#2a2a40]'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${hideNoPayments ? 'left-[18px]' : 'left-0.5'}`} />
          </div>
          Hide no-payment members
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Active filters indicator */}
        {(selectedMonth !== 0 || hideNoPayments) && (
          <button
            type="button"
            onClick={() => {
              setSelectedMonth(0);
              setHideNoPayments(false);
            }}
            className="text-xs text-[#8888a0] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#1f1f35] transition-all"
          >
            Clear filters
          </button>
        )}

        {/* Export PDF button */}
        <button
          type="button"
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                     bg-[#e74c3c]/10 text-[#e74c3c] border-[#e74c3c]/30 hover:bg-[#e74c3c]/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Summary bar */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-[#8888a0]">Families</p>
            <p className="text-lg font-bold text-white">{filteredFamilies.length}</p>
          </div>
          <div className="w-px h-8 bg-[#2a2a40]" />
          <div>
            <p className="text-xs text-[#8888a0]">Members</p>
            <p className="text-lg font-bold text-white">{totalMembersShown}</p>
          </div>
          <div className="w-px h-8 bg-[#2a2a40]" />
          <div>
            <p className="text-xs text-[#8888a0]">
              {selectedMonth !== 0 ? `${tamilMonths[selectedMonth]} Collection` : 'Total Collected'}
            </p>
            <p className="text-lg font-bold text-[#00b894]">₹{grandTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* No results after filter */}
      {filteredFamilies.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-[#8888a0] text-sm">No records match your current filters</p>
          <button
            type="button"
            onClick={() => {
              setSelectedMonth(0);
              setHideNoPayments(false);
            }}
            className="text-[#6c5ce7] hover:text-[#a29bfe] text-sm font-medium mt-2 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Family cards with members and payments */}
      {filteredFamilies.map((family) => {
        let familyTotal = 0;
        family.members.forEach((m) => {
          m.payments.forEach((p) => {
            familyTotal += p.amount;
          });
        });

        return (
          <div key={family.id} className="glass-card overflow-hidden">
            {/* Family header */}
            <div className="px-5 py-3 bg-[#6c5ce7]/8 border-b border-[#2a2a40] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#a29bfe]">
                    {(family.familyName || 'F')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">{family.familyName || 'Unnamed Family'}</h3>
                  <p className="text-xs text-[#8888a0]">{family.members.length} member(s)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#00b894]">₹{familyTotal.toLocaleString()}</p>
                <p className="text-xs text-[#8888a0]">Family Total</p>
              </div>
            </div>

            {/* Members table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a40]">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-[#8888a0] uppercase tracking-wider">Member</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-[#8888a0] uppercase tracking-wider">Mobile</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-[#8888a0] uppercase tracking-wider">Payments</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-[#8888a0] uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {family.members.map((member) => {
                    const memberTotal = member.payments.reduce((acc, p) => acc + p.amount, 0);

                    return (
                      <tr key={member.id} className="border-b border-[#2a2a40]/50 hover:bg-[#1f1f35]/30 transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-sm font-medium text-white">{member.name}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-xs text-[#8888a0]">{member.mobile}</p>
                        </td>
                        <td className="px-5 py-3">
                          {member.payments.length === 0 ? (
                            <span className="text-xs text-[#555570] italic">No payments</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {member.payments.map((payment) => (
                                <div key={payment.id} className="relative group/pill">
                                  {editingPayment === payment.id ? (
                                    <div className="flex items-center gap-1.5 bg-[#12121a] border border-[#6c5ce7] rounded-lg px-2 py-1">
                                      <select
                                        value={editMonth}
                                        onChange={(e) => setEditMonth(parseInt(e.target.value))}
                                        className="!w-auto !py-0.5 !px-1 !text-xs !rounded-md !bg-[#0a0a0f] !border-[#2a2a40]"
                                      >
                                        {Object.entries(tamilMonths).map(([k, v]) => (
                                          <option key={k} value={k}>{v}</option>
                                        ))}
                                      </select>
                                      <input
                                        type="number"
                                        value={editAmount}
                                        onChange={(e) => setEditAmount(parseInt(e.target.value) || 0)}
                                        className="!w-16 !py-0.5 !px-1 !text-xs !rounded-md !bg-[#0a0a0f] !border-[#2a2a40]"
                                      />
                                      <button
                                        onClick={() => handleSaveEdit(payment.id)}
                                        disabled={loading}
                                        className="text-[#00b894] hover:text-white text-xs px-1"
                                      >
                                        ✓
                                      </button>
                                      <button
                                        onClick={() => setEditingPayment(null)}
                                        className="text-[#8888a0] hover:text-white text-xs px-1"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1 bg-[#12121a] border border-[#2a2a40] rounded-lg px-2.5 py-1 
                                                    group-hover/pill:border-[#6c5ce7]/40 transition-colors cursor-default">
                                      <span className="text-xs text-[#8888a0]">{tamilMonths[payment.month]}</span>
                                      <span className="text-xs font-medium text-[#00b894]">₹{payment.amount}</span>

                                      <div className="hidden group-hover/pill:flex items-center gap-0.5 ml-1">
                                        <button
                                          onClick={() => {
                                            setEditingPayment(payment.id);
                                            setEditMonth(payment.month);
                                            setEditAmount(payment.amount);
                                          }}
                                          className="text-[#8888a0] hover:text-[#6c5ce7] transition-colors"
                                          title="Edit"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm('Delete this payment?')) {
                                              handleDeletePayment(payment.id);
                                            }
                                          }}
                                          className="text-[#8888a0] hover:text-[#e74c3c] transition-colors"
                                          title="Delete"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`text-sm font-semibold ${memberTotal > 0 ? 'text-[#00b894]' : 'text-[#555570]'}`}>
                            ₹{memberTotal.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
