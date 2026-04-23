"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterType } from "@/hooks/useStatement";
import { Search } from "lucide-react";

interface TransactionControlsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TransactionControls({ filter, setFilter, searchQuery, setSearchQuery }: TransactionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          type="text"
          placeholder="Пошук за контрагентом або призначенням..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select value={filter} onValueChange={(val) => setFilter(val as FilterType)}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Фільтр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Усі транзакції</SelectItem>
            <SelectItem value="Income">Доходи</SelectItem>
            <SelectItem value="Expense">Витрати</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
