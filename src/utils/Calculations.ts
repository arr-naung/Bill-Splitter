/**
 * Calculation utilities for Bill Splitter App
 * Handles tip calculations and currency formatting
 */

export interface CalculationResult {
  tipAmount: number;
  totalBill: number;
  perPerson: number;
  itemizedResults?: import('../types').PersonResult[];
}

import { BillItem, PersonResult } from '../types';

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

/**
 * Calculate split based on itemized list
 * @param items - List of bill items
 * @param percentage - Tip percentage
 * @param peopleCount - Total number of people
 */
export const calculateItemizedSplit = (
  items: BillItem[],
  percentage: number,
  peopleCount: number
): { totalBill: number; tipAmount: number; results: PersonResult[] } => {
  const results: PersonResult[] = [];
  let totalBill = 0;

  // Initialize results for each person
  for (let i = 1; i <= peopleCount; i++) {
    results.push({
      personIndex: i,
      baseAmount: 0,
      tipAmount: 0,
      totalAmount: 0,
      items: [],
    });
  }

  // Distribute items
  items.forEach((item) => {
    totalBill += item.price;
    const splitCount = item.assignedTo.length;
    if (splitCount > 0) {
      const pricePerPerson = item.price / splitCount;
      item.assignedTo.forEach((personIndex) => {
        // Ensure person exists (in case people count was reduced)
        if (personIndex <= peopleCount) {
          const personResult = results[personIndex - 1];
          personResult.baseAmount += pricePerPerson;
          personResult.items.push(item);
        }
      });
    }
  });

  // Calculate tips and totals
  results.forEach((person) => {
    person.tipAmount = (person.baseAmount * percentage) / 100;
    person.totalAmount = person.baseAmount + person.tipAmount;
  });

  const totalTip = (totalBill * percentage) / 100;

  return {
    totalBill: totalBill + totalTip,
    tipAmount: totalTip,
    results,
  };
};

export default {
  calculateTip,
  formatCurrency,
  calculateTipAmount,
  calculateItemizedSplit,
};
