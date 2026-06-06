import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Mail, Briefcase, Link } from 'lucide-react';

interface InviteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, message: string) => Promise<string | undefined>;
}

export function InviteClientModal({ isOpen, onClose, onSubmit }: InviteClientModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const generatedLink = await onSubmit(email, message);
      if (generatedLink) {
        setInviteLink(generatedLink);
      }
    } catch (error) {
      // Error handled by parent toast, just prevent unhandled rejection
      console.warn('Invite logic failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // User can just assume it was copied via their OS standard or a toast, we let the parent handle the success toast mostly, or we could add a toast here.
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setInviteLink('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Client to Test">
      {!inviteLink ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium border border-blue-100 flex gap-3">
              <Briefcase className="w-5 h-5 shrink-0 text-blue-600" />
              <p>Send an invitation to businesses you want to test Klarity with. They'll receive an email with a secure registration link.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Client Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ceo@acmecorp.com"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Personal Note (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd love for you to test out our new advisory platform..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-emerald-900 font-black text-lg">Invite Sent Successfully!</h3>
            <p className="text-emerald-700 font-medium text-sm">An email has been dispatched to {email}.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Or share this link directly:</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                {inviteLink}
              </div>
              <button 
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Link className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
