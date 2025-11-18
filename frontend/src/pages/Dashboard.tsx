import { Appbar } from "../components/Appbar";
import { Spinner } from "../components/Spinner";
import { Avatar } from "../components/BlogCard";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { jwtDecode } from "jwt-decode";

interface Author {
  name: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: Author;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Edit Profile States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch blogs + user
  const fetchUserBlogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
      setEditName(decoded.name);
      setEditEmail(decoded.email);
    } catch (e) {
      console.error("Invalid token", e);
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/filter`, {
        headers: { Authorization: token },
      });
      //@ts-expect-error: backend type mismatch
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();

    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );
      if (clickedOutside) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete Blog with confirmation
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: { Authorization: token },
      });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setMenuOpen(null); // Close dropdown after deletion
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  // Update Profile
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setMessage("Updating profile...");

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user/profile`,
        { name: editName, email: editEmail },
        { headers: { Authorization: token } }
      );

      setUser((prev) =>
        prev ? { ...prev, name: editName, email: editEmail } : null
      );
      setMessage("Profile updated ✅");
      setTimeout(() => {
        setIsEditOpen(false);
        setMessage("");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update ❌");
    }
  };

  // Update Password
  const handlePasswordUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setMessage("Updating password...");

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user/profile/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: token } }
      );
      setMessage("Password changed ✅");
      setTimeout(() => {
        closeEditModal();
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to change password ❌");
    }
  };

  // Open Modal
  const openEditProfile = () => {
    setMessage("");
    setIsPasswordMode(false);
    setIsEditOpen(true);
  };

  // Close Modal
  const closeEditModal = () => {
    setIsEditOpen(false);
    setIsPasswordMode(false);
    setOldPassword("");
    setNewPassword("");
    setMessage("");
  };

  // Strip HTML tags for preview
  const getTextPreview = (html: string, maxLength: number = 150): string => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="h-screen flex flex-col justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Profile section */}
        {user && (
          <div className="flex flex-col items-center mb-10">
            <Avatar size="big" name={user.name[0]} />
            <p className="text-2xl font-bold mt-3 text-gray-900">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <button
              onClick={openEditProfile}
              className="mt-3 px-5 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Your Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 mt-4 text-center">
            No blogs found. Start writing!
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-all relative"
              >
                <div className="flex items-start space-x-4">
                  <Avatar size="big" name={blog.author.name[0]} />
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      {getTextPreview(blog.content)}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      By {blog.author.name}
                    </p>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div
                  className="absolute top-4 right-4"
                  ref={(el) => (dropdownRefs.current[blog.id] = el)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === blog.id ? null : blog.id);
                    }}
                    className="px-2 py-1 rounded hover:bg-gray-200 transition cursor-pointer text-lg font-bold"
                    aria-label="More options"
                  >
                    &#x22EE;
                  </button>

                  {menuOpen === blog.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add edit functionality here
                          console.log("Edit blog:", blog.id);
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer rounded-t-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(blog.id);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer rounded-b-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🌫️ Edit Profile / Change Password Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50 transition">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-6 w-[90%] max-w-md text-white">
            <h2 className="text-2xl font-semibold mb-5 text-center">
              {isPasswordMode ? "Change Password" : "Edit Profile"}
            </h2>

            {!isPasswordMode ? (
              <>
                <input
                  className="w-full px-3 py-2 mb-3 bg-gray-700/60 border border-gray-500/40 rounded-md text-sm placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  className="w-full px-3 py-2 mb-5 bg-gray-700/60 border border-gray-500/40 rounded-md text-sm placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </>
            ) : (
              <>
                <input
                  className="w-full px-3 py-2 mb-3 bg-gray-700/60 border border-gray-500/40 rounded-md text-sm placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  className="w-full px-3 py-2 mb-5 bg-gray-700/60 border border-gray-500/40 rounded-md text-sm placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </>
            )}

            {message && (
              <p className="text-sm text-center text-gray-200 mt-2">
                {message}
              </p>
            )}

            <div className="flex justify-between mt-5 gap-3">
              {!isPasswordMode ? (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsPasswordMode(true);
                      setMessage("");
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePasswordUpdate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setIsPasswordMode(false);
                      setOldPassword("");
                      setNewPassword("");
                      setMessage("");
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
