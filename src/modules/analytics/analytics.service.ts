import * as analyticsRepository from "./analytics.repository";

export const getDashboardStats = async () => {
  const [todaySales, monthlyRevenue, stockAlerts, expiringSoon] =
    await Promise.all([
      analyticsRepository.getTodaySales(),
      analyticsRepository.getMonthlyRevenue(),
      analyticsRepository.getStockAlerts(),
      analyticsRepository.getExpiringSoon(),
    ]);

  return {
    todaySales,
    monthlyRevenue,
    stockAlertsCount: stockAlerts.length,
    expiringSoonCount: expiringSoon.length,
  };
};

export const getSalesTrend = async () => {
  return analyticsRepository.getSalesTrend();
};

export const getRecentSales = async () => {
  return analyticsRepository.getRecentSales();
};
