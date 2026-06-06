import { createBrowserRouter } from "react-router-dom";
import { Landing, WorkspaceLayout } from "../features/sandbox";
import Login from "../features/auth/pages/LoginForm.jsx";
import Register from "../features/auth/pages/RegistrationForm.jsx";
import VerifyOTP from "../features/auth/pages/VerifyOTPPage.jsx";
import ForgetPassword from "../features/auth/pages/ForgetPassword.jsx";
import NotFound from "../features/common/NotFound.jsx";

export const routes = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/sandbox/:sandboxId", element: <WorkspaceLayout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-otp", element: <VerifyOTP /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  {
    path: "*",
    element: <NotFound />,
  },
])