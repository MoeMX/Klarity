import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Company, CompanyDashboard } from '../../../types';
import { KPICard, ChartWidget } from '../../../components/dashboard/KPIWidgets';
import { Modal } from '../../../components/ui/Modal';
import { AllInsightsModal } from '../../../components/dashboard/AllInsightsModal';
import { NoClientState } from '../../../components/ui/NoClientState';
import toast from 'react-hot-toast';

import { dashboardService } from '../../../services/api/dashboardService';
import { exportService } from '../../../services/api/exportService';

export default function DashboardPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  
  const [dashboard, setDashboard] = useState<CompanyDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [exportOptions, setExportOptions] = useState({
    includeExecutiveSummary: true,
    includeFinancialTrends: true,
    includeAdvisoryInsights: true,
  });

  const [noteForm, setNoteForm] = useState({ title: '', commentary: '' });

  useEffect(() => {
    if (!activeCompany) return;
    let isMounted = true;
    setIsLoading(true);
    
    dashboardService.getDashboardData(activeCompany.id)
      .then(data => {
        if (isMounted) {
          setDashboard(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
        if (isMounted) setIsLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [activeCompany?.id]);

  const handleExport = async () => {
    setIsExportModalOpen(false);
    try {
      if (!activeCompany) return;
      await exportService.exportDashboardToPDF(activeCompany.id, exportOptions);
      toast.success('Document ready for printing or PDF saving.', { icon: '📄' });
    } catch (error) {
      toast.error('Failed to prepare document export.');
    }
  };
  
  const handleSaveNote = async () => {
    setIsNoteModalOpen(false);
    try {
      if (!activeCompany) return;
      await dashboardService.saveAdvisoryNote(activeCompany.id, noteForm.title, noteForm.commentary);
      toast.success('Advisory note saved to client profile.');
      setNoteForm({ title: '', commentary: '' });
    } catch (error) {
      toast.error('Failed to save advisory note.');
    }
  };

  if (!activeCompany) return <NoClientState />;

  if (isLoading || !dashboard) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Executive Summary</h1>
          <p className="text-sm font-medium text-slate-500">Report for Period: Oct 1 - Oct 31, 2023 &bull; {activeCompany.name}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setIsExportModalOpen(true)} className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
            Export PDF
          </button>
          <button onClick={() => setIsNoteModalOpen(true)} className="px-4 py-2 text-sm font-bold bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">
            Advisory Note +
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboard.metrics.map(metric => (
          <KPICard key={metric.kpiId} metric={metric} />
        ))}
      </div>

      {/* Main Visuals & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Container */}
        <div className="lg:col-span-2 space-y-6">
          <ChartWidget 
             title="Revenue Growth Trend" 
             metric={dashboard.metrics.find(m => m.kpiId === 'revenue')!}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ChartWidget 
               title="Net Profit History" 
               metric={dashboard.metrics.find(m => m.kpiId === 'net_profit')!} 
             />
             <ChartWidget 
               title="Cash Balance" 
               metric={dashboard.metrics.find(m => m.kpiId === 'cash_balance')!} 
             />
          </div>
        </div>

        {/* Advisory Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <h3 className="text-sm font-bold tracking-tight uppercase">AI Insight Engine</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-1 h-8 bg-emerald-400 rounded-full shrink-0"></div>
                <p className="text-xs text-slate-300 leading-normal">
                  <span className="text-white font-bold">Strong Momentum:</span> Revenue increased 11.2% MoM. Service category reached all-time high.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1 h-8 bg-amber-400 rounded-full shrink-0"></div>
                <p className="text-xs text-slate-300 leading-normal">
                  <span className="text-white font-bold">Risk Flag:</span> Cash balance declined 13.5% this month. Recommend review of capital expenditure.
                </p>
              </div>
            </div>
            <button onClick={() => setIsInsightsModalOpen(true)} className="mt-6 w-full py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors">
              View All Insights
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 mb-4">Advisor Notes</h3>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <div className="w-4 h-4 text-slate-500 font-bold text-[10px] flex items-center justify-center">JL</div>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                Meeting scheduled for Nov 5. Focus on Q4 tax planning. Net profit margins improved to 25%, hitting an all-time high. Let's discuss accelerating marketing spend.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Dashboard">
        <p className="text-slate-600 mb-6 text-sm">Select exactly what you want to include in the PDF export for {activeCompany.name}.</p>
        <div className="space-y-3 mb-8">
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={exportOptions.includeExecutiveSummary} onChange={(e) => setExportOptions({...exportOptions, includeExecutiveSummary: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600" />
            <span className="text-sm font-medium text-slate-700">Executive Summary KPIs</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={exportOptions.includeFinancialTrends} onChange={(e) => setExportOptions({...exportOptions, includeFinancialTrends: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600" />
            <span className="text-sm font-medium text-slate-700">Financial Trend Charts</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={exportOptions.includeAdvisoryInsights} onChange={(e) => setExportOptions({...exportOptions, includeAdvisoryInsights: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600" />
            <span className="text-sm font-medium text-slate-700">Advisory Insights & Notes</span>
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-transparent">
            Cancel
          </button>
          <button onClick={handleExport} className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
            Generate PDF
          </button>
        </div>
      </Modal>

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Add Advisory Note">
        <p className="text-slate-600 mb-4 text-sm">Add a note clearly explaining these numbers for the {activeCompany.name} leadership team.</p>
        <div className="space-y-4 mb-6">
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1.5">Note Title</label>
             <input type="text" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} placeholder="e.g. Q4 Growth Outlook" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1.5">Advisory Commentary</label>
             <textarea rows={4} value={noteForm.commentary} onChange={e => setNoteForm({...noteForm, commentary: e.target.value})} placeholder="Add your insights here..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium resize-none"></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-transparent">
            Cancel
          </button>
          <button onClick={handleSaveNote} className="px-4 py-2 rounded-xl text-sm font-bold bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors">
            Save Note
          </button>
        </div>
      </Modal>

      <AllInsightsModal 
        isOpen={isInsightsModalOpen} 
        onClose={() => setIsInsightsModalOpen(false)} 
        company={activeCompany} 
        metrics={dashboard.metrics} 
      />
    </div>
  );
}
