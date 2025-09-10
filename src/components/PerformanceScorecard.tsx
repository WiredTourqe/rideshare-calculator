import React from 'react';
import { PerformanceScorecard as ScoreData } from '../types';

interface PerformanceScorecardProps {
  scorecard: ScoreData;
}

interface ScoreBarProps {
  score: number;
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, label, color }) => {
  const getColorClasses = (color: 'green' | 'yellow' | 'red' | 'blue') => {
    const baseClasses: Record<string, string> = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
    };
    
    const backgroundClasses: Record<string, string> = {
      green: 'bg-green-100',
      yellow: 'bg-yellow-100',
      red: 'bg-red-100',
      blue: 'bg-blue-100',
    };

    return {
      bar: baseClasses[color],
      background: backgroundClasses[color],
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const actualColor = color === 'blue' ? 'blue' : getScoreColor(score);
  const colors = getColorClasses(actualColor);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full h-3 ${colors.background}`}>
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${colors.bar}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
};

export const PerformanceScorecard: React.FC<PerformanceScorecardProps> = ({ scorecard }) => {
  const getOverallGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', description: 'Exceptional Performance' };
    if (score >= 80) return { grade: 'A', description: 'Excellent Performance' };
    if (score >= 70) return { grade: 'B', description: 'Good Performance' };
    if (score >= 60) return { grade: 'C', description: 'Average Performance' };
    if (score >= 50) return { grade: 'D', description: 'Below Average' };
    return { grade: 'F', description: 'Needs Improvement' };
  };

  const overall = getOverallGrade(scorecard.overallScore);

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Scorecard</h2>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold mb-2">
          {overall.grade}
        </div>
        <p className="text-lg font-medium text-gray-700">{overall.description}</p>
        <p className="text-3xl font-bold text-primary-600">{scorecard.overallScore}/100</p>
      </div>

      <div className="space-y-4 mb-8">
        <ScoreBar
          score={scorecard.overallScore}
          label="Overall Performance"
          color="blue"
        />
        <ScoreBar
          score={scorecard.efficiencyScore}
          label="Efficiency Score"
          color="green"
        />
        <ScoreBar
          score={scorecard.profitabilityScore}
          label="Profitability Score"
          color="green"
        />
        <ScoreBar
          score={scorecard.consistencyScore}
          label="Consistency Score"
          color="green"
        />
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{scorecard.efficiencyScore}</div>
          <div className="text-sm text-blue-700 font-medium">Efficiency</div>
          <div className="text-xs text-blue-600 mt-1">Utilization, acceptance rate, speed optimization</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{scorecard.profitabilityScore}</div>
          <div className="text-sm text-green-700 font-medium">Profitability</div>
          <div className="text-xs text-green-600 mt-1">Earnings per hour, profit margins</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{scorecard.consistencyScore}</div>
          <div className="text-sm text-orange-700 font-medium">Consistency</div>
          <div className="text-xs text-orange-600 mt-1">Steady ride frequency, predictable performance</div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Personalized Recommendations</h3>
        <div className="space-y-3">
          {scorecard.recommendations.map((recommendation, index) => {
            const isPositive = recommendation.includes('Excellent') || recommendation.includes('Great') || recommendation.includes('Strong');
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  isPositive
                    ? 'bg-green-50 border-green-400 text-green-800'
                    : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                }`}
              >
                <div className="flex items-start">
                  <span className="mr-2 text-lg">
                    {isPositive ? '✅' : '💡'}
                  </span>
                  <p className="text-sm leading-relaxed">{recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">📈 Performance Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Strengths:</h5>
            <ul className="space-y-1 text-gray-600">
              {scorecard.efficiencyScore >= 70 && <li>• High operational efficiency</li>}
              {scorecard.profitabilityScore >= 70 && <li>• Strong earning potential</li>}
              {scorecard.consistencyScore >= 70 && <li>• Consistent performance</li>}
              {scorecard.overallScore >= 80 && <li>• Above-average driver performance</li>}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Areas for Improvement:</h5>
            <ul className="space-y-1 text-gray-600">
              {scorecard.efficiencyScore < 70 && <li>• Optimize time and route efficiency</li>}
              {scorecard.profitabilityScore < 70 && <li>• Focus on increasing earnings</li>}
              {scorecard.consistencyScore < 70 && <li>• Improve ride frequency consistency</li>}
              {scorecard.overallScore < 60 && <li>• Review overall strategy and approach</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};