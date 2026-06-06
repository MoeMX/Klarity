import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NoClientState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
        <Building2 className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Client</h2>
      <p className="text-slate-500 max-w-sm mx-auto mb-8">
        You have no active clients. Add a client first to view their dashboards, run scenarios, and integrate their apps.
      </p>
      <Link 
        to="/app/clients"
        className="px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all font-sans"
      >
        Go to Client Portfolio
      </Link>
    </div>
  );
}
