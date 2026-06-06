import { useState, useEffect } from 'react';
import { Blocks, Key, CheckCircle2, AlertCircle, RefreshCw, Activity, Lock } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import toast from 'react-hot-toast';
import { NoClientState } from '../../../components/ui/NoClientState';
import { localStore, STORE_KEYS } from '../../../services/api/localStore';
import { mockDashboardData } from '../../../data/sampleDashboards';
import { Modal } from '../../../components/ui/Modal';

const AVAILABLE_INTEGRATIONS = [
  // Accounting
  { id: 'quickbooks', name: 'QuickBooks Online', category: 'Accounting', icon: 'QB' },
  { id: 'xero', name: 'Xero', category: 'Accounting', icon: 'X' },
  { id: 'wave', name: 'Wave Accounting', category: 'Accounting', icon: 'W' },
  { id: 'netsuite', name: 'NetSuite', category: 'Accounting', icon: 'N' },
  { id: 'zoho', name: 'Zoho Books', category: 'Accounting', icon: 'Z' },
  { id: 'freshbooks', name: 'FreshBooks', category: 'Accounting', icon: 'FB' },
  
  // Banking & Automation
  { id: 'plaid', name: 'Plaid (Bank Feeds)', category: 'Banking', icon: 'Pl' },
  { id: 'zapier', name: 'Zapier', category: 'Automation', icon: 'Za' },

  // Project Management
  { id: 'asana', name: 'Asana', category: 'Project Management', icon: 'A' },
  { id: 'monday', name: 'Monday.com', category: 'Project Management', icon: 'M' },
  { id: 'jira', name: 'Jira', category: 'Project Management', icon: 'J' },
  { id: 'trello', name: 'Trello', category: 'Project Management', icon: 'T' },

  // CRM Platforms
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', icon: 'SF' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', icon: 'HS' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', icon: 'PD' },

  // HR Systems
  { id: 'gusto', name: 'Gusto', category: 'HR', icon: 'G' },
  { id: 'bamboohr', name: 'BambooHR', category: 'HR', icon: 'BH' },
  { id: 'workday', name: 'Workday', category: 'HR', icon: 'WD' },

  // Marketing Platforms
  { id: 'mailchimp', name: 'Mailchimp', category: 'Marketing', icon: 'MC' },
  { id: 'marketo', name: 'Marketo', category: 'Marketing', icon: 'Mk' },
  { id: 'activecampaign', name: 'ActiveCampaign', category: 'Marketing', icon: 'AC' },

  // Customer Support
  { id: 'zendesk', name: 'Zendesk', category: 'Customer Support', icon: 'ZD' },
  { id: 'intercom', name: 'Intercom', category: 'Customer Support', icon: 'IC' },

  // Spreadsheets
  { id: 'googlesheets', name: 'Google Sheets', category: 'Spreadsheets', icon: 'GS' },
  { id: 'excel', name: 'Microsoft Excel', category: 'Spreadsheets', icon: 'Ex' },

  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'Databases', icon: 'Pg' },
  { id: 'mysql', name: 'MySQL', category: 'Databases', icon: 'My' },
  { id: 'snowflake', name: 'Snowflake', category: 'Databases', icon: 'Sn' },
];

