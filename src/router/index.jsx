import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage.jsx";
import App from "../App.jsx";
import SaisiePage from "../pages/SaisiePage.jsx";
import HistoriquePage from "../pages/HistoriquePage.jsx";
import FinancesPage from "../pages/FinancesPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";

function RequireAuth({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/app" replace /> : children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <GuestOnly><LoginPage /></GuestOnly>,
  },
  {
    path: "/register",
    element: <GuestOnly><RegisterPage /></GuestOnly>,
  },
  {
    path: "/forgot-password",
    element: <GuestOnly><ForgotPasswordPage /></GuestOnly>,
  },
  {
    path: "/app",
    element: <RequireAuth><App /></RequireAuth>,
    children: [
      { index: true, element: <SaisiePage /> },
      { path: "historique", element: <HistoriquePage /> },
      { path: "finances", element: <FinancesPage /> },
    ],
  },
]);

export default router;
