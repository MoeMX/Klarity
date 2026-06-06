import React, { useMemo } from 'react';
import { FileSpreadsheet } from 'lucide-react';

interface AmortizationScheduleProps {
  principal: number;
  interestRate: number;
  termYears: number;
}

export function AmortizationSchedule({ principal, interestRate, termYears }: AmortizationScheduleProps) {
  const schedule = useMemo(() => {
    const numberOfPayments = termYears * 12;
    const monthlyRate = interestRate / 100 / 12;
    
    // Handle edge case of 0% interest
    const monthlyPayment = monthlyRate > 0 
      ? principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : principal / numberOfPayments;

    let balance = principal;
    const payments = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      
      // Ensure the last payment clears the balance completely
      if (month === numberOfPayments) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;

      payments.push({
        month,
        payment: principalPayment + interestPayment,
        principalPayment,
        interestPayment,
        balance: Math.max(0, balance)
      });
    }

    return payments;
  }, [principal, interestRate, termYears]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-20 relative">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Amortization Schedule</h2>
         </div>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto w-full relative">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 font-bold z-10 shadow-sm border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Month</th>
              <th className="px-6 py-4 text-right">Payment</th>
              <th className="px-6 py-4 text-right">Principal</th>
              <th className="px-6 py-4 text-right">Interest</th>
              <th className="px-6 py-4 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {schedule.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{row.month}</td>
                <td className="px-6 py-4 text-right text-slate-600 font-medium">${row.payment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-right text-emerald-600 font-medium">${row.principalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-right text-rose-500 font-medium">${row.interestPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-right text-slate-900 font-bold">${row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
