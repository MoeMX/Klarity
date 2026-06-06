export type UserRole = 'super_admin' | 'cpa_admin' | 'cpa_member' | 'client_admin' | 'client_viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string; // if client
  firmId?: string; // if cpa
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  firmId?: string; // For CPA clients
  healthScore?: 'Healthy' | 'Watch' | 'Needs Attention' | 'Critical' | 'Missing Data';
}

export interface KPI {
  id: string;
  name: string;
  category: 'Financial' | 'Cash Flow' | 'Sales' | 'Operations' | 'Marketing' | 'Customers' | 'Employees' | 'Projects' | 'Advisory' | 'Risk';
  description: string;
  formula: string;
  format: 'currency' | 'percentage' | 'number' | 'ratio';
  goodDirection: 'up' | 'down' | 'neutral';
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'metric';
  applicableIndustries: string[];
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  intendedUser: string;
  industry: string;
  kpiCards: string[]; // KPI IDs
}

export interface DashboardDataPoint {
  date: string;
  value: number;
}

export interface KPIMetric {
  kpiId: string;
  currentValue: number;
  previousValue: number;
  percentChange: number;
  trend: 'up' | 'down' | 'flat';
  status: 'good' | 'warning' | 'danger' | 'neutral';
  history: DashboardDataPoint[];
}

export interface CompanyDashboard {
  id: string;
  companyId: string;
  templateId: string;
  name: string;
  metrics: KPIMetric[];
}
