import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) navigate(user.role === "seller" ? "/seller/dashboard" : "/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handleRegister({ email, contact: contactNumber, password, fullname: username, isSeller: false });
    if (!result.success) { setError(result.error || "Registration failed"); return; }
    navigate("/verify-otp");
  };

  const inputBase =
    "w-full bg-slate-900 border border-white/[0.08] text-slate-200 placeholder:text-slate-600 px-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all";

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* ── Left branding panel ────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d1117] relative overflow-hidden flex-col items-center justify-center p-16 border-r border-white/[0.04]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 15L85 80H70L50 42L30 80H15L50 15Z" />
                <circle cx="50" cy="62" r="6" fill="white" opacity="0.8" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">Antigravity IDE</span>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight leading-tight mb-3">
            Launch your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">first sandbox.</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-10">
            Join developers building with autonomous AI agents in the cloud. Zero config, instant environments.
          </p>

          <div className="space-y-4">
            {[
              { icon: <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" /></svg>, label: "Instant cloud workspace", sub: "No local setup required" },
              { icon: <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, label: "AI pair programmer", sub: "Autonomous code generation" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3 bg-slate-900/60 border border-white/[0.04] rounded-xl p-3.5">
                <div className="w-7 h-7 bg-slate-800 border border-white/[0.06] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-slate-300 text-xs font-semibold">{f.label}</p>
                  <p className="text-slate-600 text-[11px] font-mono mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[10px] font-mono text-slate-700">
            antigravity engine v2.4 • kubernetes-backed • tls encrypted
          </p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 15L85 80H70L50 42L30 80H15L50 15Z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100">Antigravity IDE</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Get started with a free developer workspace.</p>
          </div>



          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs font-mono">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={username} onChange={(e) => setUsername(e.target.value)}
              type="text" name="username" placeholder="full name" required className={inputBase} />
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" name="email" placeholder="you@example.com" required className={inputBase} />
            <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
              type="tel" name="contactNumber" placeholder="phone number (optional)" className={inputBase} />

            <div className="relative">
              <input value={password} onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"} name="password" placeholder="create password" required
                className={inputBase} />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1 cursor-pointer">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[10px] font-mono text-slate-700">or</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full bg-slate-900 border border-white/[0.08] rounded-lg py-3 text-xs font-mono text-slate-400 hover:border-white/[0.15] hover:text-slate-200 transition-all duration-300 active:scale-[0.98] cursor-pointer">
              <FaGoogle size={13} /> continue with google
            </a>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
          </p>

          <p className="mt-5 text-center text-[10px] font-mono text-slate-700 leading-relaxed">
            By creating an account you agree to our{" "}
            <span className="text-slate-500 cursor-pointer hover:text-indigo-400 transition-colors">Terms of Service</span>
            {" "}and{" "}
            <span className="text-slate-500 cursor-pointer hover:text-indigo-400 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
