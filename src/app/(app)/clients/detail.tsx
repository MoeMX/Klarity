import React from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { ArrowLeft, Building2, TrendingUp, Users, DollarSign, Activity, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function KPICard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up'|'down'|'neutral' }) {
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  const color = isUp ? 'text-emerald-600 bg-emerald-50' : isDown ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-50';
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600">
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
          {change}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

const mockRevenueData = [
  { month: 'Jan', revenue: 45000, expenses: 38000 },
  { month: 'Feb', revenue: 48000, expenses: 39000 },
  { month: 'Mar', revenue: 52000, expenses: 41000 },
  { month: 'Apr', revenue: 49000, expenses: 39500 },
  { month: 'May', revenue: 55000, expenses: 42000 },
  { month: 'Jun', revenue: 58000, expenses: 43000 },
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { companies } = useOutletContext<{ companies: Company[] }>();
  
  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="p-12 text-center text-slate-500">
        <h2 className="text-xl font-bold mb-4">Client not found</h2>
        <Link to="/app/clients" className="text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link to="/app/clients" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">{company.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-medium text-slate-500">{company.industry}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            
            <div className="relative group">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold cursor-help ${
                company.healthScore === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                company.healthScore === 'Watch' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                company.healthScore === 'Needs Attention' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                'bg-slate-50 text-slate-700 border border-slate-200'
              }`}>
                {company.healthScore || 'Evaluating'}
              </span>
              <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="font-bold mb-1">Health Score Factors:</p>
                <ul className="space-y-1 text-slate-300 font-medium">
                  <li>• Revenue Growth Trend (30%)</li>
                  <li>• Profit Margin Stability (25%)</li>
                  <li>• Cash Flow Runway (25%)</li>
                  <li>• Client Advisory Engagement (20%)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Monthly MRR" value="$48,500" change="+12.5%" icon={DollarSign} trend="up" />
        <KPICard title="Active Employees" value="124" change="+4" icon={Users} trend="up" />
        <KPICard title="Profit Margin" value="22.4%" change="-1.2%" icon={Activity} trend="down" />
        <KPICard title="Next Report Due" value="Oct 15" change="In 4 days" icon={FileText} trend="neutral" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" /> Revenue vs Expenses
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} formatter={(value) => `$${value/1000}k`} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#0D9488" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Profit Margin Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} formatter={(value) => `${value/1000}%`} />
                <Tooltip cursor={{stroke: '#E2E8F0', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Margin" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}
