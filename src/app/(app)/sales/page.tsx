import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { Users, Target, CheckCircle2 } from 'lucide-react';
import { NoClientState } from '../../../components/ui/NoClientState';

export default function SalesPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();

  if (!activeCompany) return <NoClientState />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Sales Pipeline</h1>
          <p className="text-sm font-medium text-slate-500">Revenue Generation Performance &bull; {activeCompany.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Leads</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">142</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Win Rate</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">28%</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deals Closed</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">40</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 text-orange-600">
                <span className="font-bold text-sm">CAC</span>
             </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cust Acq Cost</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">$450</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden">
        <h3 className="text-lg font-black text-slate-900 mb-8">Pipeline Stages</h3>
        
        <div className="space-y-6">
           <div className="relative pt-1">
             <div className="flex mb-2 items-center justify-between">
               <div>
                 <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                   Discovery
                 </span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-black text-slate-900">
                   $450,000
                 </span>
               </div>
             </div>
             <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
               <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
             </div>
           </div>

           <div className="relative pt-1">
             <div className="flex mb-2 items-center justify-between">
               <div>
                 <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100">
                   Proposal
                 </span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-black text-slate-900">
                   $280,000
                 </span>
               </div>
             </div>
             <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
               <div style={{ width: "62%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
             </div>
           </div>

           <div className="relative pt-1">
             <div className="flex mb-2 items-center justify-between">
               <div>
                 <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-100">
                   Negotiation
                 </span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-black text-slate-900">
                   $120,000
                 </span>
               </div>
             </div>
             <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
               <div style={{ width: "26%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
             </div>
           </div>

           <div className="relative pt-1">
             <div className="flex mb-2 items-center justify-between">
               <div>
                 <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-100">
                   Closed Won
                 </span>
               </div>
               <div className="text-right">
                 <span className="text-sm font-black text-slate-900">
                   $85,000
                 </span>
               </div>
             </div>
             <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
               <div style={{ width: "18%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
