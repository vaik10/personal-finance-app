import type { CreateExpensePayload, Expense } from "../types/expense";

const BASE_URL = "http://192.168.0.106:3000";

interface ApiExpense {
    id: string;
    amount: number;       // paise
    category: string;
    description: string;
    date: string;
    created_at: string;
}

const normalize = (e: ApiExpense): Expense => ({
    ...e,
    amount: e.amount / 100,                        // paise → rupees
    category: e.category.trim().toLowerCase(),     // normalize casing
    date: e.date.split("T")[0],                    // ISO datetime → YYYY-MM-DD
});

export const expenseService = {
    getExpenses: async (params?: {
        category?: string;
        sort?: string;
    }): Promise<Expense[]> => {
        const url = new URL(`${BASE_URL}/expenses`);
        if (params?.category && params.category !== "all") {
            url.searchParams.set("category", params.category);
        }
        if (params?.sort) url.searchParams.set("sort", params.sort);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Failed to fetch expenses: ${res.status}`);
        const result: { data: ApiExpense[]; total: number } = await res.json();
        return result.data.map(normalize);
    },

    createExpense: async (
  payload: CreateExpensePayload,
  idempotencyKey: string
): Promise<Expense> => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create expense: ${res.status}`);
  if (res.status === 204) return {} as Expense;  // ← add this line
  const data: ApiExpense = await res.json();
  return normalize(data);
},
};