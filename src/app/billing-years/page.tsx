import { getBillingYears, deleteBillingYear } from '@/lib/actions';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function BillingYearsPage() {
  const billingYears = await getBillingYears();

  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Billing Years</h1>
          <p className="text-[#8888a0] mt-1 text-sm">{billingYears.length} billing year(s)</p>
        </div>
        <Link
          href="/billing-years/new"
          className="bg-[#6c5ce7] hover:bg-[#7c6ef7] text-white px-5 py-2.5 rounded-xl text-sm font-medium 
                     transition-all duration-200 hover:shadow-lg hover:shadow-[#6c5ce7]/25"
          id="add-billing-year-btn"
        >
          + Add Billing Year
        </Link>
      </div>

      {billingYears.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f39c12]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#8888a0] mb-4">No billing years created yet</p>
          <Link href="/billing-years/new" className="text-[#6c5ce7] hover:text-[#a29bfe] text-sm font-medium transition-colors">
            Create your first billing year →
          </Link>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {billingYears.map((by) => (
            <div key={by.id} className="glass-card p-5 hover:border-[#6c5ce7]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f39c12]/20 to-[#f39c12]/10 
                                  flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">{by.name}</p>
                    <p className="text-xs text-[#8888a0]">
                      {monthNames[by.startMonth]} {by.startYear} → {monthNames[by.endMonth]} {by.endYear}
                    </p>
                  </div>
                </div>
                <DeleteButton id={by.id} action={deleteBillingYear} label="billing year" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
