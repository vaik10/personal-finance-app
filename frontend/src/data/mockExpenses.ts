import { ExpenseCategory } from "../enums/expense.enums";
import type { Expense } from "../types/expense";

export const mockExpenses: Expense[] = [
  { id: "1", amount: 850, category: ExpenseCategory.FOOD, description: "Lunch at restaurant", date: "2026-04-23", created_at: new Date("2026-04-23").toISOString() },
  { id: "2", amount: 1200, category: ExpenseCategory.TRANSPORT, description: "Uber rides", date: "2026-04-22", created_at: new Date("2026-04-22").toISOString() },
  { id: "3", amount: 3500, category: ExpenseCategory.SHOPPING, description: "Clothes from Myntra", date: "2026-04-21", created_at: new Date("2026-04-21").toISOString() },
  { id: "4", amount: 500, category: ExpenseCategory.ENTERTAINMENT, description: "Netflix subscription", date: "2026-04-20", created_at: new Date("2026-04-20").toISOString() },
  { id: "5", amount: 2000, category: ExpenseCategory.HEALTH, description: "Doctor consultation", date: "2026-04-19", created_at: new Date("2026-04-19").toISOString() },
  { id: "6", amount: 1800, category: ExpenseCategory.UTILITIES, description: "Electricity bill", date: "2026-04-18", created_at: new Date("2026-04-18").toISOString() },
  { id: "7", amount: 15000, category: ExpenseCategory.RENT, description: "Monthly house rent", date: "2026-04-01", created_at: new Date("2026-04-01").toISOString() },
  { id: "8", amount: 999, category: ExpenseCategory.EDUCATION, description: "Udemy course", date: "2026-04-15", created_at: new Date("2026-04-15").toISOString() },
];