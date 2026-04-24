import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppHeader from "./components/common/AppHeader";
import ExpensesPage from "./pages/ExpensePage";

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<ExpensesPage />} />
      </Routes>
    </BrowserRouter>
  );
}