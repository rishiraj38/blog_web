import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { LogOut, LayoutDashboard, PenSquare, Sun, Moon } from "lucide-react";
import logo from "../assets/logo.png";
import { useTheme } from "../context/ThemeContext";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const Appbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: User = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const goToDashboard = () => {
    setMenuOpen(false);
    navigate("/dashboard");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-900 shadow-sm flex justify-between items-center px-8 py-4 transition-all duration-300">
      {/* Brand Logo */}
      <Link to={"/blogs"} className="flex items-center gap-3 group">
        <img
          src={logo}
          alt="Inkspire Logo"
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
        />
        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Inkspire
        </span>
      </Link>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <Link to={`/publish`}>
          <button
            type="button"
            className="flex items-center gap-2 text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-slate-300 font-bold rounded-xl text-sm px-5 py-2.5 transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5"
          >
            <PenSquare size={18} />
            <span>New Post</span>
          </button>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <div
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {user && <Avatar size={"big"} name={user.name[0]}  />}
          </div>

          {/* Dropdown Menu */}
          {menuOpen && user && (
            <div className="absolute right-0 mt-4 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/40 dark:border-slate-700 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50 animate-fade-in-up">
              <div className="flex items-center space-x-3 px-5 py-4 bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <Avatar size={"small"} name={user.name[0]}  />
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={goToDashboard}
                  className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer flex items-center gap-3"
                >
                  <LayoutDashboard size={18} className="text-slate-500 dark:text-slate-400" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition cursor-pointer flex items-center gap-3"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
