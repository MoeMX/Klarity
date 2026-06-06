export const financialService = {
  /**
   * Downloads the detailed Profit & Loss statement as a CSV.
   */
  async downloadPnLCSV(companyId: string): Promise<void> {
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate dummy P&L data for CSV
    const csvContent = [
      ['Month', 'Revenue ($k)', 'Expenses ($k)'],
      ['Jan', '120', '90'],
      ['Feb', '130', '95'],
      ['Mar', '125', '85'],
      ['Apr', '145', '90'],
      ['May', '160', '100'],
      ['Jun', '175', '110']
    ].map(e => e.join(",")).join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pnl_statement_${companyId.toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
