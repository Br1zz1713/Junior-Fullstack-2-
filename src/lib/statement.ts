import { z } from 'zod';
import Papa from 'papaparse';

// Zod Schema for validation
export const TransactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
  counterparty: z.string().min(1, 'Counterparty is required'),
  description: z.string(),
  amount: z.coerce.number(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export interface ParseResult {
  transactions: Transaction[];
  skippedRows: number;
  errors: Array<{ row: number; error: string }>;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netResult: number;
  transactionCount: number;
  topCounterparties: Array<{ name: string; amount: number }>;
}

export function parseCSV(csvText: string): ParseResult {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const transactions: Transaction[] = [];
  let skippedRows = 0;
  const errors: Array<{ row: number; error: string }> = [];

  // Assuming headers are exactly: date,counterparty,description,amount
  parsed.data.forEach((row, index) => {
    const result = TransactionSchema.safeParse(row);
    if (result.success) {
      transactions.push(result.data);
    } else {
      skippedRows++;
      errors.push({
        row: index + 1, // 1-indexed (ignoring header line for simplicity, or 2 if we count header)
        error: result.error.issues.map((e: any) => e.message).join(', '),
      });
    }
  });

  return { transactions, skippedRows, errors };
}

export function calculateSummary(transactions: Transaction[]): Summary {
  let totalIncome = 0;
  let totalExpense = 0;
  const expensesByCounterparty: Record<string, number> = {};

  transactions.forEach((tx) => {
    if (tx.amount > 0) {
      totalIncome += tx.amount;
    } else if (tx.amount < 0) {
      totalExpense += Math.abs(tx.amount);
      
      const cp = tx.counterparty;
      if (!expensesByCounterparty[cp]) {
        expensesByCounterparty[cp] = 0;
      }
      expensesByCounterparty[cp] += Math.abs(tx.amount);
    }
  });

  const topCounterparties = Object.entries(expensesByCounterparty)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }));

  return {
    totalIncome,
    totalExpense,
    netResult: totalIncome - totalExpense,
    transactionCount: transactions.length,
    topCounterparties,
  };
}
