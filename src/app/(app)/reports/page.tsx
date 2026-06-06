import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { reportsService } from '../../../services/api/reportsService';
import { NoClientState } from '../../../components/ui/NoClientState';
import { GenerateReportModal } from '../../../components/reports/GenerateReportModal';

export default function ReportsPage() {
  const { selectedCompanyId, activeCompany, companies } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company, companies: Company[] }>();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  if (!activeCompany) return <NoClientState />;

  const reportsList = [
    { id: '1', title: 'October Executive Summary', date: 'Nov 02, 2023', type: 'Monthly Report', status: 'Final' },
    { id: '2', title: 'Q3 Financial Review', date: 'Oct 15, 2023', type: 'Quarterly Advisory', status: 'Final' },
    { id: '3', title: 'September Monthly Close', date: 'Oct 05, 2023', type: 'Monthly Report', status: 'Final' },
  ];

  const handleGenerateReport = async () => {
    try {
      await reportsService.generateReport(activeCompany.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDownload = async (reportId: string) => {
    try {
      await reportsService.downloadReport(reportId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Advisory Reports</h1>
          <p className="text-sm font-medium text-slate-500">Report Archive &bull; {activeCompany.name}</p>
        </div>
        <button onClick={() => setIsGenerateModalOpen(true)} className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
          Generate New Report
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Historical Export Archive</h3>
         </div>
         <div className="w-full">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400 font-bold">
                     <th className="px-6 py-5">Document Title</th>
                     <th className="px-6 py-5">Date Generated</th>
                     <th className="px-6 py-5">Report Type</th>
                     <th className="px-6 py-5">Status</th>
                     <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {reportsList.map(report => (
                     <tr key={report.id} className="bg-white hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                           <div className="flex items-center">
                              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mr-4 shrink-0">
                                 <FileText className="h-5 w-5" />
                              </div>
                              <span className="font-bold text-slate-900">{report.title}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{report.date}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{report.type}</td>
                        <td className="px-6 py-5">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                              {report.status}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <button onClick={() => handleDownload(report.id)} className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                              <Download className="h-4 w-4" /> Download
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <GenerateReportModal 
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        companies={companies}
        defaultCompanyId={selectedCompanyId}
      />
    </div>
  );
}
