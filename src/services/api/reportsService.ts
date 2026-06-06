export const reportsService = {
  /**
   * Generates a new advisory report for a company.
   */
  async generateReport(companyId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Report generation unavailable. PDF service offline.');
  },

  /**
   * Downloads a specific historical report document.
   */
  async downloadReport(reportId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    throw new Error('File not found. The requested document is missing.');
  }
};
