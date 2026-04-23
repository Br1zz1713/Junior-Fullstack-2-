import { describe, it, expect } from 'vitest';
import { calculateSummary, Transaction } from './statement';

describe('calculateSummary', () => {
  it('correctly calculates totals and top counterparties', () => {
    const mockTransactions: Transaction[] = [
      { date: '2025-01-15', counterparty: 'ТОВ "Альфа"', description: 'Оплата за послуги', amount: 15000.00 },
      { date: '2025-01-16', counterparty: 'ФОП Петренко', description: 'Повернення депозиту', amount: -5000.00 },
      { date: '2025-01-18', counterparty: 'Сільпо', description: 'Канцтовари', amount: -1250.50 },
      { date: '2025-01-19', counterparty: 'Сільпо', description: 'Продукти', amount: -3000.00 },
      { date: '2025-01-20', counterparty: 'Нова Пошта', description: 'Доставка', amount: -500.00 },
      { date: '2025-01-21', counterparty: 'Укрзалізниця', description: 'Квитки', amount: -1500.00 },
      { date: '2025-01-22', counterparty: 'Розетка', description: 'Техніка', amount: -10000.00 },
      { date: '2025-01-23', counterparty: 'ФОП Петренко', description: 'Ремонт', amount: -2000.00 },
    ];

    const summary = calculateSummary(mockTransactions);

    expect(summary.totalIncome).toBe(15000.00);
    expect(summary.totalExpense).toBe(23250.50); // 5000 + 1250.5 + 3000 + 500 + 1500 + 10000 + 2000
    expect(summary.netResult).toBe(-8250.50); // 15000 - 23250.5
    expect(summary.transactionCount).toBe(8);

    // Top counterparties by expense
    // 1. Розетка: 10000
    // 2. ФОП Петренко: 7000
    // 3. Сільпо: 4250.5
    // 4. Укрзалізниця: 1500
    // 5. Нова Пошта: 500
    expect(summary.topCounterparties).toHaveLength(5);
    expect(summary.topCounterparties[0]).toEqual({ name: 'Розетка', amount: 10000 });
    expect(summary.topCounterparties[1]).toEqual({ name: 'ФОП Петренко', amount: 7000 });
    expect(summary.topCounterparties[2]).toEqual({ name: 'Сільпо', amount: 4250.5 });
    expect(summary.topCounterparties[3]).toEqual({ name: 'Укрзалізниця', amount: 1500 });
    expect(summary.topCounterparties[4]).toEqual({ name: 'Нова Пошта', amount: 500 });
  });
});
