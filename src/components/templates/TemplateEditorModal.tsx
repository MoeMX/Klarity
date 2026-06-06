import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { LayoutTemplate, GripVertical, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateTitle: string;
}

export function TemplateEditorModal({ isOpen, onClose, templateTitle }: TemplateEditorModalProps) {
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'Header', enabled: true },
    { id: '2', type: 'KPI Metrics Row', enabled: true },
    { id: '3', type: 'Revenue vs Expenses Chart', enabled: true },
    { id: '4', type: 'Cash Flow Projection', enabled: true },
    { id: '5', type: 'AI Advisory Notes', enabled: false },
    { id: '6', type: 'Footer', enabled: true },
  ]);

  const toggleBlock = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));
  };

  const handleSave = async () => {
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Template layout updated successfully');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Layout: ${templateTitle}`}>
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-600">
          Drag and drop blocks to reorder, or toggle to show/hide sections in the final PDF report.
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {blocks.map((block) => (
            <div 
              key={block.id} 
              className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${block.enabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-400 cursor-grab active:cursor-grabbing" />
                <span className={`text-sm font-bold ${block.enabled ? 'text-slate-900' : 'text-slate-500 line-through'}`}>{block.type}</span>
              </div>
              <button 
                onClick={() => toggleBlock(block.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${block.enabled ? 'bg-teal-50 text-teal-700' : 'bg-slate-200 text-slate-600'}`}
              >
                {block.enabled ? 'Included' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
           <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              Cancel
           </button>
           <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
              <CheckCircle2 className="w-4 h-4" /> Save Layout
           </button>
        </div>
      </div>
    </Modal>
  );
}
