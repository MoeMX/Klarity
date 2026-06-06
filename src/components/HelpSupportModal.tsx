import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { FileText, HelpCircle, ArrowLeft, Send, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'menu' | 'docs' | 'contact' | 'submitted';

export function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  const [view, setView] = useState<ViewState>('menu');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset view when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('menu'), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setView('submitted');
      setSubject('');
      setMessage('');
    }, 800);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={
        view === 'docs' ? 'Platform Documentation' : 
        view === 'contact' ? 'Contact Support' : 
        view === 'submitted' ? 'Message Sent' : 
        'Help & Support'
      }
      className={view === 'docs' ? "max-w-2xl" : "max-w-md"}
    >
      {view === 'menu' && (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Need assistance with your advisory dashboard? Choose from the options below to get the help you need.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => setView('docs')}
              className="w-full flex items-center p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center text-slate-600 group-hover:text-teal-600 mr-4 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Documentation</h4>
                <p className="text-xs text-slate-500">Read the platform guides</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500" />
            </button>

            <button 
              onClick={() => setView('contact')}
              className="w-full flex items-center p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center text-slate-600 group-hover:text-teal-600 mr-4 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">Contact Support</h4>
                <p className="text-xs text-slate-500">Reach out to our team</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button onClick={handleClose} className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {view === 'docs' && (
        <div className="space-y-6">
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Getting Started
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Welcome to your advisory dashboard. To get started, navigate to the <strong>Clients</strong> tab to add your first client. You can then configure integration settings or use the Manual Data Entry form to populate financial data.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Understanding Health Scores
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Client health scores provide a quick overview of a business's operational standing. The score evaluates:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Revenue Growth Trend (30%)</li>
                <li>Profit Margin Stability (25%)</li>
                <li>Cash Flow Runway (25%)</li>
                <li>Client Advisory Engagement (20%)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Data Integrations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with major accounting platforms via the <strong>Integrations</strong> tab. We currently support QuickBooks, Xero, and Sage. Syncing normally takes 2-5 minutes depending on transaction volume.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button onClick={() => setView('menu')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button onClick={handleClose} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
              Close Guide
            </button>
          </div>
        </div>
      )}

      {view === 'contact' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-slate-600">
            Send us a message and our support team will get back to you within 24 hours.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="How can we help?"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
              <textarea 
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue or ask a question..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => setView('menu')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-lg shadow-teal-600/20"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      )}

      {view === 'submitted' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Message Sent</h3>
            <p className="text-sm text-slate-500">
              We've received your request and will contact you shortly.
            </p>
          </div>
          <div className="pt-6">
            <button onClick={handleClose} className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
              Close Window
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
