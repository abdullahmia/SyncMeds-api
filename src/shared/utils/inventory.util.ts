export function generateRandomInvoiceNumber(prefix = "INV") {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  const randomPart = Math.floor(100000 + Math.random() * 900000).toString();

  return `${prefix}-${datePart}-${randomPart}`;
}
