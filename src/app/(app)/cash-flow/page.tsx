import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { WalletCards, FileMinus, FilePlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NoClientState } from '../../../components/ui/NoClientState';

export default function CashFlowPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();

  if (!activeCompany) return <NoClientState />;

  const cashWaterfallData = [
    { name: 'Starting Cash', value: 150, type: 'start' },
    { name: 'Operations', value: 45, type: 'in' },
    { name: 'Financing', value: -12, type: 'out' },
    { name: 'Investing', value: -30, type: 'out' },
    { name: 'Ending Cash', value: 153, type: 'end' },
  ];

  const getColor = (type: string) => {
    if (type === 'start' || type === 'end') return '#0F172A'; // slate-900
    if (type === 'in') return '#10B981'; // emerald-500
    return '#F43F5E'; // rose-500
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Cash Flow Monitor</h1>
          <p className="text-sm font-medium text-slate-500">Liquidity & Runway Analysis &bull; {activeCompany.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600">
              <WalletCards className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">Healthy</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operating Cash Flow</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">$45,200</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <FilePlus className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accounts Receivable</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">$112,400</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 text-orange-600">
              <FileMinus className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accounts Payable</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">$68,900</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Monthly Cash Waterfall</h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashWaterfallData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={val => `$${val}k`} />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        content={({ active, payload, label }) => {
                           if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                 <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                                    <p className={`text-sm font-black ${data.type === 'out' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                      ${Math.abs(data.value)}k {data.type === 'out' ? 'Outflow' : 'Inflow'}
                                    </p>
                                 </div>
                              );
                           }
                           return null;
                        }} 
                     />
                     <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {cashWaterfallData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
            <h3 className="text-lg font-black text-slate-900 mb-4">Cash Burn Insight</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-bold text-slate-600">Current Burn Rate</span>
                 <span className="text-sm font-black text-slate-900">$18,500 /mo</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-slate-600">Estimated Runway</span>
                 <span className="text-sm font-black text-emerald-600">8.2 Months</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
               Your cash position has strengthened this month. Receivables aging is well within the 30-day target, 
               proving strong collection efforts. At the current burn rate and assuming no additional revenue, 
               the company has over 8 months of operating runway.
            </p>
         </div>
      </div>
    </div>
  );
}
