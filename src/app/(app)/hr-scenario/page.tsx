import { useState } from 'react';
import { Users, Calculator, DollarSign, Plus, Settings2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { NoClientState } from '../../../components/ui/NoClientState';

export default function HRScenarioPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();

  if (!activeCompany) return <NoClientState />;
  
  const [baseSalary, setBaseSalary] = useState(80000);
  const [payrollTaxRate, setPayrollTaxRate] = useState(7.65);
  const [benefitsCost, setBenefitsCost] = useState(12000);
  const [otherCosts, setOtherCosts] = useState(3000); // Equipment, training, software
  const [expectedRevenue, setExpectedRevenue] = useState(150000); // Expected annual revenue from this employee

  const payrollTaxAmount = baseSalary * (payrollTaxRate / 100);
  const totalCost = baseSalary + payrollTaxAmount + benefitsCost + otherCosts;
  const netImpact = expectedRevenue - totalCost;
  const roi = totalCost > 0 ? ((netImpact / totalCost) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
         <div className="flex flex-col">
           <h1 className="text-3xl font-black text-slate-900 mb-1">HR Scenario Builder</h1>
           <p className="text-sm font-medium text-slate-500">Calculate fully loaded employee costs &bull; {activeCompany.name}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Calculator className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-bold text-slate-900">New Hire Assumptions</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Annual Base Salary</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number" 
                       value={baseSalary} 
                       onChange={(e) => setBaseSalary(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Payroll Tax Rate (%)</label>
                  <div className="relative">
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">%</span>
                     <input 
                       type="number"
                       step="0.1" 
                       value={payrollTaxRate} 
                       onChange={(e) => setPayrollTaxRate(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-4 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Annual Benefits Cost</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number" 
                       value={benefitsCost} 
                       onChange={(e) => setBenefitsCost(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                     />
                  </div>
                  <p className="text-[10px] text-slate-500">e.g. Health insurance, 401k match</p>
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Other Onboarding Costs</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number" 
                       value={otherCosts} 
                       onChange={(e) => setOtherCosts(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                     />
                  </div>
                  <p className="text-[10px] text-slate-500">e.g. Equipment, training, software licenses</p>
               </div>
               <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100">
                  <label className="text-sm font-bold text-slate-700">Expected Annual Revenue Impact</label>
                  <div className="relative">
                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="number" 
                       value={expectedRevenue} 
                       onChange={(e) => setExpectedRevenue(Number(e.target.value))} 
                       className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                     />
                  </div>
                  <p className="text-[10px] text-slate-500">Optional: Expected top-line revenue generated or saved by this role</p>
               </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mt-6">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <DollarSign className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-bold text-slate-900">Cash Flow Impact Analysis</h2>
             </div>
             
             <p className="text-sm text-slate-500 mb-6 font-medium">Assesses impact against the current estimated monthly burn rate of <strong className="text-slate-700">$18,500</strong> and cash reserves of <strong className="text-slate-700">$153,000</strong>.</p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Baseline Monthly Burn</span>
                    <span className="text-3xl font-black text-slate-900">$18,500</span>
                    <span className="text-sm font-semibold text-slate-500 mt-2">Runway: {(153000 / 18500).toFixed(1)} Months</span>
                 </div>
                 <div className={`p-5 rounded-2xl border flex flex-col justify-center ${(18500 - (expectedRevenue/12 - totalCost/12)) < 18500 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${(18500 - (expectedRevenue/12 - totalCost/12)) < 18500 ? 'text-emerald-600' : 'text-rose-600'}`}>New Projected Burn</span>
                    <span className={`text-3xl font-black ${(18500 - (expectedRevenue/12 - totalCost/12)) < 18500 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      ${(18500 - (expectedRevenue/12 - totalCost/12)) <= 0 ? '0' : (18500 - (expectedRevenue/12 - totalCost/12)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className={`text-sm font-bold mt-2 ${(18500 - (expectedRevenue/12 - totalCost/12)) <= 0 ? 'text-emerald-600' : ((18500 - (expectedRevenue/12 - totalCost/12)) < 18500 ? 'text-emerald-600' : 'text-rose-600')}`}>
                      Runway: {(18500 - (expectedRevenue/12 - totalCost/12)) <= 0 ? 'Profitable (Infinite)' : (153000 / (18500 - (expectedRevenue/12 - totalCost/12))).toFixed(1) + ' Months'}
                    </span>
                 </div>
             </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg">
             <h3 className="text-lg font-bold mb-6 text-slate-200 flex items-center gap-2">
               <Users className="w-5 h-5 text-indigo-400" />
               Impact Summary
             </h3>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Base Salary</span>
                 <span className="font-medium">${baseSalary.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Payroll Taxes</span>
                 <span className="font-medium">${payrollTaxAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Benefits & Perks</span>
                 <span className="font-medium">${benefitsCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-800">
                 <span className="text-slate-400">Other Costs</span>
                 <span className="font-medium">${otherCosts.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
               </div>

               <div className="flex justify-between items-center pt-2">
                 <span className="font-bold text-slate-200">Fully Loaded Cost</span>
                 <span className="text-xl font-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm mt-1">
                 <span className="text-slate-400">Multiplier vs Base</span>
                 <span className="font-medium text-indigo-300">{((totalCost / baseSalary) || 0).toFixed(2)}x</span>
               </div>
               
               <div className={`mt-6 p-4 rounded-xl ${netImpact >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                 <div className="flex justify-between items-center text-sm mb-1">
                   <span className={netImpact >= 0 ? 'text-emerald-300' : 'text-rose-300'}>Net Annual Impact</span>
                   <span className={`font-bold ${netImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {netImpact >= 0 ? '+' : ''}{netImpact.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                   </span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-400">Est. ROI</span>
                   <span className="font-medium">{roi}%</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
