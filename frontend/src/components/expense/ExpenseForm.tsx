import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import type { ExpenseFormData } from "../../types/expense";

const EMPTY_FORM: ExpenseFormData = {
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
};

type FormErrors = Partial<Record<keyof ExpenseFormData, string>>;

interface Props {
    onAdd: (data: ExpenseFormData, idempotencyKey: string) => Promise<void>;
    isSubmitting: boolean;
}

export default function ExpenseForm({ onAdd, isSubmitting }: Props) {
    const [form, setForm] = useState<ExpenseFormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const idempotencyKey = useMemo(() => {
        const content = JSON.stringify({
            amount: form.amount.trim(),
            category: form.category.trim().toLowerCase(),
            description: form.description.trim(),
            date: form.date,
        });
        let hash = 2166136261;
        for (let i = 0; i < content.length; i++) {
            hash ^= content.charCodeAt(i);
            hash = Math.imul(hash, 16777619) >>> 0;
        }
        return hash.toString(16).padStart(8, "0");
    }, [form]);

    const validate = (): boolean => {
        const next: FormErrors = {};
        const amt = parseFloat(form.amount);
        if (!form.amount || isNaN(amt) || amt <= 0) next.amount = "Enter a valid positive amount";
        if (!form.category.trim()) next.category = "Category is required";
        if (!form.description.trim()) next.description = "Description is required";
        if (!form.date) next.date = "Date is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || isSubmitting) return;
        try {
            await onAdd(form, idempotencyKey);
            setForm(EMPTY_FORM);
        } catch {
            // error handled by parent / React Query
        }
    };

    const handleChange =
        (field: keyof ExpenseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
        };

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Add New Expense
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate

                autoComplete="off"
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                }}
            >
                <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={form.amount}
                    onChange={handleChange("amount")}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            inputProps: { min: 0.01, step: "0.01" },
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Category"
                    placeholder="e.g. food, transport"
                    value={form.category}
                    onChange={handleChange("category")}
                    error={!!errors.category}
                    helperText={errors.category}
                    slotProps={{ htmlInput: { maxLength: 50 } }}
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={form.description}
                    onChange={handleChange("description")}
                    error={!!errors.description}
                    helperText={errors.description}
                    slotProps={{ htmlInput: { maxLength: 200 } }}
                    sx={{ gridColumn: { sm: "span 2" } }}
                />
                <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={handleChange("date")}
                    error={!!errors.date}
                    helperText={errors.date}
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: { inputProps: { max: new Date().toISOString().split("T")[0] } },
                    }}
                />
                <Box sx={{ display: "flex", alignItems: "flex-start", pt: errors.date ? 0 : 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={
                            isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AddIcon />
                        }
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Expense"}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}