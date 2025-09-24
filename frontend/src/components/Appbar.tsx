import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

export const Appbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-md flex justify-between items-center px-8 py-4">
      {/* Brand Logo */}
      <Link
        to={"/blogs"}
        className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
      >
        Inkspire
      </Link>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <Link to={`/publish`}>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 transition shadow-md"
          >
            + New Post
          </button>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <div
            className="cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {user && <Avatar size={"big"} name={user.name[0]} />}
          </div>

          {/* Dropdown Menu */}
          {menuOpen && user && (
            <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border-b">
                <Avatar size={"small"} name={user.name[0]} />
                <div>
                  <p className="font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={goToDashboard}
                className="w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
