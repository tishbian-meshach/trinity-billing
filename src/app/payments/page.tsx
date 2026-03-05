import { getBillingYears, getPaymentsByBillingYear } from '@/lib/actions';
import Link from 'next/link';
import PaymentRecordsTable from '@/components/PaymentRecordsTable';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: { billingYearId?: string };
}) {
  const billingYears = await getBillingYears();
  const selectedBillingYearId = searchParams.billingYearId || (billingYears.length > 0 ? billingYears[0].id : '');
  const selectedBillingYear = billingYears.find((by) => by.id === selectedBillingYearId);

  const families = selectedBillingYearId 
    ? await getPaymentsByBillingYear(selectedBillingYearId) 
    : [];

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Payment Records</h1>
          <p className="text-[#8888a0] mt-1 text-sm">
            {selectedBillingYear ? `Billing Year: ${selectedBillingYear.name}` : 'Select a billing year'}
          </p>
        </div>
        <Link
          href="/payments/new"
          className="bg-[#00b894] hover:bg-[#00d2a0] text-white px-5 py-2.5 rounded-xl text-sm font-medium 
                     transition-all duration-200 hover:shadow-lg hover:shadow-[#00b894]/25"
          id="record-payment-btn"
        >
          + Record Payment
        </Link>
      </div>

      {/* Billing Year Selector */}
      {billingYears.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {billingYears.map((by) => (
            <Link
              key={by.id}
              href={`/payments?billingYearId=${by.id}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                ${
                  by.id === selectedBillingYearId
                    ? 'bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/25'
                    : 'bg-[#1a1a2e] text-[#8888a0] hover:text-white hover:bg-[#1f1f35] border border-[#2a2a40]'
                }`}
            >
              {by.name}
            </Link>
          ))}
        </div>
      )}

      {billingYears.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-[#8888a0] mb-4">No billing years created yet</p>
          <Link href="/billing-years/new" className="text-[#6c5ce7] hover:text-[#a29bfe] text-sm font-medium transition-colors">
            Create a billing year first →
          </Link>
        </div>
      ) : (
        <PaymentRecordsTable 
          families={families} 
          billingYear={selectedBillingYear}
        />
      )}
    </div>
  );
}
