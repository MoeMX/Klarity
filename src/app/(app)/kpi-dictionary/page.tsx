import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { BookOpen, Search, Filter, Hash, Plus, Download, Upload, Trash2, Edit2, ArrowUpDown, ArrowUp, ArrowDown, LineChart, Bell } from 'lucide-react';
import { NoClientState } from '../../../components/ui/NoClientState';
import { Modal } from '../../../components/ui/Modal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const initialKpiDictionaryData = [
  {
    id: 1,
    name: 'Gross Revenue',
    purpose: 'Top-line sales performance indicator',
    formula: 'Sum of all sales transactions before deductions',
    dataSource: 'Accounting System (e.g., QuickBooks)',
    owner: 'CFO / VP of Sales',
    target: '+20% YoY',
    frequency: 'Monthly',
    audience: 'Executive Team, Board',
    notes: 'Excludes sales tax and intra-company transfers.'
  },
  {
    id: 2,
    name: 'Customer Acquisition Cost (CAC)',
    purpose: 'Measures efficiency of marketing and sales spend',
    formula: '(Total Sales & Marketing Expenses) / (# of New Customers)',
    dataSource: 'CRM & Accounting System',
    owner: 'CMO',
    target: '< $1,200 per customer',
    frequency: 'Quarterly',
    audience: 'Marketing Team, Executive Team',
    notes: 'Includes salaries of marketing and sales staff.'
  },
  {
    id: 3,
    name: 'Monthly Recurring Revenue (MRR)',
    purpose: 'Predictability of recurring subscription income',
    formula: 'Sum of all active recurring subscription values',
    dataSource: 'Subscription Management / CRM',
    owner: 'VP of Sales',
    target: '$500k MRR',
    frequency: 'Monthly',
    audience: 'Executive Team, Investors',
    notes: 'Excludes one-time setup fees and professional services.'
  },
  {
    id: 4,
    name: 'Net Revenue Retention (NRR)',
    purpose: 'Measures health of the existing customer base',
    formula: '(Beginning MRR + Expansion MRR - Downgrade MRR - Churn MRR) / Beginning MRR',
    dataSource: 'Subscription / Billing System',
    owner: 'Customer Success',
    target: '> 110%',
    frequency: 'Quarterly',
    audience: 'Executive Team, Board',
    notes: 'A critical metric for valuing SaaS or subscription businesses.'
  },
  {
    id: 5,
    name: 'Days Sales Outstanding (DSO)',
    purpose: 'Efficiency of collecting receivables',
    formula: '(Accounts Receivable / Total Credit Sales) x Number of Days',
    dataSource: 'Accounting System',
    owner: 'VP of Finance / Controller',
    target: '< 45 Days',
    frequency: 'Monthly',
    audience: 'Finance Team',
    notes: 'High DSO indicates potential cash flow constraints.'
  }
];

type Kpi = typeof initialKpiDictionaryData[0];
type SortField = keyof Kpi | null;

