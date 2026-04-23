"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Summary } from "@/lib/statement";
import { Trophy } from "lucide-react";

interface TopCounterpartiesProps {
  topCounterparties: Summary["topCounterparties"];
}

export function TopCounterparties({ topCounterparties }: TopCounterpartiesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(amount);
  };

  if (topCounterparties.length === 0) return null;

  return (
    <Card className="border-slate-200 shadow-sm mt-6">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Топ-5 контрагентів за витратами
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100">
          {topCounterparties.map((cp, i) => (
            <li key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-slate-200 text-slate-700' :
                  i === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {i + 1}
                </div>
                <span className="font-medium text-slate-700">{cp.name}</span>
              </div>
              <span className="font-semibold text-slate-800">
                {formatCurrency(cp.amount)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
