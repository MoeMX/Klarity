import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { DollarSign, Percent, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { financialService } from '../../../services/api/financialService';
import { NoClientState } from '../../../components/ui/NoClientState';

export default function FinancialPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();

  if (!activeCompany) return <NoClientState />;

  const mockPlData = [
    { month: 'Jan', revenue: 120, expenses: 90 },
    { month: 'Feb', revenue: 130, expenses: 95 },
    { month: 'Mar', revenue: 125, expenses: 85 },
    { month: 'Apr', revenue: 145, expenses: 90 },
    { month: 'May', revenue: 160, expenses: 100 },
    { month: 'Jun', revenue: 175, expenses: 110 },
    { month: 'Jul', revenue: 180, expenses: 115 },
    { month: 'Aug', revenue: 190, expenses: 120 },
    { month: 'Sep', revenue: 185, expenses: 118 },
    { month: 'Oct', revenue: 200, expenses: 125 },
    { month: 'Nov', revenue: 210, expenses: 130 },
    { month: 'Dec', revenue: 240, expenses: 140 },
  ];

  const handleDownloadPnL = async () => {
    try {
      await financialService.downloadPnLCSV(activeCompany.id);
      toast.success('P&L CSV downloaded successfully.');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Financial Performance</h1>
          <p className="text-sm font-medium text-slate-500">P&L Detailed View &bull; {activeCompany.name}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleDownloadPnL} className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
            Download P&L
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
              <Percent className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">+2.4%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gross Margin</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">68.4%</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-rose-50 text-rose-600">+8.1%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operating Expenses</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">$42,500</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">+14.2%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">EBITDA</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">$84,200</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
         <h3 className="text-lg font-black text-slate-900 mb-6">Revenue vs Expenses (Trailing 6 Months)</h3>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={mockPlData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={val => `$${val}k`} />
                  <Tooltip 
                     content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                           return (
                              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                                 <div className="space-y-1">
                                    <p className="text-sm font-black text-teal-400">Rev: ${payload[0].value}k</p>
                                    <p className="text-sm font-black text-rose-400">Exp: ${payload[1].value}k</p>
                                 </div>
                              </div>
                           );
                        }
                        return null;
                     }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#E11D48" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
