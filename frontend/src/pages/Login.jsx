import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogIn, Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import api from "../services/api";

const Login = () => {
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const [form, setForm] = useState({
    identifier: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form
        ,{ withCredentials: true }
    );

      // store access token and user data
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-300/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-float-medium" />

      {/* Glass card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl shadow-green-900/5 border border-white/80"
        >
          {/* Logo / Icon */}
          <div className={`flex justify-center mb-6 transition-all duration-500 delay-100 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <LogIn size={28} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className={`text-center mb-8 transition-all duration-500 delay-150 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Sign in to continue to TechPulse</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm text-red-600 px-4 py-3 mb-6 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-shake">
              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Identifier field */}
          <div className={`mb-4 transition-all duration-500 delay-200 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 ${
              focusedField === "identifier"
                ? "border-green-400 bg-white shadow-sm shadow-green-100"
                : "border-gray-200/80 bg-white/50 hover:border-gray-300"
            }`}>
              <Mail size={18} className={`ml-4 transition-colors duration-200 ${
                focusedField === "identifier" ? "text-green-500" : "text-gray-400"
              }`} />
              <input
                name="identifier"
                placeholder="Email or Username"
                value={form.identifier}
                onChange={handleChange}
                onFocus={() => setFocusedField("identifier")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-3 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className={`mb-6 transition-all duration-500 delay-300 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <div className={`relative flex items-center border-2 rounded-xl transition-all duration-200 ${
              focusedField === "password"
                ? "border-green-400 bg-white shadow-sm shadow-green-100"
                : "border-gray-200/80 bg-white/50 hover:border-gray-300"
            }`}>
              <Lock size={18} className={`ml-4 transition-colors duration-200 ${
                focusedField === "password" ? "text-green-500" : "text-gray-400"
              }`} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-3 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div className={`transition-all duration-500 delay-[350ms] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className={`flex items-center gap-4 my-6 transition-all duration-500 delay-[400ms] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Register link */}
          <p className={`text-center text-sm text-gray-500 transition-all duration-500 delay-[450ms] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}>
            New to TechPulse?{" "}
            <Link
              to="/register"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors inline-flex items-center gap-1 group"
            >
              Create account
              <Sparkles size={14} className="group-hover:animate-pulse" />
            </Link>
          </p>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.08); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(calc(-50% + 15px), calc(-50% - 15px)) scale(1.03); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-4px); }
          30%, 60%, 90% { transform: translateX(4px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 10s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 7s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Login;
