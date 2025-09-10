import { CalculatedMetrics, PerformanceScorecard } from '../types';

export function calculatePerformanceScore(metrics: CalculatedMetrics): PerformanceScorecard {
  const recommendations: string[] = [];
  
  // Efficiency Score (0-100)
  let efficiencyScore = 0;
  
  // Utilization rate component (40% weight)
  const utilizationScore = Math.min(metrics.utilizationRate, 100) * 0.4;
  efficiencyScore += utilizationScore;
  
  // Acceptance rate component (30% weight)
  const acceptanceScore = Math.min(metrics.acceptanceRate, 100) * 0.3;
  efficiencyScore += acceptanceScore;
  
  // Speed component (30% weight) - optimal speed range 25-35 mph
  const speedScore = calculateSpeedScore(metrics.averageSpeedDuringBookedTime) * 0.3;
  efficiencyScore += speedScore;
  
  // Profitability Score (0-100)
  let profitabilityScore = 0;
  
  if (metrics.profitMargin !== undefined) {
    // Profit margin component (50% weight)
    const profitScore = Math.min(Math.max(metrics.profitMargin, 0), 100) * 0.5;
    profitabilityScore += profitScore;
    
    // Earnings per hour component (50% weight)
    const hourlyScore = Math.min(metrics.earningsPerOnlineHour / 25 * 100, 100) * 0.5;
    profitabilityScore += hourlyScore;
  } else {
    // Fallback to earnings per hour only
    profitabilityScore = Math.min(metrics.earningsPerOnlineHour / 25 * 100, 100);
  }
  
  // Consistency Score (0-100) - based on rides per hour
  const optimalRidesPerHour = 2.5;
  const consistencyScore = Math.max(0, 100 - Math.abs(metrics.ridesPerOnlineHour - optimalRidesPerHour) * 20);
  
  // Overall Score (weighted average)
  const overallScore = (efficiencyScore * 0.4 + profitabilityScore * 0.4 + consistencyScore * 0.2);
  
  // Generate recommendations
  generateRecommendations(metrics, recommendations);
  
  return {
    overallScore: Math.round(overallScore),
    efficiencyScore: Math.round(efficiencyScore),
    profitabilityScore: Math.round(profitabilityScore),
    consistencyScore: Math.round(consistencyScore),
    recommendations,
  };
}

function calculateSpeedScore(avgSpeed: number): number {
  // Optimal speed range: 25-35 mph
  if (avgSpeed >= 25 && avgSpeed <= 35) {
    return 100;
  } else if (avgSpeed < 25) {
    // Penalty for too slow
    return Math.max(0, 100 - (25 - avgSpeed) * 4);
  } else {
    // Penalty for too fast
    return Math.max(0, 100 - (avgSpeed - 35) * 3);
  }
}

function generateRecommendations(metrics: CalculatedMetrics, recommendations: string[]): void {
  // Utilization recommendations
  if (metrics.utilizationRate < 60) {
    recommendations.push(`Low utilization rate (${metrics.utilizationRate.toFixed(1)}%). Consider working during peak hours or in high-demand areas.`);
  }
  
  // Acceptance rate recommendations
  if (metrics.acceptanceRate < 80) {
    recommendations.push(`Low acceptance rate (${metrics.acceptanceRate.toFixed(1)}%). Review your ride selection criteria to optimize earnings.`);
  }
  
  // Speed recommendations
  if (metrics.averageSpeedDuringBookedTime < 20) {
    recommendations.push(`Average speed is low (${metrics.averageSpeedDuringBookedTime.toFixed(1)} mph). Focus on highway routes and avoid heavy traffic areas.`);
  } else if (metrics.averageSpeedDuringBookedTime > 40) {
    recommendations.push(`Average speed is high (${metrics.averageSpeedDuringBookedTime.toFixed(1)} mph). Consider safety and fuel efficiency.`);
  }
  
  // Earnings recommendations
  if (metrics.earningsPerOnlineHour < 15) {
    recommendations.push(`Low hourly earnings ($${metrics.earningsPerOnlineHour.toFixed(2)}/hour). Consider working during surge periods or in higher-paying markets.`);
  }
  
  // Ride frequency recommendations
  if (metrics.ridesPerOnlineHour < 1.5) {
    recommendations.push(`Low ride frequency (${metrics.ridesPerOnlineHour.toFixed(1)} rides/hour). Position yourself in busier areas or adjust your timing.`);
  }
  
  // Waiting time recommendations
  if (metrics.percentageTimeSpentWaiting > 50) {
    recommendations.push(`High waiting time (${metrics.percentageTimeSpentWaiting.toFixed(1)}% of online time). Consider relocating to areas with higher demand.`);
  }
  
  // Profitability recommendations
  if (metrics.profitMargin !== undefined && metrics.profitMargin < 20) {
    recommendations.push(`Low profit margin (${metrics.profitMargin.toFixed(1)}%). Review your operating costs and consider more efficient routes.`);
  }
  
  // Distance efficiency recommendations
  if (metrics.averageBookedMilesPerRide < 3) {
    recommendations.push(`Short rides (${metrics.averageBookedMilesPerRide.toFixed(1)} miles avg). Consider declining very short rides for better efficiency.`);
  } else if (metrics.averageBookedMilesPerRide > 15) {
    recommendations.push(`Long rides (${metrics.averageBookedMilesPerRide.toFixed(1)} miles avg). Ensure long trips are profitable and consider return positioning.`);
  }
  
  // Add positive reinforcement for good metrics
  if (metrics.utilizationRate > 80) {
    recommendations.push(`Excellent utilization rate! You're maximizing your online time effectively.`);
  }
  
  if (metrics.acceptanceRate > 90) {
    recommendations.push(`Great acceptance rate! You're maintaining good platform standing.`);
  }
  
  if (metrics.earningsPerOnlineHour > 25) {
    recommendations.push(`Strong earnings performance! Keep focusing on high-value opportunities.`);
  }
}