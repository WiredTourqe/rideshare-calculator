import { RideData, CalculatedMetrics } from '../types';

export function calculateBasicMetrics(data: RideData): CalculatedMetrics {
  const {
    totalEarnings,
    ridesCompleted,
    ridesRejected,
    onlineHours,
    onlineMinutes,
    bookedHours,
    bookedMinutes,
    bookedMiles,
    fuelCost = 0,
    maintenanceCost = 0,
    vehicleDepreciation = 0,
  } = data;

  // Convert times to decimal hours
  const onlineTime = onlineHours + (onlineMinutes / 60);
  const bookedTime = bookedHours + (bookedMinutes / 60);

  // Basic calculations
  const totalRequests = ridesCompleted + ridesRejected;
  const acceptanceRate = (ridesCompleted / totalRequests) * 100;
  const rejectionRate = (ridesRejected / totalRequests) * 100;
  const rejectionToAcceptanceRatio = ridesRejected / ridesCompleted;
  
  // Time metrics
  const averageBookedTimePerRide = (bookedTime / ridesCompleted) * 60; // minutes
  const averageOnlineTimePerRide = (onlineTime / ridesCompleted) * 60; // minutes
  const utilizationRate = (bookedTime / onlineTime) * 100;
  const totalIdleTime = onlineTime - bookedTime;
  const percentageTimeSpentWaiting = ((onlineTime - bookedTime) / onlineTime) * 100;
  const averageWaitingTimePerRide = ((onlineTime - bookedTime) / ridesCompleted) * 60; // minutes
  
  // Distance metrics
  const averageBookedMilesPerRide = bookedMiles / ridesCompleted;
  const averageSpeedDuringBookedTime = bookedMiles / bookedTime;
  
  // Earnings metrics
  const earningsPerRide = totalEarnings / ridesCompleted;
  const earningsPerBookedHour = totalEarnings / bookedTime;
  const earningsPerOnlineHour = totalEarnings / onlineTime;
  const earningsPerBookedMile = totalEarnings / bookedMiles;
  const earningsPerRequest = totalEarnings / totalRequests;
  const averageEarningsPerMinuteOnline = totalEarnings / (onlineTime * 60);
  const averageEarningsPerMinuteBooked = totalEarnings / (bookedTime * 60);
  const earningsPerIdleHour = totalEarnings / totalIdleTime;
  
  // Productivity metrics
  const ridesPerOnlineHour = ridesCompleted / onlineTime;
  const ridesPerBookedHour = ridesCompleted / bookedTime;
  const idleTimePerRide = (totalIdleTime / ridesCompleted) * 60; // minutes
  
  // Advanced financial metrics
  const totalOperatingCosts = fuelCost + maintenanceCost + vehicleDepreciation;
  const grossProfit = totalEarnings - totalOperatingCosts;
  const netProfit = grossProfit; // Could include taxes, etc.
  const profitMargin = (grossProfit / totalEarnings) * 100;
  const operatingCostPerMile = totalOperatingCosts / bookedMiles;
  const returnOnInvestment = (netProfit / totalOperatingCosts) * 100;

  return {
    totalRequests,
    acceptanceRate,
    rejectionRate,
    rejectionToAcceptanceRatio,
    onlineTime,
    bookedTime,
    averageBookedTimePerRide,
    averageOnlineTimePerRide,
    averageWaitingTimePerRide,
    utilizationRate,
    percentageTimeSpentWaiting,
    totalIdleTime,
    averageBookedMilesPerRide,
    averageSpeedDuringBookedTime,
    earningsPerRide,
    earningsPerBookedHour,
    earningsPerOnlineHour,
    earningsPerBookedMile,
    earningsPerRequest,
    averageEarningsPerMinuteOnline,
    averageEarningsPerMinuteBooked,
    earningsPerIdleHour,
    ridesPerOnlineHour,
    ridesPerBookedHour,
    idleTimePerRide,
    grossProfit,
    netProfit,
    profitMargin,
    operatingCostPerMile,
    returnOnInvestment,
  };
}