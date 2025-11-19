import { calculateTip, formatCurrency } from '../Calculations';

describe('Calculations', () => {
    describe('calculateTip', () => {
        it('should calculate tip correctly for standard input', () => {
            const result = calculateTip(100, 20, 1);
            expect(result).toEqual({
                tipAmount: 20,
                totalBill: 120,
                perPerson: 120,
            });
        });

        it('should calculate split correctly', () => {
            const result = calculateTip(100, 20, 4);
            expect(result).toEqual({
                tipAmount: 20,
                totalBill: 120,
                perPerson: 30,
            });
        });

        it('should handle zero bill', () => {
            const result = calculateTip(0, 20, 1);
            expect(result).toEqual({
                tipAmount: 0,
                totalBill: 0,
                perPerson: 0,
            });
        });

        it('should handle zero tip percentage', () => {
            const result = calculateTip(100, 0, 1);
            expect(result).toEqual({
                tipAmount: 0,
                totalBill: 100,
                perPerson: 100,
            });
        });

        it('should round to 2 decimal places correctly', () => {
            // $10.50 bill, 15% tip = $1.575 tip -> $1.58
            // Total = $12.08
            const result = calculateTip(10.5, 15, 1);
            expect(result).toEqual({
                tipAmount: 1.58,
                totalBill: 12.08,
                perPerson: 12.08,
            });
        });

        it('should handle split with rounding', () => {
            // $100 bill, 15% tip = $15 tip -> $115 total
            // 3 people -> $38.3333... -> $38.33
            const result = calculateTip(100, 15, 3);
            expect(result.perPerson).toBe(38.33);
        });

        it('should handle invalid inputs gracefully', () => {
            const result = calculateTip(-100, -20, 0);
            expect(result).toEqual({
                tipAmount: 0,
                totalBill: 0,
                perPerson: 0,
            });
        });
    });

    describe('formatCurrency', () => {
        it('should format integers correctly', () => {
            expect(formatCurrency(10)).toBe('$10.00');
        });

        it('should format decimals correctly', () => {
            expect(formatCurrency(10.5)).toBe('$10.50');
        });

        it('should format long decimals correctly', () => {
            expect(formatCurrency(10.123456)).toBe('$10.12');
        });

        it('should format zero correctly', () => {
            expect(formatCurrency(0)).toBe('$0.00');
        });
    });
});
