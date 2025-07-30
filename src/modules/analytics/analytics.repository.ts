import { db } from "@/core/database/prisma.client";

export const getTodaySales = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const total = await db.sale.aggregate({
    _sum: { total_amount: true },
    where: { created_at: { gte: start, lte: end } },
  });

  return total._sum.total_amount || 0;
};

export const getMonthlyRevenue = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const total = await db.sale.aggregate({
    _sum: { total_amount: true },
    where: { created_at: { gte: startOfMonth, lte: endOfMonth } },
  });

  return total._sum.total_amount || 0;
};

export const getStockAlerts = async () => {
  const alerts = await db.inventory.findMany({
    where: {
      quantity: { lte: 5 },
    },
    include: {
      product: true,
    },
  });

  return alerts;
};

export const getExpiringSoon = async () => {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setMonth(now.getMonth() + 1);

  const expiring = await db.inventory.findMany({
    where: {
      expiry_date: {
        gte: now,
        lte: thresholdDate,
      },
    },
    include: {
      product: true,
    },
  });

  return expiring;
};

export const getSalesTrend = async () => {
  try {
    const sales = await db.$queryRaw<{ date: Date; total: number }[]>`
      SELECT 
        DATE_TRUNC('day', created_at) AS date,
        SUM(total_amount)::float AS total
      FROM sales
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC;
    `;

    return sales;
  } catch (error) {
    console.error("❌ Error in getSalesTrend:", error);
    throw error;
  }
};

export const getRecentSales = async () => {
  return await db.sale.findMany({
    orderBy: { created_at: "desc" },
    take: 10,
    include: {
      customer: true,
    },
  });
};
