import { Appbar } from "../components/Appbar";
import { Spinner } from "../components/Spinner";
import { Avatar } from "../components/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

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

// Dashboard component
export const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch only the logged-in user's blogs
  const fetchUserBlogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/filter`, {
        headers: { Authorization: token },
      });
      // @ts-expect-error typeerror
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching your blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  // Delete a blog
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
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Blogs</h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 mt-4 text-center">
            No blogs found. Start writing!
          </p>
        ) : (
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Use Avatar component */}
                  <Avatar size="big" name={blog.author.name[0]} />
                  {/* Blog info */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      {blog.content.slice(0, 120)}...
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      By {blog.author.name}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
