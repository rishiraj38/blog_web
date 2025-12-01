import { Appbar } from "../components/Appbar";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { Avatar } from "../components/BlogCard";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { jwtDecode } from "jwt-decode";
import { Upload, X, Loader2, MoreVertical } from "lucide-react";
import { useUpload } from "../hooks/useUpload";
import { Tooltip } from "../components/Tooltip";

interface Author {
  name: string;
  avatar?: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: Author;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
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
  const [editAvatar, setEditAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
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
      // Decode token for initial state
      const decoded: User = jwtDecode(token);
      setUser(decoded);
      
      // Fetch fresh user details
      const userResponse = await axios.get<User>(`${BACKEND_URL}/api/v1/user/details`, {
        headers: { Authorization: token },
      });
      const freshUser = userResponse.data;
      setUser(freshUser);
      
      setEditName(freshUser.name);
      setEditEmail(freshUser.email);
      if (freshUser.avatar) {
        setEditAvatar(freshUser.avatar);
        setAvatarPreview(freshUser.avatar);
      }
    } catch (e) {
      console.error("Error fetching user details", e);
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

  const { uploadImage, uploading: avatarUploading } = useUpload();

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    const url = await uploadImage(file);
    if (url) {
      setEditAvatar(url);
    } else {
      alert("Failed to upload avatar. Please try again.");
      setAvatarPreview(user?.avatar || ""); // Revert to original avatar
    }
  };

  const removeAvatar = () => {
    setEditAvatar("");
    setAvatarPreview("");
  };

  // Update Profile
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setMessage("Updating profile...");

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user/profile`,
        { name: editName, email: editEmail, avatar: editAvatar },
        { headers: { Authorization: token } }
      );

      setUser((prev) =>
        prev ? { ...prev, name: editName, email: editEmail, avatar: editAvatar } : null
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
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditAvatar(user.avatar || "");
      setAvatarPreview(user.avatar || "");
    }
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
      <div className="dark:bg-slate-900 min-h-screen">
        <Appbar />
        <div className="h-screen flex flex-col justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Appbar />
      <div className="p-6 max-w-6xl mx-auto py-12">
        {/* Profile section */}
        {user && (
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 mb-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
            <Avatar size="big" name={user.name} image={user.avatar} />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
              <div className="flex gap-3 justify-center md:justify-start">
                <button
                  onClick={openEditProfile}
                  className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                <Tooltip content="Coming Soon">
                  <button
                    disabled
                    className="px-5 py-2 text-sm font-semibold text-white bg-slate-900/50 dark:bg-blue-600/50 rounded-xl cursor-not-allowed transition-colors shadow-none"
                  >
                    View Public Profile
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-8 text-center px-8 border-l border-slate-100 dark:border-slate-800 hidden md:flex">
                <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{blogs.length}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Stories</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">0</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Followers</div>
                </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <span className="w-2 h-8 rounded-full bg-blue-500" />
          Your Stories
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't published any stories yet.</p>
            <button className="px-6 py-2.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors cursor-pointer">
                Write your first story
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">Published</span>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="relative" ref={(el) => (dropdownRefs.current[blog.id] = el)}>
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === blog.id ? null : blog.id);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {menuOpen === blog.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/publish/${blog.id}`);
                            setMenuOpen(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium cursor-pointer"
                        >
                            Edit Story
                        </button>
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(blog.id);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium cursor-pointer"
                        >
                            Delete
                        </button>
                        </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {getTextPreview(blog.content)}
                </p>
                
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Last updated recently</span>
                    <span>{Math.ceil(blog.content.length / 100)} min read</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🌫️ Edit Profile / Change Password Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden animate-fade-in-up border dark:border-slate-800">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
            
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">
              {isPasswordMode ? "Change Password" : "Edit Profile"}
            </h2>

            {!isPasswordMode ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-24 h-24 mb-2">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-full h-full rounded-full object-cover border-4 border-slate-100 dark:border-slate-800"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold border-4 border-slate-100 dark:border-slate-800">
                        {editName[0]?.toUpperCase() || "A"}
                      </div>
                    )}
                    <label className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg cursor-pointer transition-colors ${avatarUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                      {avatarUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={avatarUploading}
                      />
                    </label>
                    {avatarPreview && (
                      <button
                        onClick={removeAvatar}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click icon to upload photo</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">Name</label>
                    <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                    placeholder="Your Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">Email</label>
                    <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                    placeholder="your@email.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                  type="password"
                  placeholder="Current Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            )}

            {message && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-medium text-center ${message.includes("❌") ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"}`}>
                {message}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-8">
              {!isPasswordMode ? (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20"
                  >
                    Save Changes
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => {
                        setIsPasswordMode(true);
                        setMessage("");
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold transition-colors"
                    >
                        Password
                    </button>
                    <button
                        onClick={closeEditModal}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 py-3 rounded-xl font-bold transition-colors"
                    >
                        Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePasswordUpdate}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsPasswordMode(false);
                      setOldPassword("");
                      setNewPassword("");
                      setMessage("");
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold transition-colors"
                  >
                    Back to Profile
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
