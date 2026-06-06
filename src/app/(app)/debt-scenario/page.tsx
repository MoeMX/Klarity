import { useState } from 'react';
import { DollarSign, Percent, Calendar, AlignVerticalSpaceAround, FileText } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { NoClientState } from '../../../components/ui/NoClientState';
import { AmortizationSchedule } from '../../../components/dashboard/AmortizationSchedule';

export default function DebtScenarioPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();
  
  if (!activeCompany) return <NoClientState />;
  
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(5);

  const numberOfPayments = loanTermYears * 12;
  const monthlyInterestRate = interestRate / 100 / 12;
  
  // standard amortization formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]
  const monthlyPayment = 
    monthlyInterestRate > 0 
      ? loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments;

  const totalPaid = monthlyPayment * numberOfPayments;
  const totalInterest = totalPaid - loanAmount;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
         <div className="flex flex-col">
           <h1 className="text-3xl font-black text-slate-900 mb-1">Debt Restructuring & Loan Calculator</h1>
           <p className="text-sm font-medium text-slate-500">Model capital injection and debt schedules &bull; {activeCompany.name}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <AlignVerticalSpaceAround className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-bold text-slate-900">Loan Parameters</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Principal Loan Amount</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number" 
                       value={loanAmount} 
                       onChange={(e) => setLoanAmount(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Annual Interest Rate (%)</label>
                  <div className="relative">
                     <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number"
                       step="0.1" 
                       value={interestRate} 
                       onChange={(e) => setInterestRate(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Loan Term (Years)</label>
                  <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number" 
                       value={loanTermYears} 
                       onChange={(e) => setLoanTermYears(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                     />
                  </div>
               </div>
             </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg">
             <h3 className="text-lg font-bold mb-6 text-slate-200 flex items-center gap-2">
               <FileText className="w-5 h-5 text-emerald-400" />
               Amortization Summary
             </h3>

             <div className="space-y-6">
               <div>
                 <span className="block text-sm text-slate-400 mb-1">Est. Monthly Payment</span>
                 <span className="text-3xl font-black text-white">${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               
               <div className="space-y-3 pt-4 border-t border-slate-800">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Total Payments ({numberOfPayments})</span>
                   <span className="font-medium">${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Total Principal</span>
                   <span className="font-medium">${loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Total Interest</span>
                   <span className="font-medium text-rose-300">
                     ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                   </span>
                 </div>
               </div>

               <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    This model assumes a fixed interest rate and equal monthly payments. For variable rate loans or custom balloon payments, use the advanced restructuring module.
                  </p>
               </div>
             </div>
          </div>
        </div>
      </div>

      <AmortizationSchedule 
        principal={loanAmount} 
        interestRate={interestRate} 
        termYears={loanTermYears} 
      />
    </div>
  );
}
