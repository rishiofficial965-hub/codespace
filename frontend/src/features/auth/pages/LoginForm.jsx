import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [useEmailLogin, setUseEmailLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLogin, handleForgetPassword, loading } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) navigate(user.role === "seller" ? "/seller/dashboard" : "/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const credentials = useEmailLogin ? { email, password } : { username, password };
    const result = await handleLogin(credentials);
    if (!result.success) {
      setError(result.error || "Invalid credentials");
      setPassword("");
      if (result.unverified) navigate("/verify-otp");
      return;
    }
    navigate(result.user.role === "buyer" ? "/" : "/seller/dashboard");
  };

  const handleForgotPassword = async () => {
    if (!useEmailLogin) { setUseEmailLogin(true); setError("Switch to email login to reset your password."); return; }
    if (!email) { setError("Please enter your email address."); return; }
    const result = await handleForgetPassword({ email });
    if (!result.success) { setError(result.error); return; }
    navigate("/forget-password");
  };

  const inputBase =
    "w-full bg-slate-900 border border-white/[0.08] text-slate-200 placeholder:text-slate-600 px-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all";

  return (
    <div className="min-h-screen flex font-sans bg-slate-950">
      {/* ── Left panel — branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d1117] relative overflow-hidden flex-col items-center justify-center p-16 border-r border-white/[0.04]">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-50" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          {/* Logo */}
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
            Code without<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">limits.</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-12">
            Cloud-native sandboxes powered by autonomous AI. Spin up an isolated workspace in seconds.
          </p>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { dot: "bg-indigo-500", text: "Isolated Kubernetes containers per session" },
              { dot: "bg-violet-500", text: "Autonomous AI agent for real-time coding" },
              { dot: "bg-cyan-500", text: "Live preview with hot reload built-in" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${f.dot}`} />
                <p className="text-slate-500 text-xs font-medium">{f.text}</p>
              </div>
            ))}
          </div>

          {/* Terminal snippet */}
          <div className="mt-10 bg-slate-900 border border-white/[0.06] rounded-xl p-4 font-mono text-xs text-slate-500">
            <span className="text-indigo-400">$</span> antigravity init --sandbox react
            <br />
            <span className="text-slate-600">✓ Container provisioned in 1.2s</span>
            <br />
            <span className="text-slate-600">✓ AI agent online — ready</span>
            <br />
            <span className="text-green-400 animate-pulse">█</span>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Sign in to your workspace</h1>
            <p className="text-slate-500 text-sm">Welcome back — your sandboxes are waiting.</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs font-mono">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!useEmailLogin ? (
              <input
                value={username} onChange={(e) => setUsername(e.target.value)}
                type="text" name="username" placeholder="username" required
                className={inputBase}
              />
            ) : (
              <input
                value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" name="email" placeholder="you@example.com" required
                className={inputBase}
              />
            )}

            <div className="relative">
              <input
                value={password} onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"} name="password" placeholder="••••••••" required
                className={inputBase}
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => setUseEmailLogin((v) => !v)}
                className="text-[11px] font-mono text-slate-600 hover:text-indigo-400 transition-colors">
                use {useEmailLogin ? "username" : "email"} instead
              </button>
              <button type="button" onClick={handleForgotPassword}
                className="text-[11px] font-mono text-indigo-500 hover:text-indigo-300 transition-colors">
                forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1 cursor-pointer">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : "Sign In"}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[10px] font-mono text-slate-700">or</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full bg-slate-900 border border-white/[0.08] rounded-lg py-3 text-xs font-mono text-slate-400 hover:border-white/[0.15] hover:text-slate-200 transition-all duration-300 active:scale-[0.98] cursor-pointer">
              <FaGoogle size={13} /> continue with google
            </a>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600 font-medium">
            New to Antigravity?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Create account
            </Link>
          </p>

          <div className="mt-8 flex justify-center gap-4 text-[10px] font-mono text-slate-700">
            <span className="cursor-pointer hover:text-slate-500 transition-colors">terms</span>
            <span>·</span>
            <span className="cursor-pointer hover:text-slate-500 transition-colors">privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
