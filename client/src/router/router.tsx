import { createBrowserRouter } from "react-router-dom";

//Pages
import DashboardPage from "./pages/dashboard";
import WebAppLayout from "./layouts/webApp";

//Browser router object
export const BrowserRouter = createBrowserRouter([
  {
    path: "/web-app",
    element: <WebAppLayout />,
    children: [{ path: "/web-app/dashboard", element: <DashboardPage /> }],
  },
]);
