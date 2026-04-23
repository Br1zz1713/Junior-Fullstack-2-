"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/lib/statement";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(amount);
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead className="w-[120px]">Дата</TableHead>
            <TableHead>Контрагент</TableHead>
            <TableHead>Призначення</TableHead>
            <TableHead className="text-right">Сума</TableHead>
            <TableHead className="text-center w-[100px]">Тип</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((tx, i) => (
              <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium text-slate-600">{tx.date}</TableCell>
                <TableCell className="font-semibold text-slate-800">{tx.counterparty}</TableCell>
                <TableCell className="text-slate-600 max-w-[300px] truncate" title={tx.description}>
                  {tx.description}
                </TableCell>
                <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    tx.amount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {tx.amount > 0 ? 'Дохід' : 'Витрата'}
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
