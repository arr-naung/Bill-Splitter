export interface BillItem {
    id: string;
    name: string;
    price: number;
    assignedTo: number[]; // Array of person indices (1-based to match peopleCount)
}

export interface PersonResult {
    personIndex: number;
    baseAmount: number;
    tipAmount: number;
    totalAmount: number;
    items: BillItem[];
}
