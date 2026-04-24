import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "../services/xpense.service";
import { SortOrder } from "../enums/expense.enums";
import type { CategorySummary, CreateExpensePayload, ExpenseFiltersState } from "../types/expense";

export const EXPENSES_KEY = "expenses";

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ExpenseFiltersState>({
    category: "all",
    sortOrder: SortOrder.DATE_DESC,
  });

  const { data: rawExpenses = [], isLoading, isError, error } = useQuery({
    queryKey: [EXPENSES_KEY, filters.category, filters.sortOrder],
    queryFn: () =>
      expenseService.getExpenses({
        category: filters.category !== "all" ? filters.category : undefined,
        sort: filters.sortOrder,
      }),
    staleTime: 30_000,
  });

  const { mutateAsync: createExpense, isPending: isSubmitting } = useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: CreateExpensePayload;
      idempotencyKey: string;
    }) => expenseService.createExpense(payload, idempotencyKey),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [EXPENSES_KEY] });
    },
  });

  const expenses = useMemo(() => {
    const sorted = [...rawExpenses];
    sorted.sort((a, b) =>
      filters.sortOrder === SortOrder.DATE_DESC
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted;
  }, [rawExpenses, filters.sortOrder]);

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const categorySummary = useMemo<CategorySummary[]>(() => {
    const map = new Map<string, { total: number; count: number }>();
    expenses.forEach((e) => {
      const existing = map.get(e.category) ?? { total: 0, count: 0 };
      map.set(e.category, {
        total: existing.total + e.amount,
        count: existing.count + 1,
      });
    });
    return Array.from(map.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [expenses]);

  const availableCategories = useMemo(
    () => [...new Set(rawExpenses.map((e) => e.category))],
    [rawExpenses]
  );

  return {
    expenses,
    createExpense,
    isSubmitting,
    filters,
    setFilters,
    total,
    categorySummary,
    availableCategories,
    isLoading,
    isError,
    error,
  };
};