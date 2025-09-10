import React from 'react';
import { CalculatedMetrics } from '../types';

interface MetricsDashboardProps {
  metrics: CalculatedMetrics;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  category: 'earnings' | 'time' | 'distance' | 'productivity' | 'financial';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, description, trend, category }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'earnings': return 'border-green-200 bg-green-50';
      case 'time': return 'border-blue-200 bg-blue-50';
      case 'distance': return 'border-purple-200 bg-purple-50';
      case 'productivity': return 'border-orange-200 bg-orange-50';
      case 'financial': return 'border-indigo-200 bg-indigo-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '';
  };

  return (
    <div className={`metric-card ${getCategoryColor(category)}`} title={description}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toFixed(2) : value}
            </span>
            {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
          </div>
        </div>
        {trend && (
          <span className="text-lg">{getTrendIcon()}</span>
        )}
      </div>
    </div>
  );
};

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics }) => {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Earnings per Hour"
            value={formatCurrency(metrics.earningsPerOnlineHour)}
            category="earnings"
            description="Total earnings divided by online time"
          />
          <MetricCard
            title="Utilization Rate"
            value={formatPercent(metrics.utilizationRate)}
            category="time"
            description="Percentage of online time spent on rides"
          />
          <MetricCard
            title="Acceptance Rate"
            value={formatPercent(metrics.acceptanceRate)}
            category="productivity"
            description="Percentage of ride requests accepted"
          />
          <MetricCard
            title="Rides per Hour"
            value={metrics.ridesPerOnlineHour.toFixed(1)}
            unit="rides/hr"
            category="productivity"
            description="Average number of rides completed per online hour"
          />
        </div>
      </div>

      {/* Earnings Metrics */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Earnings Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Total Earnings"
            value={formatCurrency(metrics.earningsPerRide * metrics.totalRequests * (metrics.acceptanceRate / 100))}
            category="earnings"
            description="Total amount earned during this period"
          />
          <MetricCard
            title="Earnings per Ride"
            value={formatCurrency(metrics.earningsPerRide)}
            category="earnings"
            description="Average earnings per completed ride"
          />
          <MetricCard
            title="Earnings per Mile"
            value={formatCurrency(metrics.earningsPerBookedMile)}
            category="earnings"
            description="Earnings per mile driven with passengers"
          />
          <MetricCard
            title="Earnings per Request"
            value={formatCurrency(metrics.earningsPerRequest)}
            category="earnings"
            description="Average earnings per ride request (including rejected)"
          />
          <MetricCard
            title="Per Minute (Online)"
            value={formatCurrency(metrics.averageEarningsPerMinuteOnline)}
            category="earnings"
            description="Earnings per minute while online"
          />
          <MetricCard
            title="Per Minute (Booked)"
            value={formatCurrency(metrics.averageEarningsPerMinuteBooked)}
            category="earnings"
            description="Earnings per minute while on trips"
          />
        </div>
      </div>

      {/* Time Efficiency */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">⏱️ Time Efficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Total Online Time"
            value={metrics.onlineTime.toFixed(1)}
            unit="hours"
            category="time"
            description="Total time spent online"
          />
          <MetricCard
            title="Total Booked Time"
            value={metrics.bookedTime.toFixed(1)}
            unit="hours"
            category="time"
            description="Total time spent on rides"
          />
          <MetricCard
            title="Idle Time"
            value={metrics.totalIdleTime.toFixed(1)}
            unit="hours"
            category="time"
            description="Time spent waiting for rides"
          />
          <MetricCard
            title="Avg. Time per Ride"
            value={formatTime(metrics.averageBookedTimePerRide)}
            category="time"
            description="Average duration of each ride"
          />
          <MetricCard
            title="Avg. Wait Time"
            value={formatTime(metrics.averageWaitingTimePerRide)}
            category="time"
            description="Average waiting time between rides"
          />
          <MetricCard
            title="Time Waiting"
            value={formatPercent(metrics.percentageTimeSpentWaiting)}
            category="time"
            description="Percentage of online time spent waiting"
          />
        </div>
      </div>

      {/* Distance & Speed */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🚗 Distance & Speed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Avg. Miles per Ride"
            value={metrics.averageBookedMilesPerRide.toFixed(1)}
            unit="miles"
            category="distance"
            description="Average distance per completed ride"
          />
          <MetricCard
            title="Average Speed"
            value={metrics.averageSpeedDuringBookedTime.toFixed(1)}
            unit="mph"
            category="distance"
            description="Average speed during booked rides"
          />
          <MetricCard
            title="Total Distance"
            value={(metrics.averageBookedMilesPerRide * (metrics.totalRequests * metrics.acceptanceRate / 100)).toFixed(1)}
            unit="miles"
            category="distance"
            description="Total miles driven with passengers"
          />
        </div>
      </div>

      {/* Request Management */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📱 Request Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Requests"
            value={metrics.totalRequests}
            category="productivity"
            description="Total number of ride requests received"
          />
          <MetricCard
            title="Completed Rides"
            value={Math.round(metrics.totalRequests * metrics.acceptanceRate / 100)}
            category="productivity"
            description="Number of rides successfully completed"
          />
          <MetricCard
            title="Rejection Rate"
            value={formatPercent(metrics.rejectionRate)}
            category="productivity"
            description="Percentage of ride requests rejected"
          />
          <MetricCard
            title="Rejection Ratio"
            value={metrics.rejectionToAcceptanceRatio.toFixed(2)}
            unit="to 1"
            category="productivity"
            description="Ratio of rejected to accepted rides"
          />
        </div>
      </div>

      {/* Advanced Financial Metrics */}
      {metrics.grossProfit !== undefined && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Financial Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Gross Profit"
              value={formatCurrency(metrics.grossProfit)}
              category="financial"
              description="Total earnings minus operating costs"
            />
            <MetricCard
              title="Net Profit"
              value={formatCurrency(metrics.netProfit || 0)}
              category="financial"
              description="Profit after all expenses"
            />
            <MetricCard
              title="Profit Margin"
              value={formatPercent(metrics.profitMargin || 0)}
              category="financial"
              description="Percentage of earnings retained as profit"
            />
            <MetricCard
              title="Cost per Mile"
              value={formatCurrency(metrics.operatingCostPerMile || 0)}
              category="financial"
              description="Operating cost per mile driven"
            />
            <MetricCard
              title="ROI"
              value={formatPercent(metrics.returnOnInvestment || 0)}
              category="financial"
              description="Return on investment percentage"
            />
          </div>
        </div>
      )}
    </div>
  );
};