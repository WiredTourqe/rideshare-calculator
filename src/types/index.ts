export interface RideData {
  totalEarnings: number;
  ridesCompleted: number;
  ridesRejected: number;
  onlineHours: number;
  onlineMinutes: number;
  bookedHours: number;
  bookedMinutes: number;
  bookedMiles: number;
  fuelCost?: number;
  maintenanceCost?: number;
  vehicleDepreciation?: number;
  date?: Date;
}

export interface CalculatedMetrics {
  // Basic metrics
  totalRequests: number;
  acceptanceRate: number;
  rejectionRate: number;
  rejectionToAcceptanceRatio: number;
  
  // Time metrics
  onlineTime: number;
  bookedTime: number;
  averageBookedTimePerRide: number;
  averageOnlineTimePerRide: number;
  averageWaitingTimePerRide: number;
  utilizationRate: number;
  percentageTimeSpentWaiting: number;
  totalIdleTime: number;
  
  // Distance metrics
  averageBookedMilesPerRide: number;
  averageSpeedDuringBookedTime: number;
  
  // Earnings metrics
  earningsPerRide: number;
  earningsPerBookedHour: number;
  earningsPerOnlineHour: number;
  earningsPerBookedMile: number;
  earningsPerRequest: number;
  averageEarningsPerMinuteOnline: number;
  averageEarningsPerMinuteBooked: number;
  earningsPerIdleHour: number;
  
  // Productivity metrics
  ridesPerOnlineHour: number;
  ridesPerBookedHour: number;
  idleTimePerRide: number;
  
  // Advanced financial metrics
  grossProfit?: number;
  netProfit?: number;
  profitMargin?: number;
  operatingCostPerMile?: number;
  returnOnInvestment?: number;
}

export interface StatisticalAnalysis {
  mean: number;
  median: number;
  standardDeviation: number;
  variance: number;
  confidenceInterval95: [number, number];
  outliers: number[];
}

export interface TrendAnalysis {
  slope: number;
  intercept: number;
  correlation: number;
  forecast: number[];
  seasonality?: {
    dailyPattern: number[];
    weeklyPattern: number[];
    monthlyPattern: number[];
  };
}

export interface PerformanceScorecard {
  overallScore: number;
  efficiencyScore: number;
  profitabilityScore: number;
  consistencyScore: number;
  recommendations: string[];
}

export interface TimeSeriesData {
  date: Date;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface MarketConditions {
  demandLevel: 'low' | 'medium' | 'high';
  surgeMultiplier: number;
  competitorActivity: number;
  weatherImpact: number;
  eventImpact: number;
}