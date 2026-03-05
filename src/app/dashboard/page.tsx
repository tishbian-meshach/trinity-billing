import { getDashboardStats } from '@/lib/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="max-w-6xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-[#8888a0] mt-1 text-sm">Overview of church billing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        {/* Total Families */}
        <div className="glass-card p-6 hover:border-[#6c5ce7]/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalFamilies}</p>
          <p className="text-sm text-[#8888a0] mt-1">Total Families</p>
        </div>

        {/* Total Members */}
        <div className="glass-card p-6 hover:border-[#00b894]/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00b894]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-[#00b894]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalMembers}</p>
          <p className="text-sm text-[#8888a0] mt-1">Total Members</p>
        </div>

        {/* Total Collections */}
        <div className="glass-card p-6 hover:border-[#f39c12]/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#f39c12]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">₹{stats.totalCollections.toLocaleString()}</p>
          <p className="text-sm text-[#8888a0] mt-1">Total Collections</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link
          href="/payments/new"
          className="glass-card p-4 text-center hover:border-[#6c5ce7]/40 transition-all duration-200 group"
          id="quick-record-payment"
        >
          <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/15 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-[#6c5ce7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#8888a0] group-hover:text-white transition-colors">Record Payment</p>
        </Link>
        <Link
          href="/members/new"
          className="glass-card p-4 text-center hover:border-[#00b894]/40 transition-all duration-200 group"
          id="quick-add-member"
        >
          <div className="w-8 h-8 rounded-lg bg-[#00b894]/15 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-[#00b894]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#8888a0] group-hover:text-white transition-colors">Add Member</p>
        </Link>
        <Link
          href="/families/new"
          className="glass-card p-4 text-center hover:border-[#f39c12]/40 transition-all duration-200 group"
          id="quick-add-family"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f39c12]/15 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#8888a0] group-hover:text-white transition-colors">Add Family</p>
        </Link>
        <Link
          href="/billing-years/new"
          className="glass-card p-4 text-center hover:border-[#e74c3c]/40 transition-all duration-200 group"
          id="quick-add-billing-year"
        >
          <div className="w-8 h-8 rounded-lg bg-[#e74c3c]/15 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-4 h-4 text-[#e74c3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#8888a0] group-hover:text-white transition-colors">Billing Year</p>
        </Link>
      </div>

      {/* Recent Payments */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Payments</h2>
        {stats.recentPayments.length === 0 ? (
          <p className="text-[#8888a0] text-sm text-center py-8">No payments recorded yet</p>
        ) : (
          <div className="space-y-3">
            {stats.recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#12121a]/50 
                           hover:bg-[#1f1f35]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/15 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#6c5ce7]">₹</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{payment.member.name}</p>
                    <p className="text-xs text-[#8888a0]">{payment.billingYear.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#00b894]">₹{payment.amount}</p>
                  <p className="text-xs text-[#8888a0]">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
