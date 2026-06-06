import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { TrendingUp, BarChart3, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, FileText } from 'lucide-react';
import { NoClientState } from '../../../components/ui/NoClientState';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import toast from 'react-hot-toast';

const initialForecastData = [
  { month: 'Jan', actual: 120000, forecast: 125000, pipeline: 0 },
  { month: 'Feb', actual: 135000, forecast: 130000, pipeline: 0 },
  { month: 'Mar', actual: 142000, forecast: 145000, pipeline: 0 },
  { month: 'Apr', actual: 155000, forecast: 150000, pipeline: 0 },
  { month: 'May', actual: 148000, forecast: 160000, pipeline: 0 },
  { month: 'Jun', actual: null, forecast: 165000, pipeline: 45000 },
  { month: 'Jul', actual: null, forecast: 172000, pipeline: 60000 },
  { month: 'Aug', actual: null, forecast: 180000, pipeline: 85000 },
  { month: 'Sep', actual: null, forecast: 195000, pipeline: 110000 },
  { month: 'Oct', actual: null, forecast: 205000, pipeline: 130000 },
  { month: 'Nov', actual: null, forecast: 215000, pipeline: 150000 },
  { month: 'Dec', actual: null, forecast: 230000, pipeline: 180000 },
];

export default function RevenueForecastPage() {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [scenario, setScenario] = useState<'conservative' | 'base' | 'optimistic'>('base');
  const [whatIfValue, setWhatIfValue] = useState<number>(0);
  const [data, setData] = useState(initialForecastData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [notes, setNotes] = useState('Assuming new product launch in Q3 will drive 15% upside in pipeline conversion.');

  if (!activeCompany) return <NoClientState />;

  const getScenarioMultiplier = (s: string) => {
    switch (s) {
      case 'conservative': return 0.85;
      case 'optimistic': return 1.15;
      default: return 1;
    }
  };

  const currentMultiplier = getScenarioMultiplier(scenario);

  const adjustedData = data.map(d => {
    let baseProjected = d.actual ? null : (d.forecast + (d.pipeline * 0.4));
    
    if (baseProjected && whatIfValue !== 0) {
      baseProjected *= (1 + whatIfValue / 100);
    }

    return {
      ...d,
      projected: baseProjected ? baseProjected * currentMultiplier : null,
      projectedBase: baseProjected ? baseProjected : null,
      projectedConservative: baseProjected ? baseProjected * 0.85 : null,
      projectedOptimistic: baseProjected ? baseProjected * 1.15 : null,
      historical: d.actual || null
    };
  });

  const ytdRevenue = data.reduce((acc, curr) => acc + (curr.actual || 0), 0);
  const projectedYE = adjustedData.reduce((acc, curr) => acc + (curr.historical || curr.projected || 0), 0);
  const previousYE = 1850000;
  const growthRate = ((projectedYE - previousYE) / previousYE) * 100;

  const growthData = adjustedData.map((d, index) => {
    let growth = 0;
    const currentVal = d.historical || d.projected || d.projectedBase || 0;
    if (index > 0) {
      const prevVal = adjustedData[index - 1].historical || adjustedData[index - 1].projected || adjustedData[index - 1].projectedBase || 0;
      if (prevVal > 0) {
        growth = ((currentVal - prevVal) / prevVal) * 100;
      }
    }
    return {
      month: d.month,
      growth: parseFloat(growth.toFixed(1)),
      isProjected: !d.historical
    };
  });

  const handleSyncPipeline = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // increase pipeline values slightly to simulate sync
      setData(prev => prev.map(d => ({
        ...d,
        pipeline: d.pipeline ? Math.round(d.pipeline * (1 + (Math.random() * 0.2))) : 0
      })));
      setIsSyncing(false);
      toast.success('Pipeline data synced successfully.');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-teal-600" />
            Revenue Forecast
          </h1>
          <p className="text-sm font-medium text-slate-500">Predictive modeling and pipeline intelligence for {activeCompany.name}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSyncPipeline}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Pipeline Data'}
          </button>
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            {(['conservative', 'base', 'optimistic'] as const).map(s => (
              <button
                key={s}
                onClick={() => {
                  setScenario(s);
                  setShowComparison(false);
                }}
                className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                  scenario === s && !showComparison
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-teal-50 p-3 rounded-xl">
            <DollarSign className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Projected Year-End</p>
            <h3 className="text-2xl font-black text-slate-900">${(projectedYE / 1000000).toFixed(2)}M</h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
              {growthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}% vs Last Year</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-blue-50 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">YTD Actuals</p>
            <h3 className="text-2xl font-black text-slate-900">${(ytdRevenue / 1000).toFixed(0)}k</h3>
            <p className="text-xs font-medium text-slate-400 mt-2">Through May 31</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Pipeline Contribution</p>
            <h3 className="text-2xl font-black text-slate-900">40%</h3>
            <p className="text-xs font-medium text-slate-400 mt-2">Weighted win rate applied</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Projected Trajectory
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 bg-slate-50 transition-all">
                <span className="text-sm font-medium text-slate-500 whitespace-nowrap">What-If Override:</span>
                <input 
                  type="number"
                  value={whatIfValue}
                  onChange={e => setWhatIfValue(Number(e.target.value))}
                  className="w-16 bg-transparent text-sm font-bold text-slate-900 focus:outline-none text-right"
                />
                <span className="text-sm font-bold text-slate-500">%</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showComparison}
                  onChange={e => setShowComparison(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-sm font-bold text-slate-600">Compare</span>
              </label>
            </div>
          </div>
          <div className="h-80 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adjustedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: string) => {
                    let labelName = name === 'historical' ? 'Actuals' : name === 'projected' ? 'Forecast Model' : name;
                    if (name === 'projectedBase') labelName = 'Base Scenario';
                    if (name === 'projectedConservative') labelName = 'Conservative Scenario';
                    if (name === 'projectedOptimistic') labelName = 'Optimistic Scenario';
                    return [`$${Number(value).toLocaleString()}`, labelName];
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="historical" name="Historical Actuals" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorHistorical)" />
                {showComparison ? (
                  <>
                    <Area isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="projectedConservative" name="Conservative Scenario" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                    <Area isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="projectedBase" name="Base Scenario" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                    <Area isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="projectedOptimistic" name="Optimistic Scenario" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                  </>
                ) : (
                  <Area isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="projected" name="Forecast Model" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Forecast Notes
          </h3>
          <textarea 
            className="w-full flex-grow bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors resize-none"
            placeholder="Add modeling assumptions, risks, and pipeline notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => toast.success('Notes saved successfully.')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          MoM Revenue Growth Trend
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData.slice(1)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any, name: string) => [`${value}%`, 'Growth']}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar 
                dataKey="growth" 
                radius={[4, 4, 0, 0]}
              >
                {growthData.slice(1).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isProjected ? '#818cf8' : '#0d9488'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
