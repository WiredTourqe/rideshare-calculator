import { useState } from 'react';
import { DataInputForm } from './components/DataInputForm';
import { MetricsDashboard } from './components/MetricsDashboard';
import { PerformanceScorecard } from './components/PerformanceScorecard';
import { DataVisualization } from './components/DataVisualization';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { RideData, CalculatedMetrics, PerformanceScorecard as ScoreData } from './types';
import { calculateBasicMetrics } from './utils/calculations';
import { calculatePerformanceScore } from './utils/performance';

type TabType = 'input' | 'dashboard' | 'scorecard' | 'visualization' | 'analytics';

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('input');
  const [rideData, setRideData] = useState<RideData | null>(null);
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(null);
  const [scorecard, setScorecard] = useState<ScoreData | null>(null);

  const handleDataSubmit = (data: RideData) => {
    try {
      const calculatedMetrics = calculateBasicMetrics(data);
      const performanceScore = calculatePerformanceScore(calculatedMetrics);
      
      setRideData(data);
      setMetrics(calculatedMetrics);
      setScorecard(performanceScore);
      setCurrentTab('dashboard');
    } catch (error) {
      console.error('Error calculating metrics:', error);
      alert('Error calculating metrics. Please check your input data.');
    }
  };

  const resetData = () => {
    setRideData(null);
    setMetrics(null);
    setScorecard(null);
    setCurrentTab('input');
  };

  const tabs = [
    { id: 'input', label: 'Data Input', icon: '📝' },
    { id: 'dashboard', label: 'Metrics Dashboard', icon: '📊', disabled: !metrics },
    { id: 'scorecard', label: 'Performance Score', icon: '🏆', disabled: !scorecard },
    { id: 'visualization', label: 'Data Visualization', icon: '📈', disabled: !metrics },
    { id: 'analytics', label: 'Advanced Analytics', icon: '🔬', disabled: !metrics },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Advanced Rideshare Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive performance analysis and optimization platform
              </p>
            </div>
            {metrics && (
              <button
                onClick={resetData}
                className="btn-secondary"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setCurrentTab(tab.id as TabType)}
                disabled={tab.disabled}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  currentTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'input' && (
          <DataInputForm 
            onDataSubmit={handleDataSubmit}
            initialData={rideData || undefined}
          />
        )}

        {currentTab === 'dashboard' && metrics && (
          <div>
            {/* Quick Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Session Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(metrics.totalRequests * metrics.acceptanceRate / 100)}
                  </div>
                  <div className="text-sm text-primary-700">Rides Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${((metrics.earningsPerRide * metrics.totalRequests * metrics.acceptanceRate) / 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-green-700">Total Earnings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.onlineTime.toFixed(1)}h
                  </div>
                  <div className="text-sm text-blue-700">Online Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.utilizationRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-700">Utilization</div>
                </div>
              </div>
            </div>
            <MetricsDashboard metrics={metrics} />
          </div>
        )}

        {currentTab === 'scorecard' && scorecard && (
          <PerformanceScorecard scorecard={scorecard} />
        )}

        {currentTab === 'visualization' && metrics && (
          <DataVisualization metrics={metrics} />
        )}

        {currentTab === 'analytics' && metrics && rideData && (
          <AdvancedAnalytics metrics={metrics} rideData={rideData} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Advanced Rideshare Analytics - Professional Performance Optimization Platform
            </p>
            <p className="text-xs mt-2">
              Comprehensive metrics, statistical analysis, and actionable insights for rideshare drivers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;