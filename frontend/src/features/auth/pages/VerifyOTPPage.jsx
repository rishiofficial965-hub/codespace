import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth.js";

const VerifyOTPPage = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { handleVerifyOTP, handleResendOTP, loading, pendingUserId } = useAuth();

  useEffect(() => {
    if (!pendingUserId) navigate("/register");
  }, [pendingUserId, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => { if (i < 6) newDigits[i] = char; });
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter all 6 digits."); return; }
    const result = await handleVerifyOTP({ userId: pendingUserId, otp });
    if (!result.success) {
      setError(result.error || "Verification failed. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }
    navigate(result.user.role === "buyer" ? "/" : "/seller/dashboard");
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setError("");
    setSuccessMsg("");
    const result = await handleResendOTP({ userId: pendingUserId });
    if (result.success) {
      setSuccessMsg("New OTP sent to your email.");
      setResendCooldown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      setError(result.error || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 font-sans relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/8 blur-[100px] rounded-full pointer-events-none" />

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Verify your email</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-mono leading-relaxed">
              We sent a 6-digit code to your email.<br />Enter it below to activate your account.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs font-mono text-center">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-3">
              <p className="text-indigo-400 text-xs font-mono text-center">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            {/* OTP Inputs */}
            <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-lg border transition-all duration-200 outline-none bg-slate-950 text-slate-100 caret-transparent select-none
                    ${digit
                      ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
                      : "border-white/[0.08] focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30"
                    }`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || digits.join("").length < 6}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-sm cursor-pointer">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : "Verify & Continue"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-1 mt-6">
            <p className="text-slate-600 text-[11px] font-mono">Didn't receive a code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="text-indigo-400 text-[12px] font-mono hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
              {resendCooldown > 0 ? `resend in ${resendCooldown}s` : "resend otp"}
            </button>
          </div>

          <p className="text-slate-700 text-[10px] font-mono text-center mt-4">
            code expires in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
