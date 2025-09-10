import React from 'react';
import { CalculatedMetrics, RideData } from '../types';
import { exportToCSV, exportToJSON, generatePDFReport } from '../utils/export';

interface AdvancedAnalyticsProps {
  metrics: CalculatedMetrics;
  rideData: RideData;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ metrics, rideData }) => {

  // Market comparison data (simulated)
  const marketBenchmarks = {
    averageEarningsPerHour: 22.50,
    averageUtilizationRate: 65,
    averageAcceptanceRate: 85,
    averageRidesPerHour: 2.1,
    averageSpeed: 18.5,
  };

  const calculatePerformanceVsMarket = () => {
    return {
      earningsPerHour: ((metrics.earningsPerOnlineHour / marketBenchmarks.averageEarningsPerHour - 1) * 100),
      utilizationRate: ((metrics.utilizationRate / marketBenchmarks.averageUtilizationRate - 1) * 100),
      acceptanceRate: ((metrics.acceptanceRate / marketBenchmarks.averageAcceptanceRate - 1) * 100),
      ridesPerHour: ((metrics.ridesPerOnlineHour / marketBenchmarks.averageRidesPerHour - 1) * 100),
      speed: ((metrics.averageSpeedDuringBookedTime / marketBenchmarks.averageSpeed - 1) * 100),
    };
  };

  const marketComparison = calculatePerformanceVsMarket();

  const getComparisonColor = (value: number) => {
    if (value > 10) return 'text-green-600';
    if (value > 0) return 'text-green-500';
    if (value > -10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComparisonIcon = (value: number) => {
    if (value > 5) return '📈';
    if (value > 0) return '↗️';
    if (value > -5) return '↘️';
    return '📉';
  };

  // Optimization suggestions based on performance
  const getOptimizationSuggestions = () => {
    const suggestions = [];

    if (metrics.utilizationRate < 70) {
      suggestions.push({
        category: 'Time Management',
        suggestion: 'Increase utilization by working during peak hours (7-9 AM, 5-8 PM, 11 PM-2 AM)',
        impact: 'High',
        estimatedIncrease: `+$${((70 - metrics.utilizationRate) * 0.3 * metrics.earningsPerOnlineHour / 100).toFixed(0)}/hour`
      });
    }

    if (metrics.averageSpeedDuringBookedTime < 20) {
      suggestions.push({
        category: 'Route Optimization',
        suggestion: 'Focus on highway routes and avoid downtown traffic during rush hours',
        impact: 'Medium',
        estimatedIncrease: '+15% efficiency'
      });
    }

    if (metrics.acceptanceRate < 85) {
      suggestions.push({
        category: 'Request Strategy',
        suggestion: 'Consider accepting more rides to improve platform standing and earnings',
        impact: 'Medium',
        estimatedIncrease: `+${((85 - metrics.acceptanceRate) * 0.1).toFixed(0)} rides/day`
      });
    }

    if (metrics.averageBookedMilesPerRide > 10) {
      suggestions.push({
        category: 'Trip Selection',
        suggestion: 'Balance long trips with shorter rides to optimize turnaround time',
        impact: 'Medium',
        estimatedIncrease: '+10% ride frequency'
      });
    }

    return suggestions;
  };

  const optimizationSuggestions = getOptimizationSuggestions();

  // Financial projections
  const calculateProjections = () => {
    const dailyEarnings = metrics.earningsPerOnlineHour * metrics.onlineTime;
    const weeklyEarnings = dailyEarnings * 5; // Assuming 5 days per week
    const monthlyEarnings = weeklyEarnings * 4.33; // Average weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      daily: dailyEarnings,
      weekly: weeklyEarnings,
      monthly: monthlyEarnings,
      yearly: yearlyEarnings,
    };
  };

  const projections = calculateProjections();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔬 Advanced Analytics</h2>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Export & Reports</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => exportToCSV(rideData, metrics)}
            className="btn-secondary"
          >
            📄 Export CSV
          </button>
          <button
            onClick={() => exportToJSON(rideData, metrics)}
            className="btn-secondary"
          >
            💾 Export JSON
          </button>
          <button
            onClick={() => generatePDFReport(rideData, metrics)}
            className="btn-secondary"
          >
            📋 Print Report
          </button>
        </div>
      </div>

      {/* Market Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Market Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Earnings per Hour</span>
              <span className="text-lg">{getComparisonIcon(marketComparison.earningsPerHour)}</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">
                ${metrics.earningsPerOnlineHour.toFixed(2)}
              </div>
              <div className={`text-sm ${getComparisonColor(marketComparison.earningsPerHour)}`}>
                {marketComparison.earningsPerHour > 0 ? '+' : ''}{marketComparison.earningsPerHour.toFixed(1)}% vs market
              </div>
              <div className="text-xs text-gray-500">Market avg: ${marketBenchmarks.averageEarningsPerHour}</div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Utilization Rate</span>
              <span className="text-lg">{getComparisonIcon(marketComparison.utilizationRate)}</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.utilizationRate.toFixed(1)}%
              </div>
              <div className={`text-sm ${getComparisonColor(marketComparison.utilizationRate)}`}>
                {marketComparison.utilizationRate > 0 ? '+' : ''}{marketComparison.utilizationRate.toFixed(1)}% vs market
              </div>
              <div className="text-xs text-gray-500">Market avg: {marketBenchmarks.averageUtilizationRate}%</div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Acceptance Rate</span>
              <span className="text-lg">{getComparisonIcon(marketComparison.acceptanceRate)}</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.acceptanceRate.toFixed(1)}%
              </div>
              <div className={`text-sm ${getComparisonColor(marketComparison.acceptanceRate)}`}>
                {marketComparison.acceptanceRate > 0 ? '+' : ''}{marketComparison.acceptanceRate.toFixed(1)}% vs market
              </div>
              <div className="text-xs text-gray-500">Market avg: {marketBenchmarks.averageAcceptanceRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Projections */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Earnings Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 font-medium">Today</div>
            <div className="text-2xl font-bold text-green-600">
              ${projections.daily.toFixed(0)}
            </div>
            <div className="text-xs text-green-600">Based on current session</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-700 font-medium">This Week</div>
            <div className="text-2xl font-bold text-blue-600">
              ${projections.weekly.toFixed(0)}
            </div>
            <div className="text-xs text-blue-600">5 days at current rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-700 font-medium">This Month</div>
            <div className="text-2xl font-bold text-purple-600">
              ${projections.monthly.toFixed(0)}
            </div>
            <div className="text-xs text-purple-600">20 days at current rate</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm text-orange-700 font-medium">This Year</div>
            <div className="text-2xl font-bold text-orange-600">
              ${projections.yearly.toFixed(0)}
            </div>
            <div className="text-xs text-orange-600">240 days at current rate</div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Optimization Strategies</h3>
        <div className="space-y-4">
          {optimizationSuggestions.map((suggestion, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">{suggestion.category}</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  suggestion.impact === 'High' ? 'bg-red-100 text-red-800' :
                  suggestion.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {suggestion.impact} Impact
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-2">{suggestion.suggestion}</p>
              <div className="text-sm font-medium text-blue-600">
                Potential improvement: {suggestion.estimatedIncrease}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔬 Advanced Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Efficiency Index</div>
            <div className="text-2xl font-bold text-gray-900">
              {(metrics.utilizationRate * metrics.acceptanceRate / 100).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Utilization × Acceptance Rate</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Revenue Velocity</div>
            <div className="text-2xl font-bold text-gray-900">
              ${(metrics.earningsPerRide * metrics.ridesPerOnlineHour).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Earnings/ride × Rides/hour</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Time Efficiency</div>
            <div className="text-2xl font-bold text-gray-900">
              {(metrics.bookedTime / (metrics.bookedTime + metrics.totalIdleTime) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Productive time ratio</div>
          </div>
        </div>
      </div>
    </div>
  );
};