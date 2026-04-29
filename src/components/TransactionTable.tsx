"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/lib/statement";

type SortDirection = "none" | "asc" | "desc";

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc")  return <ChevronUp className="w-4 h-4" />;
  if (direction === "desc") return <ChevronDown className="w-4 h-4" />;
  return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
}

const sortLabel: Record<SortDirection, string> = {
  none: "без сортування",
  asc:  "А → Я",
  desc: "Я → А",
};

const ariaSortMap: Record<SortDirection, React.AriaAttributes["aria-sort"]> = {
  none: "none",
  asc:  "ascending",
  desc: "descending",
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [counterpartySortDir, setCounterpartySortDir] = useState<SortDirection>("none");

  const handleCounterpartySort = () => {
    setCounterpartySortDir((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc")  return "desc";
      return "none";
    });
  };

  const sortedTransactions = useMemo(() => {
    if (counterpartySortDir === "none") return transactions;
    return [...transactions].sort((a, b) => {
      const cmp = a.counterparty.localeCompare(b.counterparty, "uk", {
        sensitivity: "base",
        numeric: true,
      });
      return counterpartySortDir === "asc" ? cmp : -cmp;
    });
  }, [transactions, counterpartySortDir]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH" }).format(amount);
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead className="w-[120px]">Дата</TableHead>
            <TableHead aria-sort={ariaSortMap[counterpartySortDir]}>
              <button
                onClick={handleCounterpartySort}
                className="flex items-center gap-1 font-semibold hover:text-primary transition-colors"
                aria-label={`Сортувати за контрагентом: ${sortLabel[counterpartySortDir]}`}
              >
                Контрагент
                <SortIcon direction={counterpartySortDir} />
              </button>
            </TableHead>
            <TableHead>Призначення</TableHead>
            <TableHead className="text-right">Сума</TableHead>
            <TableHead className="text-center w-[100px]">Тип</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((tx, i) => (
              <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium text-slate-600">{tx.date}</TableCell>
                <TableCell className="font-semibold text-slate-800">{tx.counterparty}</TableCell>
                <TableCell className="text-slate-600 max-w-[300px] truncate" title={tx.description}>
                  {tx.description}
                </TableCell>
                <TableCell className={`text-right font-medium ${tx.amount > 0 ? "text-emerald-600" : "text-slate-800"}`}>
                  {tx.amount > 0 ? "+" : ""}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    tx.amount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {tx.amount > 0 ? "Дохід" : "Витрата"}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                Транзакцій не знайдено.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
