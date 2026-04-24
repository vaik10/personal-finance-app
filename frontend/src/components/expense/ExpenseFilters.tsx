import { Box, InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { SortOrder } from "../../enums/expense.enums";
import type { ExpenseFiltersState } from "../../types/expense";

interface Props {
  filters: ExpenseFiltersState;
  onChange: (filters: ExpenseFiltersState) => void;
}

export default function ExpenseFilters({ filters, onChange }: Props) {
  const [inputValue, setInputValue] = useState(
    filters.category === "all" ? "" : filters.category
  );

  const latestOnChange = useRef(onChange);
  const latestFilters = useRef(filters);
  useEffect(() => { latestOnChange.current = onChange; });
  useEffect(() => { latestFilters.current = filters; });

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = inputValue.trim().toLowerCase();
      latestOnChange.current({
        ...latestFilters.current,
        category: trimmed || "all",
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const setSort = (_: React.MouseEvent, value: string | null) => {
    if (value) onChange({ ...filters, sortOrder: value as ExpenseFiltersState["sortOrder"] });
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 1.5 }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "text.secondary" }}
        >
          Filter & Sort
        </Typography>
        <ToggleButtonGroup value={filters.sortOrder} exclusive onChange={setSort} size="small">
          <ToggleButton value={SortOrder.DATE_DESC}>
            <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
            Newest
          </ToggleButton>
          <ToggleButton value={SortOrder.DATE_ASC}>
            <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
            Oldest
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Search by category..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}