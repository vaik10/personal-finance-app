import { Alert, Box, CircularProgress, Container, Divider, Stack, Typography } from "@mui/material";
import ExpenseForm from "../components/expense/ExpenseForm";
import ExpenseFilters from "../components/expense/ExpenseFilters";
import ExpenseSummary from "../components/expense/ExpenseSummary";
import ExpenseTable from "../components/expense/ExpenseTable";
import { useExpenses } from "../hooks/useExpenses";
import type { ExpenseFormData } from "../types/expense";

export default function ExpensesPage() {
  const {
    expenses,
    createExpense,
    isSubmitting,
    filters,
    setFilters,
    total,
    categorySummary,
    isLoading,
    isError,
    error,
  } = useExpenses();

  const handleAdd = async (data: ExpenseFormData, idempotencyKey: string) => {
    await createExpense({
      payload: {
        amount: parseFloat(parseFloat(data.amount).toFixed(2)),
        category: data.category.trim().toLowerCase(),
        description: data.description.trim(),
        date: data.date,
      },
      idempotencyKey,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Expenses
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Track and manage your personal spending
          </Typography>
        </Box>

        <ExpenseForm onAdd={handleAdd} isSubmitting={isSubmitting} />

        <Divider />

        {isError && (
          <Alert severity="error">
            {error instanceof Error ? error.message : "Failed to load expenses"}
          </Alert>
        )}

        <ExpenseSummary total={total} categorySummary={categorySummary} />

        <ExpenseFilters
          filters={filters}
          onChange={setFilters}
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ExpenseTable data={expenses} />
        )}
      </Stack>
    </Container>
  );
}