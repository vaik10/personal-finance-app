export interface Expense {
  id: string;
  amount: number;       // stored in paise by API, normalized to rupees in service
  category: string;     // free text, lowercase from API
  description: string;
  date: string;
  created_at: string;
}

export interface CreateExpensePayload {
  amount: number;       // rupees (API converts to paise on backend)
  category: string;
  description: string;
  date: string;         // YYYY-MM-DD
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  description: string;
  date: string;
}

export interface ExpenseFiltersState {
  category: string;     // "all" or any category string
  sortOrder: "date_desc" | "date_asc";
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}