import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { FileText, Save, CheckCircle2, RotateCcw, Clock, History } from 'lucide-react';
import { NoClientState } from '../../../components/ui/NoClientState';
import toast from 'react-hot-toast';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DataEntryPage() {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [formData, setFormData] = useState({
    revenue: '',
    expenses: '',
    cashBalance: '',
    accountsReceivable: '',
    accountsPayable: '',
    pipelineValue: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<{ id: string; date: string; data: typeof formData }[]>([]);

  if (!activeCompany) return <NoClientState />;

  const handleCurrencyChange = (field: keyof typeof formData, value: string) => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    const parts = cleanValue.split('.');
    if (parts.length > 2) return;
    
    // Format integer part with commas
    if (parts[0]) {
      // Remove leading zeros
      parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
    }
    
    const formattedValue = parts.join('.');
    setFormData({ ...formData, [field]: formattedValue });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleReset = () => {
    setFormData({
      revenue: '',
      expenses: '',
      cashBalance: '',
      accountsReceivable: '',
      accountsPayable: '',
      pipelineValue: '',
    });
    setErrors({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    const newErrors: Record<string, string> = {};
    if (!formData.revenue) newErrors.revenue = 'Revenue is required';
    if (!formData.expenses) newErrors.expenses = 'Expenses are required';
    if (!formData.cashBalance) newErrors.cashBalance = 'Cash balance is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields.');
      return;
    }

    // Save to history
    setHistory([
      { id: Date.now().toString(), date: new Date().toLocaleString(), data: { ...formData } },
      ...history
    ]);
    
    handleReset();
    toast.success('Financial data saved and synced to dashboard.');
  };

  const sparklineData = useMemo(() => {
    return history
      .slice()
      .reverse()
      .map((record, index) => ({
        index,
        revenue: parseFloat(record.data.revenue?.replace(/,/g, '')) || 0,
      }));
  }, [history]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-slate-900 mb-1">Manual Data Entry</h1>
          <p className="text-sm font-medium text-slate-500">Update financial records and assumptions for {activeCompany.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Current Period Financials</h2>
                <p className="text-sm text-slate-500">Input standard financial attributes manually if you have no integrations hooked up.</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Income & Cash</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Total MTD Revenue <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="text" 
                      placeholder="250,000"
                      value={formData.revenue}
                      onChange={e => handleCurrencyChange('revenue', e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors text-slate-900 font-medium ${errors.revenue ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'}`} 
                    />
                  </div>
                  {errors.revenue && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.revenue}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Total Expenses <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="text" 
                      placeholder="180,000"
                      value={formData.expenses}
                      onChange={e => handleCurrencyChange('expenses', e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors text-slate-900 font-medium ${errors.expenses ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'}`} 
                    />
                  </div>
                  {errors.expenses && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.expenses}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Cash Balance <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="text" 
                      placeholder="450,000"
                      value={formData.cashBalance}
                      onChange={e => handleCurrencyChange('cashBalance', e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors text-slate-900 font-medium ${errors.cashBalance ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'}`} 
                    />
                  </div>
                  {errors.cashBalance && <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.cashBalance}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Pipeline & Receivables</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Accounts Receivable</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="text" 
                      placeholder="85,000"
                      value={formData.accountsReceivable}
                      onChange={e => handleCurrencyChange('accountsReceivable', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors text-slate-900 font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Accounts Payable</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="text" 
                      placeholder="35,000"
                      value={formData.accountsPayable}
                      onChange={e => handleCurrencyChange('accountsPayable', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors text-slate-900 font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sales Pipeline Value (Weighted)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="text" 
                      placeholder="120,000"
                      value={formData.pipelineValue}
                      onChange={e => handleCurrencyChange('pipelineValue', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors text-slate-900 font-medium" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Saving will update numeric tracking history
              </p>
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
              >
                <Save className="w-5 h-5" />
                Save Financial Data
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 border border-slate-200 bg-slate-50 rounded-3xl p-6 h-fit shadow-sm">
          <div className="flex items-center justify-between mb-6 text-slate-900">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <h3 className="text-lg font-bold">Entry History</h3>
            </div>
            {history.length > 1 && (
              <div className="w-24 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData}>
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0d9488" 
                      fill="#ccfbf1" 
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-20" />
              <p className="text-sm font-medium">No previous entries.</p>
              <p className="text-xs">Saved data points will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div key={record.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 mb-3">{record.date}</p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    {record.data.revenue && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium">Revenue</p>
                        <p className="font-bold text-slate-900">${record.data.revenue}</p>
                      </div>
                    )}
                    {record.data.expenses && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium">Expenses</p>
                        <p className="font-bold text-slate-900">${record.data.expenses}</p>
                      </div>
                    )}
                    {record.data.cashBalance && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium">Cash</p>
                        <p className="font-bold text-slate-900">${record.data.cashBalance}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
