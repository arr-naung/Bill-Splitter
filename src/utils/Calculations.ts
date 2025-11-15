/**
 * Calculation utilities for Bill Splitter App
 * Handles tip calculations and currency formatting
 */

export interface CalculationResult {
  tipAmount: number;
  totalBill: number;
  perPerson: number;
}

/**
 * Calculate tip, total bill, and per-person amount
 * @param bill - The original bill amount
 * @param percentage - The tip percentage (0-100)
 * @param people - Number of people to split the bill
 * @returns Object containing tipAmount, totalBill, and perPerson
 */
export const calculateTip = (
  bill: number,
  percentage: number,
  people: number
): CalculationResult => {
  // Validate inputs
  const validBill = Math.max(0, bill);
  const validPercentage = Math.max(0, Math.min(percentage, 100));
  const validPeople = Math.max(1, people);

  // Calculate tip amount
  const tipAmount = (validBill * validPercentage) / 100;

  // Calculate total bill
  const totalBill = validBill + tipAmount;

  // Calculate per person amount
  const perPerson = totalBill / validPeople;

  return {
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    perPerson: Math.round(perPerson * 100) / 100,
  };
};

/**
 * Format a number as USD currency string
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$28.75")
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Calculate tip amount from bill and percentage
 * @param bill - The original bill amount
 * @param percentage - The tip percentage
 * @returns Formatted tip amount string
 */
export const calculateTipAmount = (bill: number, percentage: number): string => {
  const tipAmount = (bill * percentage) / 100;
  return formatCurrency(tipAmount);
};

export default { calculateTip, formatCurrency, calculateTipAmount };
