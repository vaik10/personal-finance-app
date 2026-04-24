import { Box, Chip, Divider, Paper, Stack, Tooltip, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getCategoryColor } from "../../constants/expense.constants";
import type { CategorySummary } from "../../types/expense";
import { formatCurrency } from "../../utils/formatters";

interface Props {
  total: number;
  categorySummary: CategorySummary[];
}

export default function ExpenseSummary({ total, categorySummary }: Props) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", gap: 1, mb: categorySummary.length > 1 ? 2 : 0 }}
      >
        <AccountBalanceWalletIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Total:{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            {formatCurrency(total)}
          </Box>
        </Typography>
      </Stack>

      {categorySummary.length > 1 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "text.secondary" }}
          >
            By Category
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}>
            {categorySummary.map(({ category, total: catTotal, count }) => (
              <Tooltip key={category} title={`${count} expense${count > 1 ? "s" : ""}`} arrow>
                <Chip
                  label={`${category}: ${formatCurrency(catTotal)}`}
                  size="small"
                  sx={{
                    bgcolor: getCategoryColor(category) + "33",
                    border: `1px solid ${getCategoryColor(category)}`,
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}