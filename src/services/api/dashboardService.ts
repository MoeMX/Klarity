import { CompanyDashboard } from '../../types';
import { localStore, STORE_KEYS } from './localStore';
import { mockDashboardData } from '../../data/sampleDashboards';

export const dashboardService = {
  /**
   * Fetches the executive summary dashboard data for a given company.
   */
  async getDashboardData(companyId: string): Promise<CompanyDashboard> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const allDashboards = localStore.get<Record<string, CompanyDashboard>>(STORE_KEYS.DASHBOARDS, {});
    const dashboard = allDashboards[companyId];
    
    if (dashboard) {
      return dashboard;
    }

  // Default realistic dashboard template
    return {
      id: `dash_${companyId}`,
      companyId: companyId,
      templateId: 'exec_summary',
      name: 'Executive Summary',
      metrics: [
        {
          kpiId: 'revenue',
          currentValue: 240000,
          previousValue: 210000,
          percentChange: 14.2,
          trend: 'up',
          status: 'good',
          history: [
            { date: 'Jan', value: 120000 },
            { date: 'Feb', value: 130000 },
            { date: 'Mar', value: 125000 },
            { date: 'Apr', value: 145000 },
            { date: 'May', value: 160000 },
            { date: 'Jun', value: 175000 },
            { date: 'Jul', value: 180000 },
            { date: 'Aug', value: 190000 },
            { date: 'Sep', value: 185000 },
            { date: 'Oct', value: 200000 },
            { date: 'Nov', value: 210000 },
            { date: 'Dec', value: 240000 },
          ],
        },
        {
          kpiId: 'net_profit',
          currentValue: 45000,
          previousValue: 38000,
          percentChange: 18.4,
          trend: 'up',
          status: 'good',
          history: [
            { date: 'Jan', value: 25000 },
            { date: 'Feb', value: 28000 },
            { date: 'Mar', value: 26000 },
            { date: 'Apr', value: 31000 },
            { date: 'May', value: 34000 },
            { date: 'Jun', value: 38000 },
            { date: 'Jul', value: 40000 },
            { date: 'Aug', value: 42000 },
            { date: 'Sep', value: 40000 },
            { date: 'Oct', value: 45000 },
            { date: 'Nov', value: 48000 },
            { date: 'Dec', value: 55000 },
          ],
        },
        {
          kpiId: 'cash_balance',
          currentValue: 320000,
          previousValue: 315000,
          percentChange: 1.5,
          trend: 'up',
          status: 'good',
          history: [
            { date: 'Jan', value: 250000 },
            { date: 'Feb', value: 260000 },
            { date: 'Mar', value: 255000 },
            { date: 'Apr', value: 270000 },
            { date: 'May', value: 280000 },
            { date: 'Jun', value: 285000 },
            { date: 'Jul', value: 280000 },
            { date: 'Aug', value: 290000 },
            { date: 'Sep', value: 295000 },
            { date: 'Oct', value: 300000 },
            { date: 'Nov', value: 305000 },
            { date: 'Dec', value: 320000 },
          ],
        },
        {
          kpiId: 'burn_rate',
          currentValue: 85000,
          previousValue: 88000,
          percentChange: 3.4,
          trend: 'down',
          status: 'good',
          history: [
            { date: 'Jan', value: 75000 },
            { date: 'Feb', value: 78000 },
            { date: 'Mar', value: 77000 },
            { date: 'Apr', value: 80000 },
            { date: 'May', value: 82000 },
            { date: 'Jun', value: 85000 },
            { date: 'Jul', value: 87000 },
            { date: 'Aug', value: 90000 },
            { date: 'Sep', value: 88000 },
            { date: 'Oct', value: 85000 },
            { date: 'Nov', value: 83000 },
            { date: 'Dec', value: 85000 },
          ],
        }
      ]
    };
  },

  /**
   * Saves an advisory note for a given company.
   */
  async saveAdvisoryNote(companyId: string, title: string, commentary: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Advisory Note saved for company ${companyId}:`, { title, commentary });
  }
};
