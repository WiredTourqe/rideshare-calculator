import { StatisticalAnalysis, TrendAnalysis, TimeSeriesData } from '../types';

export function calculateStatistics(data: number[]): StatisticalAnalysis {
  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }

  const sortedData = [...data].sort((a, b) => a - b);
  const n = data.length;
  
  // Mean
  const mean = data.reduce((sum, value) => sum + value, 0) / n;
  
  // Median
  const median = n % 2 === 0 
    ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
    : sortedData[Math.floor(n / 2)];
  
  // Variance and Standard Deviation
  const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
  const standardDeviation = Math.sqrt(variance);
  
  // 95% Confidence Interval (assuming normal distribution)
  const marginOfError = 1.96 * (standardDeviation / Math.sqrt(n));
  const confidenceInterval95: [number, number] = [mean - marginOfError, mean + marginOfError];
  
  // Outliers (using IQR method)
  const q1 = percentile(sortedData, 25);
  const q3 = percentile(sortedData, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = data.filter(value => value < lowerBound || value > upperBound);
  
  return {
    mean,
    median,
    standardDeviation,
    variance,
    confidenceInterval95,
    outliers,
  };
}

function percentile(sortedData: number[], percent: number): number {
  const index = (percent / 100) * (sortedData.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (upper >= sortedData.length) return sortedData[sortedData.length - 1];
  return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
}

export function calculateTrend(data: TimeSeriesData[]): TrendAnalysis {
  if (data.length < 2) {
    throw new Error('Need at least 2 data points for trend analysis');
  }

  const n = data.length;
  const xValues = data.map((_, index) => index);
  const yValues = data.map(d => d.value);
  
  // Linear regression
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Correlation coefficient
  const meanX = sumX / n;
  const meanY = sumY / n;
  const numerator = xValues.reduce((sum, x, i) => sum + (x - meanX) * (yValues[i] - meanY), 0);
  const denomX = Math.sqrt(xValues.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0));
  const denomY = Math.sqrt(yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0));
  const correlation = numerator / (denomX * denomY);
  
  // Forecast next 5 periods
  const forecast = Array.from({ length: 5 }, (_, i) => 
    slope * (n + i) + intercept
  );
  
  return {
    slope,
    intercept,
    correlation,
    forecast,
  };
}

export function detectSeasonality(data: TimeSeriesData[]): {
  dailyPattern: number[];
  weeklyPattern: number[];
  monthlyPattern: number[];
} {
  // Group data by hour of day, day of week, and month
  const hourlyGroups: { [key: number]: number[] } = {};
  const weeklyGroups: { [key: number]: number[] } = {};
  const monthlyGroups: { [key: number]: number[] } = {};
  
  data.forEach(d => {
    const hour = d.date.getHours();
    const dayOfWeek = d.date.getDay();
    const month = d.date.getMonth();
    
    if (!hourlyGroups[hour]) hourlyGroups[hour] = [];
    if (!weeklyGroups[dayOfWeek]) weeklyGroups[dayOfWeek] = [];
    if (!monthlyGroups[month]) monthlyGroups[month] = [];
    
    hourlyGroups[hour].push(d.value);
    weeklyGroups[dayOfWeek].push(d.value);
    monthlyGroups[month].push(d.value);
  });
  
  // Calculate averages for each period
  const dailyPattern = Array.from({ length: 24 }, (_, hour) => {
    const values = hourlyGroups[hour] || [];
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  });
  
  const weeklyPattern = Array.from({ length: 7 }, (_, day) => {
    const values = weeklyGroups[day] || [];
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  });
  
  const monthlyPattern = Array.from({ length: 12 }, (_, month) => {
    const values = monthlyGroups[month] || [];
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  });
  
  return {
    dailyPattern,
    weeklyPattern,
    monthlyPattern,
  };
}

export function calculateMovingAverage(data: number[], window: number): number[] {
  if (window > data.length) {
    throw new Error('Window size cannot be larger than data length');
  }
  
  const result: number[] = [];
  
  for (let i = window - 1; i < data.length; i++) {
    const slice = data.slice(i - window + 1, i + 1);
    const average = slice.reduce((sum, value) => sum + value, 0) / window;
    result.push(average);
  }
  
  return result;
}

export function calculateVolatility(data: number[]): number {
  if (data.length < 2) {
    return 0;
  }
  
  const returns = data.slice(1).map((value, i) => 
    (value - data[i]) / data[i]
  );
  
  const stats = calculateStatistics(returns);
  return stats.standardDeviation * Math.sqrt(252); // Annualized volatility
}