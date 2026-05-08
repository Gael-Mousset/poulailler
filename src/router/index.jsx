import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import SaisiePage from "../pages/SaisiePage.jsx";
import HistoriquePage from "../pages/HistoriquePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SaisiePage /> },
      { path: "historique", element: <HistoriquePage /> },
    ],
  },
]);

export default router;
