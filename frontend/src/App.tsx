import { Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Acquisitions from "./pages/Acquisitions";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import Reminders from "./pages/Reminders";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Vehicles from "./pages/Vehicles";

/** All routes. Add new pages here and to `config/navigation.ts` if they belong in the sidebar. */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="acquisitions" element={<Acquisitions />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="sales" element={<Sales />} />
        <Route path="payments" element={<Payments />} />
        <Route path="documents" element={<Documents />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
