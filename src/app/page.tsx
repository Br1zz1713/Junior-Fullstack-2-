"use client";

import { useStatement } from "@/hooks/useStatement";
import { FileUpload } from "@/components/FileUpload";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionControls } from "@/components/TransactionControls";
import { TransactionTable } from "@/components/TransactionTable";
import { TopCounterparties } from "@/components/TopCounterparties";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {
    transactions,
    rawTransactionsCount,
    skippedRows,
    errors,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    summary,
    handleParseResult,
    reset,
  } = useStatement();

  const isLoaded = rawTransactionsCount > 0 || skippedRows > 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Аналізатор банківської виписки</h1>
            <p className="text-slate-500 mt-1">Завантажте CSV файл для перегляду підсумків та транзакцій.</p>
          </div>
          {isLoaded && (
            <Button variant="outline" onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Завантажити інший файл
            </Button>
          )}
        </div>

        {!isLoaded ? (
          <div className="max-w-xl mx-auto mt-12">
            <FileUpload onUpload={handleParseResult} />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {skippedRows > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800">Увага: Пропущено {skippedRows} рядків</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Деякі рядки не відповідали формату і були пропущені.
                  </p>
                  {errors.length > 0 && (
                    <div className="mt-2 text-xs text-amber-600 max-h-24 overflow-y-auto">
                      {errors.slice(0, 5).map((e, i) => (
                        <div key={i}>Рядок {e.row}: {e.error}</div>
                      ))}
                      {errors.length > 5 && <div>та ще {errors.length - 5} помилок...</div>}
                    </div>
                  )}
                </div>
              </div>
            )}

            <SummaryCards summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TransactionControls
                  filter={filter}
                  setFilter={setFilter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <TransactionTable transactions={transactions} />
              </div>
              <div className="lg:col-span-1">
                <TopCounterparties topCounterparties={summary.topCounterparties} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
