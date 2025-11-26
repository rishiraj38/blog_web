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
      {/* Featured Blogs */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-5 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Featured Blogs</h2>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : featuredBlogs.length > 0 ? (
          <div className="space-y-4">
            {featuredBlogs.map((blog) => (
              <Link to={`/blog/${blog.id}`} key={blog.id}>
                <div className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 rounded-xl transition flex flex-col group">
                  <h3 className="text-md font-bold text-slate-900 dark:text-slate-200 mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {blog.content}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-medium">
                    By {blog.author?.name || "Anonymous"} ·{" "}
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No blogs available</p>
        )}
      </div>

      {/* Recommended Topics */}
      {/* Recommended Topics */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recommended topics</h2>
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
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition border border-transparent dark:border-slate-700"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
