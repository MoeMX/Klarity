import React, { useState, useRef, useEffect } from 'react';
import { Lock, User, Bell, Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsService } from '../../../services/api/settingsService';
import { localStore, STORE_KEYS } from '../../../services/api/localStore';

type Tab = 'profile' | 'notifications' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profileData, setProfileData] = useState(() => {
    return localStore.get(STORE_KEYS.SETTINGS, {
      fullName: 'Jordan Lee',
      email: 'jordan.lee@advisoryfirm.com',
      jobTitle: 'Lead Financial Partner',
      avatarUrl: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=4f46e5&color=fff'
    });
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStore.set(STORE_KEYS.SETTINGS, profileData);
  }, [profileData]);

  const handleSaveProfile = async () => {
    try {
      await settingsService.updateUserProfile(profileData);
      toast.success('Profile details saved successfully.');
    } catch (error: any) {
      toast.error('Failed to update profile.');
    }
  };

  const handleAvatarSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resultUrl = await settingsService.uploadAvatar(file);
      setProfileData({ ...profileData, avatarUrl: resultUrl });
      toast.success('Avatar uploaded successfully.');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Personal Settings</h1>
        <p className="text-sm font-medium text-slate-500">Manage your advisory account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-sm border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent'}`}>
               <User className="w-4 h-4 mr-3 opacity-70" /> User Profile
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${activeTab === 'notifications' ? 'bg-slate-900 text-white shadow-sm border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent'}`}>
               <Bell className="w-4 h-4 mr-3 opacity-70" /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${activeTab === 'security' ? 'bg-slate-900 text-white shadow-sm border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent'}`}>
               <Lock className="w-4 h-4 mr-3 opacity-70" /> Security
            </button>
         </div>

         <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               {activeTab === 'profile' && (
                 <>
                   <h3 className="text-lg font-black text-slate-900 mb-6">Profile Details</h3>
                   <div className="space-y-6 max-w-lg">
                      <div className="flex items-center space-x-6 mb-8">
                         <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-md flex justify-center items-center overflow-hidden">
                            <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                         </div>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                         <button onClick={handleAvatarSelect} className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
                            Change Avatar
                         </button>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                         <input type="text" value={profileData.fullName} onChange={e => setProfileData({...profileData, fullName: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                         <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Title</label>
                         <input type="text" value={profileData.jobTitle} onChange={e => setProfileData({...profileData, jobTitle: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                         <button onClick={handleSaveProfile} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-colors">
                           Save Profile
                         </button>
                      </div>
                   </div>
                 </>
               )}

               {activeTab === 'notifications' && (
                 <>
                   <h3 className="text-lg font-black text-slate-900 mb-6">Notification Preferences</h3>
                   <div className="space-y-6 max-w-lg">
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Email Notifications</h4>
                            <p className="text-xs text-slate-500 mt-1">Receive updates about client activity via email</p>
                         </div>
                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-teal-500" />
                            <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                         </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Weekly Summary</h4>
                            <p className="text-xs text-slate-500 mt-1">Get a weekly summary of client financial health</p>
                         </div>
                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-teal-500" />
                            <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                         </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Alerts & Warnings</h4>
                            <p className="text-xs text-slate-500 mt-1">Immediate alerts when client KPIs drop below thresholds</p>
                         </div>
                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle3" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-teal-500" />
                            <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                         <button onClick={() => toast.success('Notification preferences saved.')} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-colors">
                           Save Preferences
                         </button>
                      </div>
                   </div>
                   <style>{`
                     .toggle-checkbox:checked { right: 0; border-color: #0d9488; }
                     .toggle-checkbox:checked + .toggle-label { background-color: #0d9488; }
                     .toggle-checkbox { right: 5px; z-index: 1; border-color: #e2e8f0; }
                   `}</style>
                 </>
               )}

               {activeTab === 'security' && (
                 <>
                   <h3 className="text-lg font-black text-slate-900 mb-6">Security Settings</h3>
                   <div className="space-y-6 max-w-lg">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1.5">Current Password</label>
                         <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
                      </div>
                      
                      <div className="pt-6 pb-2 border-t border-slate-100">
                        <div className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <Shield className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                           <div>
                              <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h4>
                              <p className="text-xs text-slate-500 mt-1 mb-3">Add an extra layer of security to your account. We recommend turning this on.</p>
                              <button onClick={() => toast.success('2FA Setup Initiated')} className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                                Enable 2FA
                              </button>
                           </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                         <button onClick={() => toast.success('Security settings updated.')} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-600 text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-colors">
                           Update Password
                         </button>
                      </div>
                   </div>
                 </>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
