import { createBrowserRouter } from "react-router-dom";

//Pages
import WebAppLayout from "./layouts/webApp";
import BudgetPage from "./pages/budget";
import DashboardPage from "./pages/dashboard";

//Browser router object
export const BrowserRouter = createBrowserRouter([
  {
    path: "/web-app",
    element: <WebAppLayout />,
    children: [
      { path: "/web-app/dashboard", element: <DashboardPage /> },
      { path: "/web-app/budgets/:id", element: <BudgetPage /> },
    ],
  },
]);
