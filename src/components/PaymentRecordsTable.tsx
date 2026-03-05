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
  billingYearId: string;
}

export default function PaymentRecordsTable({ families, billingYearId }: Props) {
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [editMonth, setEditMonth] = useState(0);
  const [editAmount, setEditAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const familiesWithPayments = families.filter(
    (f) => f.members.some((m) => m.payments.length > 0) || f.members.length > 0
  );

  let grandTotal = 0;
  familiesWithPayments.forEach((f) => {
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

  if (familiesWithPayments.length === 0) {
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
      {/* Summary bar */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-[#8888a0]">Total Families</p>
            <p className="text-lg font-bold text-white">{familiesWithPayments.length}</p>
          </div>
          <div className="w-px h-8 bg-[#2a2a40]" />
          <div>
            <p className="text-xs text-[#8888a0]">Total Members</p>
            <p className="text-lg font-bold text-white">
              {familiesWithPayments.reduce((acc, f) => acc + f.members.length, 0)}
            </p>
          </div>
          <div className="w-px h-8 bg-[#2a2a40]" />
          <div>
            <p className="text-xs text-[#8888a0]">Total Collected</p>
            <p className="text-lg font-bold text-[#00b894]">₹{grandTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Family cards with members and payments */}
      {familiesWithPayments.map((family) => {
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
                            <span className="text-xs text-[#555570]">No payments</span>
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

                                      {/* Edit/Delete buttons on hover */}
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
