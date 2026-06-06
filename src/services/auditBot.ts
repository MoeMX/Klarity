import { auth, db } from '../lib/firebase';
import { collection, limit, getDocs, query } from 'firebase/firestore';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'FIX';

export interface AuditLog {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  details?: any;
}

export interface HealthStatus {
  auth: 'online' | 'offline' | 'error' | 'unknown';
  firestore: 'online' | 'offline' | 'error' | 'unknown';
  network: 'online' | 'offline';
  lastCheckMillis: number;
}

class AuditBotService {
  private logs: AuditLog[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private deepAuditIntervalId: NodeJS.Timeout | null = null;
  private listeners: Set<(log?: AuditLog, health?: HealthStatus) => void> = new Set();
  private maxLogs = 500;

  public health: HealthStatus = {
    auth: 'unknown',
    firestore: 'unknown',
    network: navigator.onLine ? 'online' : 'offline',
    lastCheckMillis: Date.now()
  };

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem('klarity_audit_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load audit logs', e);
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(0, this.maxLogs);
      }
      localStorage.setItem('klarity_audit_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to save audit logs', e);
    }
  }

  private notify(log?: AuditLog) {
    this.listeners.forEach(listener => listener(log, this.health));
  }

  public subscribe(listener: (log?: AuditLog, health?: HealthStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getLogs() {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
    localStorage.removeItem('klarity_audit_logs');
    this.notify();
  }

  public log(level: LogLevel, message: string, details?: any) {
    const entry: AuditLog = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      level,
      message,
      details,
    };
    
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    
    this.saveLogs();
    
    if (level === 'ERROR') {
      console.error(`[AuditBot ERROR] ${message}`, details || '');
    } else if (level === 'WARN') {
      console.warn(`[AuditBot WARN] ${message}`, details || '');
    } else {
      console.log(`[AuditBot] ${message}`, details || '');
    }
    
    this.notify(entry);
  }

  public async checkHealth() {
    let authStatus: HealthStatus['auth'] = 'offline';
    let firestoreStatus: HealthStatus['firestore'] = 'offline';

    const wasOnline = this.health.network;
    this.health.network = navigator.onLine ? 'online' : 'offline';
    
    if (wasOnline === 'online' && this.health.network === 'offline') {
      this.log('ERROR', 'Network connection lost');
    } else if (wasOnline === 'offline' && this.health.network === 'online') {
      this.log('FIX', 'Network connection restored');
    }

    if (this.health.network === 'online') {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true);
          authStatus = token ? 'online' : 'error';
        } else {
          authStatus = 'offline';
        }
      } catch (e: any) {
        authStatus = 'error';
        this.log('ERROR', 'Firebase Auth Check Failed', e.message);
      }

      try {
        // Skip firestore health check to prevent unhandled permission errors if not configured.
        firestoreStatus = 'unknown';
      } catch (e: any) {
        if (e.code === 'permission-denied') {
          firestoreStatus = 'online';
        } else {
          firestoreStatus = 'error';
          this.log('ERROR', 'Firestore Connectivity Failed', e.message);
        }
      }
    }

    if (this.health.auth === 'online' && authStatus === 'error') {
      this.log('FIX', 'Attempting auth token refresh due to error state');
      try {
        if (auth.currentUser) await auth.currentUser.getIdToken(true);
      } catch (err) {}
    }

    this.health.auth = authStatus;
    this.health.firestore = firestoreStatus;
    this.health.lastCheckMillis = Date.now();
    
    this.notify();
  }

  public start() {
    if (this.intervalId) return;

    window.addEventListener('error', (e) => {
      this.log('ERROR', `Runtime Error: ${e.message}`, { source: e.filename, lineno: e.lineno });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.log('ERROR', 'Unhandled Promise Rejection', e.reason);
    });

    window.addEventListener('online', () => {
      this.checkHealth();
    });

    window.addEventListener('offline', () => {
      this.checkHealth();
    });

    this.log('INFO', 'AuditBot initialized and starting background monitoring');
    
    this.checkHealth();
    
    this.intervalId = setInterval(() => {
      this.checkHealth();
    }, 30000);

    this.deepAuditIntervalId = setInterval(() => {
       this.log('INFO', 'Executing 5-minute deep audit cycle', { logsCount: this.logs.length });
       this.checkHealth();
    }, 300000);
  }

  public stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.deepAuditIntervalId) clearInterval(this.deepAuditIntervalId);
    this.intervalId = null;
    this.deepAuditIntervalId = null;
    this.log('INFO', 'Audit bot stopped');
  }

  public downloadLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klarity-audit-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const auditBot = new AuditBotService();
