import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function AppHeader() {
    return (
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <AccountBalanceWalletIcon sx={{ mr: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                        Expense Tracker
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                        Personal Finance
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}