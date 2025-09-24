import { Appbar } from "../components/Appbar";
import { Spinner } from "../components/Spinner";
import { Avatar } from "../components/BlogCard";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {jwtDecode} from "jwt-decode";

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchUserBlogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
    } catch (e) {
      console.error("Invalid token", e);
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/filter`, {
        headers: { Authorization: token },
      });
      //@ts-expect-error: response.data.blogs type may not match Blog[] due to backend response shape
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching your blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: { Authorization: token },
      });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
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
            <button className="mt-2 px-5 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition cursor-pointer">
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
                      {blog.content.slice(0, 150)}...
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      By {blog.author.name}
                    </p>
                  </div>
                </div>

                {/* Three-dot dropdown */}
                <div className="absolute top-4 right-4" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === blog.id ? null : blog.id)
                    }
                    className="px-2 py-1 rounded hover:bg-gray-200 transition cursor-pointer text-lg font-bold"
                  >
                    &#x22EE;
                  </button>

                  {menuOpen === blog.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer"
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
    </div>
  );
};
