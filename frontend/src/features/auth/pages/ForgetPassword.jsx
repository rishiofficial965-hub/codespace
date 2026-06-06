import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const ForgetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { handleResetPasswordOtp, loading, pendingUserId } = useAuth();

  useEffect(() => {
    if (!pendingUserId) navigate("/login");
  }, [pendingUserId, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!pendingUserId) { setError("Session expired. Please request a new OTP."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (otp.length !== 6) { setError("Please enter a valid 6-digit OTP."); return; }

    const result = await handleResetPasswordOtp({ userId: pendingUserId, otp, newPassword, confirmPassword });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate(result.user?.role === "seller" ? "/seller/dashboard" : "/");
      }, 3000);
    } else {
      setError(result.error || "Failed to reset password. Please try again.");
    }
  }

  const inputBase =
    "w-full bg-slate-950 border border-white/[0.08] text-slate-200 placeholder:text-slate-600 px-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 font-sans relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 15L85 80H70L50 42L30 80H15L50 15Z" />
              <circle cx="50" cy="62" r="6" fill="white" opacity="0.8" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100">Antigravity IDE</span>
        </div>

        <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl px-8 py-9 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Reset password</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-mono leading-relaxed">
              Enter the OTP sent to your email<br />and choose a new password.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs font-mono text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-3">
              <p className="text-indigo-400 text-xs font-mono text-center">
                ✓ Password reset successfully. Redirecting…
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1.5 ml-0.5">
                Security Code (OTP)
              </label>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                type="text"
                placeholder="000000"
                maxLength={6}
                className={`${inputBase} text-center tracking-[0.5em] text-base`}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1.5 ml-0.5">
                New Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="new password"
                  className={inputBase}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    }
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1.5 ml-0.5">
                Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showPassword ? "text" : "password"}
                placeholder="confirm password"
                className={inputBase}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1 cursor-pointer">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Resetting…
                </span>
              ) : "Update Password"}
            </button>
          </form>

          <Link
            to="/login"
            className="block text-center text-[12px] font-mono text-slate-600 hover:text-indigo-400 transition-colors mt-6">
            ← back to login
          </Link>
        </div>

        <p className="mt-5 text-center text-[10px] font-mono text-slate-700">
          end-to-end encrypted • tls secured
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
