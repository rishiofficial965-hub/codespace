import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setError,
  setLoading,
  setUser,
  setPendingUserId,
  logout,
} from "../state/auth.slice.js";
import {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgetPassword,
  verifyResetOtp,
  logoutApi,
} from "../services/auth.api.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const pendingUserId = useSelector((state) => state.auth.pendingUserId);

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });

      // Store the userId in Redux so VerifyOTPPage can use it
      dispatch(setPendingUserId(data.userId));

     

      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await login({ email, username, password });
      dispatch(setUser(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      dispatch(setError(msg));

      // If user is unverified (403), store the userId so frontend can redirect to /verify-otp
      const userId = error.response?.data?.userId;
      if (error.response?.status === 403 && userId) {
        dispatch(setPendingUserId(userId));
        return { success: false, error: msg, unverified: true };
      }

      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyOTP({ userId, otp }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await verifyOTP({ userId, otp });
      dispatch(setUser(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResendOTP({ userId }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await resendOTP({ userId });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleForgetPassword({ email, username }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await forgetPassword({ email, username });
      dispatch(setPendingUserId(data.userId));
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResetPasswordOtp({
    userId,
    otp,
    newPassword,
    confirmPassword,
  }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await verifyResetOtp({ userId, otp, newPassword, confirmPassword });
      dispatch(setUser(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }


  async function handleLogout() {
    try {
      await logoutApi();
    } catch (err) {
      // Even if the API call fails, clear local state
      console.error("Logout API error:", err);
    } finally {
      dispatch(logout());
    }
  }


  

  return {
    handleRegister,
    handleLogin,
    handleVerifyOTP,
    handleResendOTP,
    handleForgetPassword,
    handleResetPasswordOtp,
    handleLogout,
    loading,
    pendingUserId,
  };
};
