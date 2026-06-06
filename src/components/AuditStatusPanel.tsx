import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Database, Wifi, Shield, ShieldAlert, Activity, ChevronUp, ChevronDown, Download, X } from 'lucide-react';
import { auditBot, HealthStatus, AuditLog } from '../services/auditBot';
import { localStore, STORE_KEYS } from '../services/api/localStore';

export function AuditStatusPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<HealthStatus>(auditBot.health);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const location = useLocation();

  // Only show in /app routes
  const isAppRoute = location.pathname.startsWith('/app');
  
  // Check if current user is developer
  const profileData = localStore.get(STORE_KEYS.SETTINGS, { email: '' } as any);
  const isDeveloper = profileData.email === 'j5therapyar@gmail.com';

  useEffect(() => {
    if (!isAppRoute || !isDeveloper) return;

    // Subscribe to AuditBot state changes
    const unsubscribe = auditBot.subscribe(() => {
      setHealth({ ...auditBot.health });
      setLogs([...auditBot.getLogs()]);
    });

    // Initial load
    setHealth({ ...auditBot.health });
    setLogs([...auditBot.getLogs()]);

    return () => unsubscribe();
  }, [isAppRoute, isDeveloper]);

  if (!isAppRoute || !isDeveloper) return null;

  // Compute Overall Status Color
  let statusColor = 'bg-emerald-500'; // All healthy
  let badgeLabel = 'System Healthy';
  if (health.network === 'offline' || health.auth === 'offline' || health.firestore === 'offline') {
    statusColor = 'bg-yellow-500';
    badgeLabel = 'Degraded / Offline';
  }
  if (health.auth === 'error' || health.firestore === 'error') {
    statusColor = 'bg-rose-500';
    badgeLabel = 'System Error';
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />;
      case 'offline': return <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />;
      case 'error': return <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />;
      default: return <div className="w-2 h-2 rounded-full bg-slate-400" />;
    }
  };

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'bg-blue-100 text-blue-700';
      case 'WARN': return 'bg-yellow-100 text-yellow-700';
      case 'ERROR': return 'bg-rose-100 text-rose-700';
      case 'FIX': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-full shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all outline-none"
      >
        <div className={`w-2.5 h-2.5 rounded-full ${statusColor} shadow-[0_0_8px_currentColor]`} />
        <span className="text-xs font-bold font-mono tracking-tight">{badgeLabel}</span>
        <ChevronUp className="w-4 h-4 ml-1 text-slate-400" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[600px] flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden text-slate-200 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm">Audit & Monitoring Bot</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Health Overview */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-slate-800 bg-slate-900/50">
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <Wifi className="w-5 h-5 text-slate-400 mb-2" />
          <div className="flex items-center gap-1.5">
            {getStatusIcon(health.network)}
            <span className="text-xs font-bold uppercase tracking-wider">{health.network}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <Shield className="w-5 h-5 text-slate-400 mb-2" />
          <div className="flex items-center gap-1.5">
            {getStatusIcon(health.auth)}
            <span className="text-xs font-bold uppercase tracking-wider">{health.auth}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <Database className="w-5 h-5 text-slate-400 mb-2" />
          <div className="flex items-center gap-1.5">
            {getStatusIcon(health.firestore)}
            <span className="text-xs font-bold uppercase tracking-wider">Storage</span>
          </div>
        </div>
      </div>

      {/* Logs View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">No logs available</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="text-xs font-mono bg-slate-800/50 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getLogBadgeColor(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="text-slate-300 mb-1">{log.message}</div>
              {log.details && (
                <div className="text-[10px] text-slate-500 mt-1 whitespace-pre-wrap break-words bg-slate-900/50 p-2 rounded">
                  {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
          Last Check: {new Date(health.lastCheckMillis).toLocaleTimeString()}
        </span>
        <button 
          onClick={() => auditBot.downloadLogs()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export JSON
        </button>
      </div>
    </div>
  );
}
