import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { getCategoryColor } from "../../constants/expense.constants";
import type { Expense } from "../../types/expense";
import { formatCurrency, formatDate } from "../../utils/formatters";

function EmptyState() {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <ReceiptLongIcon sx={{ fontSize: 64, color: "text.disabled", mb: 1 }} />
      <Typography sx={{ color: "text.secondary" }}>No expenses found</Typography>
    </Box>
  );
}

function CategoryChip({ category }: { category: string }) {
  const color = getCategoryColor(category);
  return (
    <Chip
      label={category}
      size="small"
      sx={{
        bgcolor: color + "33",
        border: `1px solid ${color}`,
        fontWeight: 500,
        fontSize: "0.72rem",
        textTransform: "capitalize",
      }}
    />
  );
}

export default function ExpenseTable({ data }: { data: Expense[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (data.length === 0) return <EmptyState />;

  if (isMobile) {
    return (
      <Stack spacing={1.5}>
        {data.map((e) => (
          <Card key={e.id} variant="outlined">
            <CardContent sx={{ pb: "12px !important" }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{e.description}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {formatDate(e.date)}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: "primary.main", ml: 1 }} noWrap>
                  {formatCurrency(e.amount)}
                </Typography>
              </Stack>
              <Box sx={{ mt: 1 }}>
                <CategoryChip category={e.category} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Paper elevation={1}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id} hover>
              <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                {formatDate(e.date)}
              </TableCell>
              <TableCell>
                <CategoryChip category={e.category} />
              </TableCell>
              <TableCell>{e.description}</TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "primary.main", whiteSpace: "nowrap" }}
              >
                {formatCurrency(e.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}