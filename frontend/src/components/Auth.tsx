import type { SignupInput } from "@rishi438/zod";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import logo from "../assets/logo.png";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, [navigate]);

  async function sendRequest() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      const jwt = response.data;
      localStorage.setItem("token", String(jwt));
      navigate("/blogs");
    } catch (e) {
      if (e) {
        // @ts-expect-error expect
        setError(e.response?.data?.message || "Something went wrong");
      } else {
        setError("Error while signing in");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Glass card */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/40 dark:border-slate-700 p-8 md:p-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <img
              src={logo}
              alt="Inkspire"
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              {type === "signup" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                className="ml-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-5"
          >
            {type === "signup" && (
              <LabelledInput
                icon={<User size={18} className="text-slate-400" />}
                label="Name"
                placeholder="Enter your name"
                onChange={(e) =>
                  setPostInputs({ ...postInputs, name: e.target.value })
                }
              />
            )}

            <LabelledInput
              icon={<Mail size={18} className="text-slate-400" />}
              label="Email"
              placeholder="you@example.com"
              onChange={(e) =>
                setPostInputs({ ...postInputs, email: e.target.value })
              }
            />

            <LabelledInput
              icon={<Lock size={18} className="text-slate-400" />}
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setPostInputs({ ...postInputs, password: e.target.value })
              }
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl p-3"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendRequest}
              type="button"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading
                ? "Please wait..."
                : type === "signup"
                ? "Create Account"
                : "Sign In"}
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-400 mt-6"
        >
          By continuing, you agree to our Terms & Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
  icon,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {icon}
        </div>
        <input
          onChange={onChange}
          type={type || "text"}
          className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-11 pr-4 py-3 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}
