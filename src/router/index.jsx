import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import SaisiePage from "../pages/SaisiePage.jsx";
import HistoriquePage from "../pages/HistoriquePage.jsx";
import FinancesPage from "../pages/FinancesPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SaisiePage /> },
      { path: "historique", element: <HistoriquePage /> },
      { path: "finances", element: <FinancesPage /> },
    ],
  },
]);

export default router;
