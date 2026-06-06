import React, { useState } from 'react';
import { Company } from '../../../types';
import { Building2, Search, ArrowRight, MoreHorizontal, Send } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { clientsService } from '../../../services/api/clientsService';
import { ClientOnboardingModal } from '../../../components/clients/ClientOnboardingModal';
import { InviteClientModal } from '../../../components/clients/InviteClientModal';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { companies, setCompanies } = useOutletContext<{ companies: Company[], setCompanies: React.Dispatch<React.SetStateAction<Company[]>> }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOnboardClient = async (clientData: any) => {
    try {
      const newCompany = await clientsService.onboardNewClient(clientData);
      setCompanies(prev => [...prev, newCompany]);
      toast.success('Client onboarded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to onboard client');
    }
  };

  const handleInviteClient = async (email: string, message: string) => {
    try {
      const inviteRef = await addDoc(collection(db, 'invites'), {
        email,
        message,
        createdAt: serverTimestamp(),
        used: false
      });
      const inviteLink = `${window.location.origin}/login?invite=${inviteRef.id}`;
      toast.success(`Invite sent successfully to ${email}`);
      return inviteLink;
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invite');
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Client Portfolio</h1>
          <p className="text-sm font-medium text-slate-500">Manage your advisory clients and monitor platform usage.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsInviteModalOpen(true)} className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2">
            <Send className="w-4 h-4" />
            Invite Business
          </button>
          <button onClick={() => setIsOnboardModalOpen(true)} className="px-4 py-2 text-sm font-bold bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">
            Add New Client +
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400 font-bold">
                <th className="px-6 py-5">Company Name</th>
                <th className="px-6 py-5">Industry</th>
                <th className="px-6 py-5">Health Score</th>
                <th className="px-6 py-5">Last Updated</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map(company => (
                <tr key={company.id} onClick={() => navigate(`/app/clients/${company.id}`)} className="bg-white hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mr-4">
                        <Building2 className="h-5 w-5 text-slate-500" />
                      </div>
                      <span className="font-bold text-slate-900">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{company.industry}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
                      company.healthScore === 'Healthy' && "bg-emerald-50 text-emerald-600",
                      company.healthScore === 'Watch' && "bg-amber-50 text-amber-600",
                      company.healthScore === 'Needs Attention' && "bg-orange-50 text-orange-600",
                      company.healthScore === 'Critical' && "bg-rose-50 text-rose-600",
                      !company.healthScore && "bg-slate-50 text-slate-600"
                    )}>
                      {company.healthScore || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-400">2 days ago</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link to="/app/dashboard" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Dashboard <ArrowRight className="h-4 w-4" />
                      </Link>
                      <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCompanies.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              No clients found matching your search.
            </div>
          )}
        </div>
      </div>

      <ClientOnboardingModal 
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onSubmit={handleOnboardClient}
      />

      <InviteClientModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleInviteClient}
      />
    </div>
  );
}
