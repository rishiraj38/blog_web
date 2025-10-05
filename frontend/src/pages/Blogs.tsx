import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { SideBar } from "../components/SideBar";
import { useBlogs } from "../hooks";
import { useState, useMemo } from "react";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const filteredSortedBlogs = useMemo(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortOption === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortOption === "titleAsc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "titleDesc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return filtered;
  }, [blogs, searchTerm, sortOption]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Appbar />

      <div className="flex justify-center px-6 py-8">
        <main className="flex-1 max-w-3xl">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-2/3 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-1/3 border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="titleAsc">Title A → Z</option>
              <option value="titleDesc">Title Z → A</option>
            </select>
          </div>

          {loading ? (
            <div className="grid gap-6">
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </div>
          ) : filteredSortedBlogs.length === 0 ? (
            <p className="text-gray-500 mt-4 text-center">
              No blogs found. Try searching or create a new post!
            </p>
          ) : (
            <div className="grid gap-6">
              {filteredSortedBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={formatDate(blog.createdAt)} // use createdAt
                />
              ))}
            </div>
          )}
        </main>

        <SideBar blogs={blogs} loading={loading} />
      </div>
    </div>
  );
};
