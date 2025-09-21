import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Appbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Replace with actual user info from backend/localStorage
  const user = {
    name: "Rishi Raj",
    email: "rishi@example.com",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const goToDashboard = () => {
    setMenuOpen(false); // close dropdown
    navigate("/dashboard");
  };

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
        {/* New Blog Button */}
        <Link to={`/publish`}>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 transition shadow-md"
          >
            + New Post
          </button>
        </Link>

        {/* Avatar with Dropdown */}
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Avatar size={"big"} name={user.name[0]} />
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 border-b">
                <Avatar size={"small"} name={user.name[0]} />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Your Blogs Option */}
              <button
                onClick={goToDashboard}
                className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Your Blogs
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 transition"
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