export default function IntegrationsPage() {
  const { activeCompany } = useOutletContext<{ selectedCompanyId: string, activeCompany: Company }>();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [oauthApp, setOauthApp] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'activity' | 'api_keys'>('directory');

  useEffect(() => {
    if (activeCompany) {
      const allInts = localStore.get<Record<string, any[]>>(STORE_KEYS.INTEGRATIONS, {});
      setIntegrations(allInts[activeCompany.id] || AVAILABLE_INTEGRATIONS.map(i => ({ ...i, connected: false, status: 'Inactive' })));
      
      const allLogs = localStore.get<Record<string, any[]>>(STORE_KEYS.ACTIVITY, {});
      setActivityLogs(allLogs[activeCompany.id] || []);
    }
  }, [activeCompany?.id]);

  if (!activeCompany) return <NoClientState />;

  const handleConnectClick = async (app: any, currentlyConnected: boolean) => {
    if (currentlyConnected) {
      handleDisconnect(app);
    } else {
      setConnecting(app.id);
      setOauthApp(app);
      try {
        const response = await fetch('/api/auth/url');
        if (!response.ok) throw new Error('Failed to get auth URL');
        const { url } = await response.json();

        // Note: url goes to /auth/callback locally to simulate redirect
        const authWindow = window.open(
          url,
          'oauth_popup',
          'width=600,height=700'
        );

        if (!authWindow) {
          toast.error('Please allow popups for this site to connect your account.');
          setConnecting(null);
        }
      } catch (error) {
        console.error('OAuth error:', error);
        toast.error('Failed to initiate connection.');
        setConnecting(null);
      }
    }
  };

  const handleDisconnect = (integratedApp: any) => {
    const updated = integrations.map(int => int.id === integratedApp.id ? { ...int, connected: false, status: 'Inactive' } : int);
    setIntegrations(updated);
    
    const allInts = localStore.get<Record<string, any[]>>(STORE_KEYS.INTEGRATIONS, {});
    allInts[activeCompany.id] = updated;
    localStore.set(STORE_KEYS.INTEGRATIONS, allInts);
    
    toast.success(`${integratedApp.name} disconnected.`);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (oauthApp) {
           completeOauthAuth(oauthApp);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [oauthApp]);

  const completeOauthAuth = async (appToConnect: any) => {
    try {
      const updated = integrations.map(int => int.id === appToConnect.id ? { ...int, connected: true, status: 'Active' } : int);
      setIntegrations(updated);
      
      const allInts = localStore.get<Record<string, any[]>>(STORE_KEYS.INTEGRATIONS, {});
      allInts[activeCompany.id] = updated;
      localStore.set(STORE_KEYS.INTEGRATIONS, allInts);

      const allLogs = localStore.get<Record<string, any[]>>(STORE_KEYS.ACTIVITY, {});
      const clientLogs = allLogs[activeCompany.id] || [];
      const newLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        service: appToConnect.name,
        type: 'Data Sync',
        status: 'Success',
        records: Math.floor(Math.random() * 500) + 50,
        message: 'Initial data sync completed via standard API OAuth.'
      };
      
      const updatedLogs = [newLog, ...clientLogs];
      setActivityLogs(updatedLogs);
      allLogs[activeCompany.id] = updatedLogs;
      localStore.set(STORE_KEYS.ACTIVITY, allLogs);

      // Seed dashboard data
      if (appToConnect.category === 'Accounting') {
        const dashboardList = Object.values(mockDashboardData);
        const randomDashForDemo = dashboardList[Math.floor(Math.random() * dashboardList.length)];
        const allDashboards = localStore.get<Record<string, any>>(STORE_KEYS.DASHBOARDS, {});
        allDashboards[activeCompany.id] = {
          ...randomDashForDemo,
          companyId: activeCompany.id,
          id: `dash_${activeCompany.id}`
        };
        localStore.set(STORE_KEYS.DASHBOARDS, allDashboards);
      }

      toast.success(`${appToConnect.name} connected successfully.`);
    } catch (e) {
      toast.error(`Failed to connect to ${appToConnect.name}.`);
    } finally {
      setConnecting(null);
      setOauthApp(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
         <div className="flex flex-col">
           <h1 className="text-3xl font-black text-slate-900 mb-1">Integrations</h1>
           <p className="text-sm font-medium text-slate-500">Connect bookkeeping and project management apps &bull; {activeCompany.name}</p>
         </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'directory' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          App Directory
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'activity' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Integration Activity (Logs)
        </button>
        <button
          onClick={() => setActiveTab('api_keys')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'api_keys' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Custom API Keys
        </button>
      </div>

      {activeTab === 'directory' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
             <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Blocks className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-900">App Directory</h2>
               <p className="text-xs text-slate-500">Sync data automatically from connected services.</p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {integrations.map((app) => (
                <div key={app.id} className={`p-5 rounded-2xl border transition-all ${app.connected ? 'border-teal-200 bg-teal-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${app.connected ? 'bg-white border-teal-100 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                        <p className="text-xs text-slate-500 mb-1">{app.category}</p>
                        {app.connected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Not Connected
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleConnectClick(app, app.connected)}
                      disabled={connecting === app.id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        app.connected 
                          ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-transparent' 
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                      } ${connecting === app.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {connecting === app.id ? (
                        <><RefreshCw className="w-3 h-3 animate-spin"/> Connecting</>
                      ) : app.connected ? (
                        'Disconnect'
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Activity className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-900">Activity Log</h2>
               <p className="text-xs text-slate-500">Recent data syncs and connection attempts.</p>
             </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                   <th className="p-4">Date / Time</th>
                   <th className="p-4">Service</th>
                   <th className="p-4">Event Type</th>
                   <th className="p-4">Records</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Details</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                        No integrations have been connected yet. Connect an app to see sync activity.
                      </td>
                    </tr>
                 ) : activityLogs.map((log: any) => (
                   <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="p-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                       {new Date(log.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                     </td>
                     <td className="p-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                       {log.service}
                     </td>
                     <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                       {log.type}
                     </td>
                     <td className="p-4 text-sm text-slate-600 font-mono">
                       {log.records > 0 ? log.records.toLocaleString() : '-'}
                     </td>
                     <td className="p-4">
                       {log.status === 'Success' ? (
                         <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                           <CheckCircle2 className="w-3.5 h-3.5" />
                           Success
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                           <AlertCircle className="w-3.5 h-3.5" />
                           Failed
                         </span>
                       )}
                     </td>
                     <td className="p-4 text-sm text-slate-500 min-w-[200px]">
                       {log.message}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'api_keys' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Key className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-900">Developer API Keys</h2>
               <p className="text-xs text-slate-500">Manage API keys and authentication tokens for custom integrations.</p>
             </div>
           </div>

           <div className="space-y-6">
             <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
               <div className="flex items-start justify-between mb-4">
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">Add New Custom Integration</h3>
                   <p className="text-xs text-slate-500 mt-1">Enter your secret credentials provided by the third-party service provider. Keys will be encrypted at rest.</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2">Integration Name</label>
                   <input type="text" placeholder="e.g. Internal CRM" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2">API Key or Bearer Token</label>
                   <input type="password" placeholder="•••••••••••••••••••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
                 </div>
               </div>
               
               <div className="mt-4 flex justify-end">
                 <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors">
                   Save API Key
                 </button>
               </div>
             </div>

             <div>
               <h3 className="text-sm font-bold text-slate-900 mb-3 ml-1">Configured Custom Keys</h3>
               <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                 <div className="p-4 bg-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                       H
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">HubSpot API V3</p>
                       <p className="text-xs text-slate-500">Added on Oct 12, 2023</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">sk-••••••••••A9f2</span>
                     <button className="text-xs font-bold text-rose-600 hover:text-rose-700">Delete</button>
                   </div>
                 </div>
                 
                 <div className="p-4 bg-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                       S
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">Stripe Webhook Secret</p>
                       <p className="text-xs text-slate-500">Added on Nov 05, 2023</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">whsec_••••••••41k</span>
                     <button className="text-xs font-bold text-rose-600 hover:text-rose-700">Delete</button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Simulated OAuth Modal */}
      {oauthApp && (
        <Modal
          isOpen={!!oauthApp}
          onClose={() => setOauthApp(null)}
          title={`Connect to ${oauthApp.name}`}
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold shadow-sm border border-teal-100">
                  Kl
                </div>
                <div className="flex gap-1 items-center text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white text-slate-700 flex items-center justify-center text-2xl font-bold shadow-sm border border-slate-200">
                  {oauthApp.icon}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600 text-center">
                Klarity is requesting access to your <span className="font-bold">{oauthApp.name}</span> account.
              </p>
            </div>

            <div className="bg-white border text-sm text-slate-600 border-slate-200 rounded-xl p-4">
              <div className="flex gap-3 mb-2 text-slate-900 font-bold">
                <Lock className="w-5 h-5 text-teal-600" />
                Secure Authorization
              </div>
              <p className="mb-2">By continuing, you will be redirected to {oauthApp.name} to securely log in. Klarity will only receive authorized data explicitly granted via their secure API connection.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500">
                <li>Read-only access to relevant financial data</li>
                <li>Import transactions, accounts, and balances</li>
                <li>Data is encrypted at rest and in transit</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOauthApp(null)}
                className="px-4 py-2 font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                className="px-6 py-2 font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/20"
              >
                Authorize & Connect
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
