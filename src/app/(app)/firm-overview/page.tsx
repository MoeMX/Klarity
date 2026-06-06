import { useState } from 'react';
import { Building, Users, Clock, Globe } from 'lucide-react';
import { platformConfig } from '../../../config/platformConfig';
import toast from 'react-hot-toast';
import { firmService } from '../../../services/api/firmService';

export default function FirmOverviewPage() {
  const [profileData, setProfileData] = useState({
    firmName: platformConfig.productName,
    supportEmail: 'support@firm.com',
    disclaimer: 'Confidential and proprietary. These financial summaries are prepared for internal management purposes and have not been audited.'
  });

  const handleUpdateProfile = async () => {
    try {
      await firmService.updateFirmProfile(profileData);
      toast.success('Firm profile settings updated and saved.');
    } catch (error: any) {
      toast.error('Failed to update firm profile.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Firm Overview</h1>
        <p className="text-sm font-medium text-slate-500">Manage {platformConfig.productName} firm global profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Advisors</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">12</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600">
              <Building className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Managed Clients</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">45</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Onboarding</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">4.2 Days</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 text-orange-600">
              <Globe className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regions</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">US, UK</h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
         <h3 className="text-lg font-black text-slate-900 mb-6">Firm Profile Settings</h3>
          <div className="space-y-6 max-w-2xl">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5">Firm Name</label>
               <input type="text" value={profileData.firmName} onChange={e => setProfileData({...profileData, firmName: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5">Primary Support Email</label>
               <input type="email" value={profileData.supportEmail} onChange={e => setProfileData({...profileData, supportEmail: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5">Reporting Disclaimer (Appears on PDFs)</label>
               <textarea rows={3} value={profileData.disclaimer} onChange={e => setProfileData({...profileData, disclaimer: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium resize-none"></textarea>
            </div>
            <div className="pt-4 flex justify-end">
               <button onClick={handleUpdateProfile} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                 Save Profile Changes
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
