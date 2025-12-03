import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { SideBar } from "../components/SideBar";
import { useBlogs } from "../hooks";
import { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "All",
    "Technology",
    "Design",
    "Writing",
    "Business",
    "Health",
    "Science",
  ];

  const filteredSortedBlogs = useMemo(() => {
    let filtered = blogs.filter(
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Appbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Discover Stories
          </h1>
          <p className="text-blue-100 text-base">
            Explore thoughtful articles and insights from writers around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            {/* Category Pills */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(
                        category === "All" ? null : category
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                      (category === "All" && !selectedCategory) ||
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search, Filter & View Toggle Bar */}
            <div className="sticky top-20 z-30 mb-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search stories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 font-medium text-sm"
                    />
                  </div>

                  {/* Sort */}
                  <div className="relative min-w-[180px]">
                    <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer border-0"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="titleAsc">Title A → Z</option>
                      <option value="titleDesc">Title Z → A</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all cursor-pointer ${
                        viewMode === "list"
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-500 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      title="List view"
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-500 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                      title="Grid view"
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Content */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-5"
                }
              >
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
              </div>
            ) : filteredSortedBlogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No stories found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-5"
                }
              >
                {filteredSortedBlogs.map((blog) => {
                  const reactions = blog.reactionCounts || {
                    likes: 0,
                    dislikes: 0,
                  };

                  return (
                    <BlogCard
                      key={blog.id}
                      id={blog.id}
                      authorName={blog.author.name || "Anonymous"}
                      authorAvatar={blog.author.avatar}
                      title={blog.title}
                      content={blog.content}
                      publishedDate={formatDate(blog.createdAt)}
                      commentCount={blog.commentCount || 0}
                      likeCount={reactions.likes}
                      dislikeCount={reactions.dislikes}
                      imageUrl={blog.imageUrl}
                      variant={viewMode}
                    />
                  );
                })}
              </div>
            )}
          </main>

          {/* Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4 custom-scrollbar">
              <SideBar blogs={blogs} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
