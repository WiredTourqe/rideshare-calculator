import { RideData, CalculatedMetrics } from '../types';

export function exportToCSV(data: RideData, metrics: CalculatedMetrics): void {
  const csvData = [
    ['Metric', 'Value', 'Unit'],
    ['Total Earnings', data.totalEarnings.toString(), 'USD'],
    ['Rides Completed', data.ridesCompleted.toString(), 'rides'],
    ['Rides Rejected', data.ridesRejected.toString(), 'rides'],
    ['Online Time', metrics.onlineTime.toFixed(2), 'hours'],
    ['Booked Time', metrics.bookedTime.toFixed(2), 'hours'],
    ['Booked Miles', data.bookedMiles.toString(), 'miles'],
    ['Acceptance Rate', metrics.acceptanceRate.toFixed(2), '%'],
    ['Utilization Rate', metrics.utilizationRate.toFixed(2), '%'],
    ['Earnings per Hour', metrics.earningsPerOnlineHour.toFixed(2), 'USD/hour'],
    ['Earnings per Ride', metrics.earningsPerRide.toFixed(2), 'USD/ride'],
    ['Earnings per Mile', metrics.earningsPerBookedMile.toFixed(2), 'USD/mile'],
    ['Average Speed', metrics.averageSpeedDuringBookedTime.toFixed(2), 'mph'],
    ['Rides per Hour', metrics.ridesPerOnlineHour.toFixed(2), 'rides/hour'],
    ['Average Trip Distance', metrics.averageBookedMilesPerRide.toFixed(2), 'miles'],
    ['Average Trip Duration', metrics.averageBookedTimePerRide.toFixed(2), 'minutes'],
    ['Average Wait Time', metrics.averageWaitingTimePerRide.toFixed(2), 'minutes'],
  ];

  if (metrics.grossProfit !== undefined) {
    csvData.push(
      ['Gross Profit', metrics.grossProfit.toFixed(2), 'USD'],
      ['Net Profit', (metrics.netProfit || 0).toFixed(2), 'USD'],
      ['Profit Margin', (metrics.profitMargin || 0).toFixed(2), '%'],
      ['Operating Cost per Mile', (metrics.operatingCostPerMile || 0).toFixed(2), 'USD/mile'],
      ['ROI', (metrics.returnOnInvestment || 0).toFixed(2), '%']
    );
  }

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  downloadFile(csvContent, 'rideshare-analysis.csv', 'text/csv');
}

export function exportToJSON(data: RideData, metrics: CalculatedMetrics): void {
  const exportData = {
    timestamp: new Date().toISOString(),
    inputData: data,
    calculatedMetrics: metrics,
    summary: {
      sessionDate: new Date().toDateString(),
      totalEarnings: data.totalEarnings,
      ridesCompleted: data.ridesCompleted,
      onlineHours: metrics.onlineTime,
      utilizationRate: metrics.utilizationRate,
      earningsPerHour: metrics.earningsPerOnlineHour,
      performanceGrade: getPerformanceGrade(metrics),
    }
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, 'rideshare-analysis.json', 'application/json');
}

function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getPerformanceGrade(metrics: CalculatedMetrics): string {
  const score = (metrics.utilizationRate + metrics.acceptanceRate + Math.min(metrics.earningsPerOnlineHour * 4, 100)) / 3;
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function generatePDFReport(data: RideData, metrics: CalculatedMetrics): void {
  // Note: This would require a PDF library like jsPDF or Puppeteer
  // For now, we'll create a printable HTML version
  const reportContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Rideshare Performance Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .section { margin: 20px 0; }
        .metric { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
        .highlight { background-color: #f0f8ff; padding: 10px; border-left: 4px solid #007acc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Rideshare Performance Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="section">
        <h2>Session Summary</h2>
        <div class="highlight">
          <div class="metric"><span>Total Earnings:</span><span>$${data.totalEarnings.toFixed(2)}</span></div>
          <div class="metric"><span>Rides Completed:</span><span>${data.ridesCompleted}</span></div>
          <div class="metric"><span>Online Time:</span><span>${metrics.onlineTime.toFixed(2)} hours</span></div>
          <div class="metric"><span>Utilization Rate:</span><span>${metrics.utilizationRate.toFixed(1)}%</span></div>
        </div>
      </div>
      
      <div class="section">
        <h2>Key Performance Metrics</h2>
        <div class="metric"><span>Earnings per Hour:</span><span>$${metrics.earningsPerOnlineHour.toFixed(2)}</span></div>
        <div class="metric"><span>Earnings per Ride:</span><span>$${metrics.earningsPerRide.toFixed(2)}</span></div>
        <div class="metric"><span>Acceptance Rate:</span><span>${metrics.acceptanceRate.toFixed(1)}%</span></div>
        <div class="metric"><span>Average Speed:</span><span>${metrics.averageSpeedDuringBookedTime.toFixed(1)} mph</span></div>
        <div class="metric"><span>Rides per Hour:</span><span>${metrics.ridesPerOnlineHour.toFixed(2)}</span></div>
      </div>
      
      ${metrics.grossProfit !== undefined ? `
      <div class="section">
        <h2>Financial Analysis</h2>
        <div class="metric"><span>Gross Profit:</span><span>$${metrics.grossProfit.toFixed(2)}</span></div>
        <div class="metric"><span>Profit Margin:</span><span>${(metrics.profitMargin || 0).toFixed(1)}%</span></div>
        <div class="metric"><span>ROI:</span><span>${(metrics.returnOnInvestment || 0).toFixed(1)}%</span></div>
      </div>
      ` : ''}
    </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(reportContent);
    newWindow.document.close();
    newWindow.print();
  }
}