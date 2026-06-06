import React from 'react';
import { Modal } from '../ui/Modal';
import { KPIMetric, Company } from '../../types';
import { kpiLibrary } from '../../config/kpiLibrary';

interface AllInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  metrics: KPIMetric[];
}

export function AllInsightsModal({ isOpen, onClose, company, metrics }: AllInsightsModalProps) {
  
  const generateInsights = () => {
    return metrics.map((metric, i) => {
      const def = kpiLibrary.find(k => k.id === metric.kpiId);
      if (!def) return null;

      let type: 'good' | 'warning' | 'danger' | 'neutral' = metric.status;
      let title = '';
      let description = '';
      let colorClass = '';
      let bgClass = '';

      if (type === 'good') {
        title = `Strong ${def.name} Trajectory`;
        description = `${def.name} has trended ${metric.trend} by ${metric.percentChange}% over the period. Cash flows and operational efficiencies appear to be tracking well against benchmarks.`;
        colorClass = 'text-teal-600';
        bgClass = 'bg-teal-100';
      } else if (type === 'warning') {
        title = `${def.name} Risk Flag`;
        description = `We've detected a ${metric.percentChange}% ${metric.trend === 'up' ? 'increase' : 'decrease'} in ${def.name}. Recommend careful monitoring of this metric going into the next quarter to ensure it doesn't impact runway.`;
        colorClass = 'text-amber-600';
        bgClass = 'bg-amber-100';
      } else if (type === 'danger') {
        title = `Critical Alert: ${def.name}`;
        description = `${def.name} has fallen into a danger zone, trending ${metric.trend} by ${metric.percentChange}%. Immediate advisory consultation is recommended to adjust the strategic financial plan.`;
        colorClass = 'text-rose-600';
        bgClass = 'bg-rose-100';
      } else {
        title = `${def.name} Steady State`;
        description = `${def.name} is relatively stable, trending ${metric.trend} by ${metric.percentChange}%. No immediate advisory action is required, but continue monitoring.`;
        colorClass = 'text-slate-600';
        bgClass = 'bg-slate-100';
      }

      return (
        <div key={metric.kpiId} className="flex space-x-4">
          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${bgClass} ${colorClass} font-bold text-sm`}>
            {i + 1}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
            <p className="text-sm text-slate-600">
              {description}
            </p>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const insights = generateInsights();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`System Advisories & Insights - ${company.name}`} className="max-w-2xl">
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {insights.length > 0 ? insights : (
          <p className="text-sm text-slate-500">No significant insights detected for this period.</p>
        )}
      </div>
      <div className="pt-6 border-t border-slate-100 mt-6">
         <button onClick={onClose} className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
           Close Insights
         </button>
      </div>
    </Modal>
  );
}
