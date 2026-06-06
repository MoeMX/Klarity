import { Link, Outlet, useLocation } from 'react-router-dom';
import { platformConfig } from '../../config/platformConfig';
import { LayoutDashboard, Building2, FileText, Settings, Bell, LogOut, ChevronDown, HelpCircle, Users, Calculator, Blocks, Target, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { localStore, STORE_KEYS } from '../../services/api/localStore';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { KlarityLogo } from '../../components/KlarityLogo';

import { HelpSupportModal } from '../../components/HelpSupportModal';

const mockUser = {
  name: 'Jordan Lee',
  role: 'Adviser',
  firm: 'Sample CPA Advisory'
};

export default function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [companies, setCompanies] = useState<any[]>(() => localStore.get(STORE_KEYS.COMPANIES, []));
  const [selectedCompanyId, setSelectedCompanyId] = useState(() => companies.length > 0 ? companies[0].id : '');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const activeCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  useEffect(() => {
    localStore.set(STORE_KEYS.COMPANIES, companies);
    if (!selectedCompanyId && companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  useEffect(() => {
    const syncHandler = () => {
      setCompanies(localStore.get(STORE_KEYS.COMPANIES, []));
    };
    window.addEventListener('local-storage', syncHandler);
    return () => window.removeEventListener('local-storage', syncHandler);
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const navigation = [
    { name: 'Executive Summary', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Goals', href: '/app/goals', icon: Target },
    { name: 'KPI Dictionary', href: '/app/kpi-dictionary', icon: Blocks },
    { name: 'Financial Performance', href: '/app/financial', icon: LayoutDashboard },
    { name: 'Revenue Forecast', href: '/app/revenue-forecast', icon: TrendingUp },
    { name: 'Cash Flow Monitor', href: '/app/cash-flow', icon: LayoutDashboard },
    { name: 'Sales Pipeline', href: '/app/sales', icon: LayoutDashboard },
    { name: 'HR Scenario Builder', href: '/app/hr-scenario', icon: Users },
    { name: 'Debt Calculator', href: '/app/debt-scenario', icon: Calculator },
    { name: 'Clients', href: '/app/clients', icon: Building2 },
    { name: 'Reports', href: '/app/reports', icon: FileText },
    { name: 'Integrations', href: '/app/integrations', icon: Blocks },
    { name: 'Data Entry', href: '/app/data-entry', icon: FileText },
    { name: 'Training', href: '/app/training', icon: HelpCircle },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <KlarityLogo className="w-8 h-8" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">{platformConfig.productName}</span>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/app/firm-overview" className="px-3 py-2 text-sm font-semibold text-teal-600 bg-teal-50 rounded-md">Firm Overview</Link>
            <Link to="/app/clients" className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">Client Management</Link>
            <Link to="/app/templates" className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">Templates</Link>
            <Link to="/app/reports" className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors">Advisory Reports</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsHelpModalOpen(true)} className="text-slate-400 hover:text-slate-600 relative p-1 hidden sm:block">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="relative">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-slate-400 hover:text-slate-600 relative p-1 hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-xs text-teal-600 font-semibold hover:text-teal-700">Mark all as read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-slate-900 mb-1">New Client Onboarded</p>
                    <p className="text-xs text-slate-500">TechFlow Inc has been successfully setup.</p>
                    <p className="text-[10px] text-slate-400 mt-2">Just now</p>
                  </div>
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-slate-900 mb-1">Report Generated</p>
                    <p className="text-xs text-slate-500">Q3 Financial Advisory report is ready for review.</p>
                    <p className="text-[10px] text-slate-400 mt-2">2 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 border border-slate-200 rounded-full bg-slate-50">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-semibold text-slate-700">{mockUser.name} ({mockUser.role})</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
            JL
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col p-4 space-y-6 overflow-y-auto">
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 relative z-10">Active Client</label>
            <div 
              className="mt-2 px-3 py-3 bg-slate-900 rounded-xl flex items-center justify-between group cursor-pointer relative"
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white truncate max-w-[130px]">{activeCompany ? activeCompany.name : 'No Active Client'}</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{activeCompany ? activeCompany.industry : 'Please create a client'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            
            {isClientDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {companies.map(c => (
                    <div 
                      key={c.id} 
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${c.id === selectedCompanyId ? 'bg-teal-50/50' : ''}`}
                      onClick={() => {
                        setSelectedCompanyId(c.id);
                        setIsClientDropdownOpen(false);
                      }}
                    >
                      <p className={`text-sm font-bold ${c.id === selectedCompanyId ? 'text-teal-700' : 'text-slate-900'}`}>{c.name}</p>
                      <p className="text-xs text-slate-500">{c.industry}</p>
                    </div>
                  ))}
                  {companies.length === 0 && (
                    <div className="px-4 py-3 text-sm text-slate-500 text-center">No clients</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href) && item.href !== '#';
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'opacity-70' : 'opacity-70'}`} />
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
              <h4 className="text-xs font-bold text-teal-800 mb-1">Client Health Score</h4>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl font-black text-teal-600">84</span>
                <div className="flex-1 h-2 bg-teal-200 rounded-full overflow-hidden">
                  <div className="w-[84%] h-full bg-teal-500"></div>
                </div>
              </div>
              <p className="text-[10px] text-teal-700 leading-tight italic">Healthy. Cash runway extending, receivables normalized.</p>
            </div>
            <Link to="/" className="mt-4 flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <LogOut className="w-4 h-4" />
              Exit
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main ref={mainRef} className="flex-1 p-8 overflow-y-auto">
          <Outlet context={{ selectedCompanyId, activeCompany, companies, setCompanies }} />
        </main>
      </div>

      <HelpSupportModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}
