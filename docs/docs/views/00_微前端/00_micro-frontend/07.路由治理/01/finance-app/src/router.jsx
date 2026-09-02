import { Navigate, createBrowserRouter, createMemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import { defaultFinancePath } from "./finance-pages.js";
import BillsView from "./views/BillsView.jsx";
import InvoiceView from "./views/InvoiceView.jsx";
import RefundView from "./views/RefundView.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={defaultFinancePath} replace />,
      },
      {
        path: "/finance/bills",
        element: <BillsView />,
      },
      {
        path: "/finance/invoice/908",
        element: <InvoiceView />,
      },
      {
        path: "/finance/refund/1024",
        element: <RefundView />,
      },
    ],
  },
];

// export function createFinanceRouter() {
//   return createBrowserRouter(routes);
// }

export function createFinanceRouter(options = {}) {
  const { memory = false, initialPath = defaultFinancePath } = options;
  if(memory){
    return createMemoryRouter(routes, {
      initialEntries: [initialPath],
    });
  }

  return createBrowserRouter(routes);
}
