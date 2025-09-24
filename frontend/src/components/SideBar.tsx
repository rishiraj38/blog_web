import { Link } from "react-router-dom";

type SideBarProps = {
  blogs: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: { name?: string };
  }[];
  loading: boolean;
};

export const SideBar = ({ blogs, loading }: SideBarProps) => {
  // Take first 3 blogs if available
  const featuredBlogs = blogs.slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <aside className="hidden lg:block w-80 pl-6">
      {/* Featured Blogs */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Featured Blogs</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : featuredBlogs.length > 0 ? (
          <div className="space-y-4">
            {featuredBlogs.map((blog) => (
              <Link to={`/blog/${blog.id}`} key={blog.id}>
                <div className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition flex flex-col">
                  <h3 className="text-md font-semibold text-gray-900 mb-1 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    By {blog.author?.name || "Anonymous"} ·{" "}
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No blogs available</p>
        )}
      </div>

      {/* Recommended Topics */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4">Recommended topics</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Writing",
            "Cryptocurrency",
            "Relationships",
            "Politics",
            "Python",
            "Money",
            "Health",
          ].map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer transition"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
