import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { CalculatedMetrics } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DataVisualizationProps {
  metrics: CalculatedMetrics;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ metrics }) => {
  // Earnings breakdown chart
  const earningsData = {
    labels: ['Per Ride', 'Per Hour (Online)', 'Per Hour (Booked)', 'Per Mile'],
    datasets: [
      {
        label: 'Earnings ($)',
        data: [
          metrics.earningsPerRide,
          metrics.earningsPerOnlineHour,
          metrics.earningsPerBookedHour,
          metrics.earningsPerBookedMile,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Time distribution chart
  const timeData = {
    labels: ['Booked Time', 'Idle Time'],
    datasets: [
      {
        data: [metrics.bookedTime, metrics.totalIdleTime],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Performance metrics radar-style visualization using bar chart
  const performanceData = {
    labels: ['Utilization %', 'Acceptance %', 'Efficiency Score', 'Hourly Rate'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          metrics.utilizationRate,
          metrics.acceptanceRate,
          Math.min(metrics.ridesPerOnlineHour * 30, 100), // Normalized efficiency score
          Math.min(metrics.earningsPerOnlineHour * 4, 100), // Normalized hourly rate
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Productivity timeline (simulated data for demonstration)
  const productivityData = {
    labels: ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6', 'Hour 7', 'Hour 8'],
    datasets: [
      {
        label: 'Rides per Hour',
        data: [
          metrics.ridesPerOnlineHour * 0.8,
          metrics.ridesPerOnlineHour * 1.2,
          metrics.ridesPerOnlineHour * 0.9,
          metrics.ridesPerOnlineHour * 1.1,
          metrics.ridesPerOnlineHour * 1.3,
          metrics.ridesPerOnlineHour * 0.7,
          metrics.ridesPerOnlineHour * 1.0,
          metrics.ridesPerOnlineHour * 0.95,
        ],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Earnings per Hour',
        data: [
          metrics.earningsPerOnlineHour * 0.7,
          metrics.earningsPerOnlineHour * 1.1,
          metrics.earningsPerOnlineHour * 0.9,
          metrics.earningsPerOnlineHour * 1.2,
          metrics.earningsPerOnlineHour * 1.4,
          metrics.earningsPerOnlineHour * 0.8,
          metrics.earningsPerOnlineHour * 1.0,
          metrics.earningsPerOnlineHour * 1.05,
        ],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Analytics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Time Distribution',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Hourly Performance Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Data Visualization</h2>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
          <div className="h-80">
            <Bar data={earningsData} options={chartOptions} />
          </div>
        </div>

        {/* Time Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Distribution</h3>
          <div className="h-80">
            <Doughnut data={timeData} options={doughnutOptions} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Utilization Rate: <span className="font-semibold">{metrics.utilizationRate.toFixed(1)}%</span></p>
            <p>Total Online: <span className="font-semibold">{metrics.onlineTime.toFixed(1)} hours</span></p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-80">
          <Bar data={performanceData} options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: 'Normalized Performance Metrics (0-100 Scale)',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
              },
            },
          }} />
        </div>
      </div>

      {/* Productivity Timeline */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Timeline</h3>
        <div className="h-80">
          <Line data={productivityData} options={lineChartOptions} />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>This chart shows simulated hourly performance data based on your averages.</p>
          <p>Track actual hourly data for more precise analysis.</p>
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Efficiency Rating</h4>
          <div className="text-3xl font-bold text-blue-600">
            {((metrics.utilizationRate + metrics.acceptanceRate) / 2).toFixed(0)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">Combined efficiency score</p>
        </div>

        <div className="card text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Revenue Rate</h4>
          <div className="text-3xl font-bold text-green-600">
            ${metrics.earningsPerOnlineHour.toFixed(0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Per online hour</p>
        </div>

        <div className="card text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Activity Level</h4>
          <div className="text-3xl font-bold text-purple-600">
            {metrics.ridesPerOnlineHour.toFixed(1)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Rides per hour</p>
        </div>

        <div className="card text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Trip Distance</h4>
          <div className="text-3xl font-bold text-orange-600">
            {metrics.averageBookedMilesPerRide.toFixed(1)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Miles per ride</p>
        </div>
      </div>
    </div>
  );
};