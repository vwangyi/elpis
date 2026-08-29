import { Navigate } from "react-router-dom";
import { Invoices } from "./pages/Invoices.jsx";
import { Settlement } from "./pages/Settlement.jsx";

export const routes = [
  { path: "/", element: <Navigate to="/settlement" replace /> },
  { path: "/settlement", element: <Settlement /> },
  { path: "/invoices", element: <Invoices /> },
];
