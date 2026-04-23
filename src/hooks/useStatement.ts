import { useState, useMemo } from 'react';
import { Transaction, ParseResult, Summary, calculateSummary } from '@/lib/statement';

export type FilterType = 'All' | 'Income' | 'Expense';

export function useStatement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [skippedRows, setSkippedRows] = useState<number>(0);
  const [errors, setErrors] = useState<ParseResult['errors']>([]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleParseResult = (result: ParseResult) => {
    setTransactions(result.transactions);
    setSkippedRows(result.skippedRows);
    setErrors(result.errors);
  };

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    // Apply Type Filter
    if (filter === 'Income') {
      result = result.filter(tx => tx.amount > 0);
    } else if (filter === 'Expense') {
      result = result.filter(tx => tx.amount < 0);
    }

    // Apply Search Query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.trim().toLowerCase();
      result = result.filter(tx => 
        tx.counterparty.toLowerCase().includes(lowerQuery) || 
        tx.description.toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [transactions, filter, searchQuery]);

  const summary: Summary = useMemo(() => {
    // Requirements: Summary calculations might need to be done on the full parsed transactions,
    // or on the filtered transactions? The prompt says: "Картки підсумків: Загальний дохід, Загальна витрата, Чистий результат, Кількість транзакцій".
    // Usually summaries change when filtering, let's base it on filteredTransactions.
    return calculateSummary(filteredTransactions);
  }, [filteredTransactions]);

  const reset = () => {
    setTransactions([]);
    setSkippedRows(0);
    setErrors([]);
    setFilter('All');
    setSearchQuery('');
  };

  return {
    transactions: filteredTransactions,
    rawTransactionsCount: transactions.length,
    skippedRows,
    errors,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    summary,
    handleParseResult,
    reset,
  };
}
