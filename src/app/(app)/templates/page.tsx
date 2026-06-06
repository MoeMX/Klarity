import React, { useState } from 'react';
import { LayoutTemplate, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { templateService } from '../../../services/api/templateService';
import { TemplateEditorModal } from '../../../components/templates/TemplateEditorModal';
import { Modal } from '../../../components/ui/Modal';

export default function TemplatesPage() {
  const [editingTemplate, setEditingTemplate] = useState<{id: string, title: string} | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');

  const [templates, setTemplates] = useState([
    { id: '1', title: 'Executive Summary', active: 45, status: 'Default' },
    { id: '2', title: 'Board of Directors Update', active: 12, status: 'Custom' },
    { id: '3', title: 'SaaS Metrics Deep-Dive', active: 8, status: 'Custom' },
    { id: '4', title: 'Monthly Close Package', active: 32, status: 'Default' },
  ]);

  const handleNewTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) return;
    
    try {
      await templateService.buildCustomTemplate();
      const newTemp = {
        id: Date.now().toString(),
        title: newTemplateTitle,
        active: 0,
        status: 'Custom'
      };
      setTemplates([...templates, newTemp]);
      setNewTemplateTitle('');
      setIsAddModalOpen(false);
      toast.success('Template created successfully');
      // Optionally open the editor immediately
      setEditingTemplate(newTemp);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create template');
    }
  };

  const handleEditLayout = (template: {id: string, title: string}) => {
    setEditingTemplate(template);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
         <div>
           <h1 className="text-3xl font-black text-slate-900 mb-1">Templates Library</h1>
           <p className="text-sm font-medium text-slate-500">Manage standard report layouts block-by-block</p>
         </div>
         <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 text-sm font-bold bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center">
           <Plus className="w-4 h-4 mr-1" /> New Template
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {templates.map((tpl, i) => (
            <div key={tpl.id} onClick={() => handleEditLayout(tpl)} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col group hover:border-teal-200 transition-all cursor-pointer">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600">
                     <LayoutTemplate className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${tpl.status === 'Default' ? 'bg-slate-100 text-slate-600' : 'bg-purple-50 text-purple-600'}`}>
                     {tpl.status}
                  </span>
               </div>
               <h3 className="text-lg font-black text-slate-900 mb-1">{tpl.title}</h3>
               <p className="text-sm text-slate-500 font-medium mb-6">Assigned to {tpl.active} clients</p>
               
               <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold text-teal-600">Edit Layout</span>
                  <span className="text-sm font-medium text-slate-400">→</span>
               </div>
            </div>
         ))}
      </div>

      {editingTemplate && (
        <TemplateEditorModal 
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          templateTitle={editingTemplate.title}
        />
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Template">
        <form onSubmit={handleNewTemplate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Template Title</label>
            <input 
              required 
              type="text" 
              value={newTemplateTitle} 
              onChange={e => setNewTemplateTitle(e.target.value)} 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-shadow" 
              placeholder="e.g. Q3 Performance Report" 
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">
              Create Template
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
