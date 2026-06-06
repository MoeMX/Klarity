import { DashboardTemplate } from '../types';

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'exec_summary',
    name: 'Executive Summary',
    description: 'High-level overview of critical business metrics for owners.',
    intendedUser: 'Business Owner',
    industry: 'All',
    kpiCards: ['revenue', 'net_profit', 'net_margin', 'cash_balance'],
  },
  {
    id: 'financial_performance',
    name: 'Financial Performance',
    description: 'Deep dive into P&L performance and trends.',
    intendedUser: 'Executive / Advisor',
    industry: 'All',
    kpiCards: ['revenue', 'net_profit', 'net_margin'],
  },
  {
    id: 'cash_flow',
    name: 'Cash Flow Monitor',
    description: 'Detailed view of cash runway and liquidity.',
    intendedUser: 'Executive / Advisor',
    industry: 'All',
    kpiCards: ['cash_balance', 'runway'],
  },
  {
    id: 'cpa_advisory',
    name: 'CPA Advisory Review',
    description: 'Dashboard utilized during monthly/quarterly reviews.',
    intendedUser: 'CPA Advisor',
    industry: 'CPA Client',
    kpiCards: ['health_score', 'revenue', 'net_profit', 'cash_balance'],
  }
];
