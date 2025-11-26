import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { SideBar } from "../components/SideBar";
import { useBlogs } from "../hooks";
import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Appbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Feed */}
          <main className="flex-1">
            {/* Floating Search & Filter Bar */}
            <div className="sticky top-24 z-30 mb-10">
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search for stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
                  />
                </div>
                <div className="relative min-w-[200px] border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800">
                  <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="titleAsc">Title A → Z</option>
                    <option value="titleDesc">Title Z → A</option>
                  </select>
                  {/* Custom arrow for dark mode support if needed, but default select arrow usually adapts or is hidden by appearance-none. 
                      However, we need to ensure options have background in dark mode since they might be transparent otherwise on some browsers. */}
                  <style>{`
                    option {
                      background-color: var(--bg-option, #fff);
                      color: var(--text-option, #000);
                    }
                    .dark option {
                      background-color: #0f172a;
                      color: #fff;
                    }
                  `}</style>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-8">
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
              </div>
            ) : filteredSortedBlogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No stories found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid gap-8">
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
                      title={blog.title}
                      content={blog.content}
                      publishedDate={formatDate(blog.createdAt)}
                      commentCount={blog.commentCount || 0}
                      likeCount={reactions.likes}
                      dislikeCount={reactions.dislikes}
                    />
                  );
                })}
              </div>
            )}
          </main>

          {/* Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32">
              <SideBar blogs={blogs} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