export default function KPIDictionaryPage() {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [kpis, setKpis] = useState(initialKpiDictionaryData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<Kpi | null>(null);
  
  const [chartKpi, setChartKpi] = useState<Kpi | null>(null);
  const [alertKpi, setAlertKpi] = useState<Kpi | null>(null);
  const [alertConfig, setAlertConfig] = useState({ condition: 'below', threshold: '', email: true, inApp: true });

  const [newKpi, setNewKpi] = useState({
    name: '', purpose: '', formula: '', dataSource: '', owner: '', target: '', frequency: '', audience: '', notes: ''
  });
  
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeCompany) return <NoClientState />;

  const filteredData = kpis.filter(kpi => 
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpi.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String(a[sortField]).toLowerCase();
    const bVal = String(b[sortField]).toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Kpi) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddKpi = (e: React.FormEvent) => {
    e.preventDefault();
    setKpis([...kpis, { id: Date.now(), ...newKpi }]);
    setNewKpi({ name: '', purpose: '', formula: '', dataSource: '', owner: '', target: '', frequency: '', audience: '', notes: '' });
    setIsAddModalOpen(false);
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Alerts configured for ${alertKpi?.name}`);
    setAlertKpi(null);
  };

  const getDummyChartData = (kpiName: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let base = 100;
    if (kpiName.includes('Revenue') || kpiName.includes('MRR')) base = 120000;
    else if (kpiName.includes('Cost') || kpiName.includes('CAC')) base = 800;
    else if (kpiName.includes('Retention') || kpiName.includes('Margin')) base = 80;
    else if (kpiName.includes('Days')) base = 50;
    
    return months.map(m => {
        const variance = base * 0.15;
        const val = base + (Math.random() * variance * 2 - variance);
        return { month: m, value: Math.max(0, val) };
    });
  };

  const handleEditKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKpi) {
      setKpis(kpis.map(k => k.id === editingKpi.id ? editingKpi : k));
      setIsEditModalOpen(false);
      setEditingKpi(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
      setKpis(kpis.filter(k => k.id !== id));
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Business Purpose', 'Formula', 'Data Source', 'Owner', 'Target', 'Frequency', 'Audience', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...kpis.map(kpi => 
        [
          `"${kpi.name}"`, `"${kpi.purpose}"`, `"${kpi.formula}"`, `"${kpi.dataSource}"`, 
          `"${kpi.owner}"`, `"${kpi.target}"`, `"${kpi.frequency}"`, `"${kpi.audience}"`, `"${kpi.notes}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kpi_dictionary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const rows = text.split('\n').filter(r => r.trim() !== '');
          if (rows.length > 1) {
            const newKpis = rows.slice(1).map((row, idx) => {
              // Basic CSV parsing
              const cols = row.split(',').map(c => c.replace(/^"|"$/g, '').trim());
              return {
                id: Date.now() + idx,
                name: cols[0] || '',
                purpose: cols[1] || '',
                formula: cols[2] || '',
                dataSource: cols[3] || '',
                owner: cols[4] || '',
                target: cols[5] || '',
                frequency: cols[6] || '',
                audience: cols[7] || '',
                notes: cols[8] || ''
              };
            });
            setKpis([...kpis, ...newKpis]);
          }
        }
      };
      reader.readAsText(file);
    }
    // reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const SortIcon = ({ field }: { field: keyof Kpi }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 inline text-slate-300" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1 inline text-teal-600" /> : <ArrowDown className="w-4 h-4 ml-1 inline text-teal-600" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-teal-600" />
            KPI Dictionary
          </h1>
          <p className="text-sm font-medium text-slate-500">Standardized definitions for {activeCompany.name}'s metrics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search metrics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
            />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImport} />
          
          <div className="flex space-x-2">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium text-sm rounded-xl hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add KPI
              </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                  KPI Name <SortIcon field="name" />
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('purpose')}>
                  Business Purpose <SortIcon field="purpose" />
                </th>
                <th className="px-6 py-4 min-w-[200px] cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('formula')}>
                  Formula <SortIcon field="formula" />
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('dataSource')}>
                  Data Source <SortIcon field="dataSource" />
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('owner')}>
                  Owner <SortIcon field="owner" />
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('target')}>
                  Target <SortIcon field="target" />
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('frequency')}>
                  Freq <SortIcon field="frequency" />
                </th>
                <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('audience')}>
                  Audience <SortIcon field="audience" />
                </th>
                <th className="px-6 py-4 min-w-[200px]">Notes</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedData.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Hash className="w-4 h-4 text-teal-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                       <span className="font-bold text-slate-900">{kpi.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{kpi.purpose}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 bg-slate-50/50 rounded">{kpi.formula}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{kpi.dataSource}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{kpi.owner}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 whitespace-nowrap">
                      {kpi.target}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{kpi.frequency}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{kpi.audience}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 italic">{kpi.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setChartKpi(kpi)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        title="View KPI Chart"
                      >
                        <LineChart className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setAlertKpi(kpi)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                        title="Set KPI Alerts"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setEditingKpi(kpi); setIsEditModalOpen(true); }}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded"
                        title="Edit KPI"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDelete(kpi.id)}
                         className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                         title="Delete KPI"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
                    No metrics found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New KPI">
        <form onSubmit={handleAddKpi} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">KPI Name</label>
              <input required type="text" value={newKpi.name} onChange={e => setNewKpi({...newKpi, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. CAC" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
              <input required type="text" value={newKpi.owner} onChange={e => setNewKpi({...newKpi, owner: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. CMO" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Purpose</label>
              <input required type="text" value={newKpi.purpose} onChange={e => setNewKpi({...newKpi, purpose: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Why it matters" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Formula</label>
              <input type="text" value={newKpi.formula} onChange={e => setNewKpi({...newKpi, formula: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 font-mono focus:outline-none" placeholder="How it is calculated" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Source</label>
              <input type="text" value={newKpi.dataSource} onChange={e => setNewKpi({...newKpi, dataSource: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. QuickBooks" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
              <input type="text" value={newKpi.target} onChange={e => setNewKpi({...newKpi, target: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. < $1,200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <input type="text" value={newKpi.frequency} onChange={e => setNewKpi({...newKpi, frequency: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. Monthly" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
              <input type="text" value={newKpi.audience} onChange={e => setNewKpi({...newKpi, audience: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Who uses it" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea rows={2} value={newKpi.notes} onChange={e => setNewKpi({...newKpi, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Definitions, exclusions, assumptions" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">Add KPI</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingKpi(null); }} title="Edit KPI">
        {editingKpi && (
          <form onSubmit={handleEditKpi} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">KPI Name</label>
                <input required type="text" value={editingKpi.name} onChange={e => setEditingKpi({...editingKpi, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                <input required type="text" value={editingKpi.owner} onChange={e => setEditingKpi({...editingKpi, owner: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Purpose</label>
                <input required type="text" value={editingKpi.purpose} onChange={e => setEditingKpi({...editingKpi, purpose: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Formula</label>
                <input type="text" value={editingKpi.formula} onChange={e => setEditingKpi({...editingKpi, formula: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 font-mono focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Source</label>
                <input type="text" value={editingKpi.dataSource} onChange={e => setEditingKpi({...editingKpi, dataSource: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target</label>
                <input type="text" value={editingKpi.target} onChange={e => setEditingKpi({...editingKpi, target: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                <input type="text" value={editingKpi.frequency} onChange={e => setEditingKpi({...editingKpi, frequency: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
                <input type="text" value={editingKpi.audience} onChange={e => setEditingKpi({...editingKpi, audience: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea rows={2} value={editingKpi.notes} onChange={e => setEditingKpi({...editingKpi, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingKpi(null); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Chart Modal */}
      <Modal isOpen={!!chartKpi} onClose={() => setChartKpi(null)} title={chartKpi ? `${chartKpi.name} Trend` : 'Trend'}>
        {chartKpi && (
          <div className="space-y-4">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getDummyChartData(chartKpi.name)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-500 italic mt-2 text-center">Interactive preview visualization</p>
          </div>
        )}
      </Modal>

      {/* Alert Modal */}
      <Modal isOpen={!!alertKpi} onClose={() => setAlertKpi(null)} title={alertKpi ? `Configure Alerts: ${alertKpi.name}` : 'Configure Alerts'}>
        {alertKpi && (
          <form onSubmit={handleSaveAlert} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Alert Condition</label>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={alertConfig.condition}
                    onChange={e => setAlertConfig({...alertConfig, condition: e.target.value})}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="below">Drops below</option>
                    <option value="above">Rises above</option>
                    <option value="drops">Drops by (%)</option>
                    <option value="rises">Rises by (%)</option>
                  </select>
                  <input 
                    type="number" 
                    required
                    value={alertConfig.threshold}
                    onChange={e => setAlertConfig({...alertConfig, threshold: e.target.value})}
                    placeholder="Value limit..."
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-900 mb-3">Notification Channels</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={alertConfig.email}
                      onChange={e => setAlertConfig({...alertConfig, email: e.target.checked})}
                      className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={alertConfig.inApp}
                      onChange={e => setAlertConfig({...alertConfig, inApp: e.target.checked})}
                      className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-slate-700">In-App Alerts</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setAlertKpi(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-colors">Save Rule</button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}

