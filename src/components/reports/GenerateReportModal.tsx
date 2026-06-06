import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FileText, Calendar, Building2 } from 'lucide-react';
import { Company } from '../../types';
import toast from 'react-hot-toast';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  defaultCompanyId: string;
}

export function GenerateReportModal({ isOpen, onClose, companies, defaultCompanyId }: GenerateReportModalProps) {
  const [reportType, setReportType] = useState('Monthly Report');
  const [dateRange, setDateRange] = useState('Last Month');
  const [selectedClient, setSelectedClient] = useState(defaultCompanyId);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    toast.success('Report successfully generated!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Advisory Report">
      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Client</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Report Type</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
              >
                <option value="Monthly Report">Monthly Financial Review</option>
                <option value="Quarterly Advisory">Quarterly Advisory Review</option>
                <option value="Annual Performance">Annual Performance Review</option>
                <option value="Cash Flow Deep Dive">Cash Flow Deep Dive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Date Range / Period</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
              >
                <option value="Last Month">Last Month</option>
                <option value="Last Quarter">Last Quarter</option>
                <option value="Year to Date">Year to Date (YTD)</option>
                <option value="Last 12 Months">Last 12 Months (TTM)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
          >
            {isGenerating ? 'Generating...' : 'Confirm Generation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
