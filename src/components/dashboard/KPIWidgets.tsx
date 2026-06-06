import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { formatCurrency, formatPercentage, formatNumber, cn } from '../../lib/utils';
import { kpiLibrary } from '../../config/kpiLibrary';
import { DollarSign, TrendingUp, WalletCards, Percent } from 'lucide-react';
import { KPIMetric } from '../../types';

interface KPICardProps {
  metric: KPIMetric;
}

export const KPICard: React.FC<KPICardProps> = ({ metric }) => {
  const kpiDef = kpiLibrary.find(k => k.id === metric.kpiId);
  if (!kpiDef) return null;

  const isUp = metric.trend === 'up';
  const isDown = metric.trend === 'down';
  const isNeutral = metric.trend === 'flat';
  
  const statusColors = {
    good: 'text-emerald-500 bg-emerald-50',
    warning: 'text-amber-500 bg-amber-50',
    danger: 'text-rose-500 bg-rose-50',
    neutral: 'text-slate-500 bg-slate-50',
  };

  const iconStyles = {
    revenue: { bg: 'bg-blue-50', text: 'text-blue-600', Icon: DollarSign },
    net_profit: { bg: 'bg-purple-50', text: 'text-purple-600', Icon: TrendingUp },
    net_margin: { bg: 'bg-amber-50', text: 'text-amber-600', Icon: Percent },
    cash_balance: { bg: 'bg-orange-50', text: 'text-orange-600', Icon: WalletCards },
  };

  const styleConfig = iconStyles[metric.kpiId as keyof typeof iconStyles] || { bg: 'bg-slate-50', text: 'text-slate-600', Icon: DollarSign };
  const { bg, text, Icon } = styleConfig;

  let displayValue = '';
  switch (kpiDef.format) {
    case 'currency': displayValue = formatCurrency(metric.currentValue); break;
    case 'percentage': displayValue = formatPercentage(metric.currentValue); break;
    default: displayValue = formatNumber(metric.currentValue); break;
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${text}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[metric.status]}`}>
          {isUp ? '+' : isDown ? '-' : ''}{Math.abs(metric.percentChange)}%
        </span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpiDef.name}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{displayValue}</h3>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  metric: KPIMetric;
  className?: string;
}

export const ChartWidget: React.FC<ChartCardProps> = ({ title, metric, className }) => {
  const kpiDef = kpiLibrary.find(k => k.id === metric.kpiId);
  if (!kpiDef) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      let val = payload[0].value;
      if (kpiDef.format === 'currency') val = formatCurrency(val);
      if (kpiDef.format === 'percentage') val = formatPercentage(val);
      
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-black text-white">{val}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-sm", className)}>
      <div className="mb-6">
         <h3 className="text-lg font-black text-slate-900">{title}</h3>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {kpiDef.chartType === 'bar' ? (
             <BarChart data={metric.history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => kpiDef.format === 'currency' ? `$${val / 1000}k` : val} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
             </BarChart>
          ) : kpiDef.chartType === 'area' ? (
             <AreaChart data={metric.history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
               <defs>
                  <linearGradient id={`colorValue-${metric.kpiId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => kpiDef.format === 'currency' ? `$${val / 1000}k` : val} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill={`url(#colorValue-${metric.kpiId})`} />
             </AreaChart>
          ) : (
             <LineChart data={metric.history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(val) => kpiDef.format === 'currency' ? `$${val / 1000}k` : val} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#0F172A" strokeWidth={3} dot={{ r: 4, fill: '#0F172A', strokeWidth: 0 }} activeDot={{ r: 6 }} />
             </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
