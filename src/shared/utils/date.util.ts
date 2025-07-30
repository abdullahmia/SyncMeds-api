// Format date as "MMM DD, YYYY" (e.g., "Jan 15, 2023")
export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
