/**
 * Formats a number as currency
 * @param amount The amount to format (number or string)
 * @param options Optional formatting options
 * @returns Formatted currency string (e.g., "$10.99")
 */
export function formatCurrency(
  amount: number | string,
  options: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  // Convert string input to number if needed
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Default options
  const {
    locale = "en-US",
    currency = "USD",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return "$0.00";
  }

  // Create formatter
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(numericAmount);
}

// Optional: Specific currency formatters if you need them frequently
export const formatUSD = (amount: number | string) =>
  formatCurrency(amount, { currency: "USD" });

export const formatLKR = (amount: number | string) =>
  formatCurrency(amount, { currency: "LKR", minimumFractionDigits: 0 });
