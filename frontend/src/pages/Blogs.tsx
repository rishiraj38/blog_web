import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { SideBar } from "../components/SideBar";
import { useBlogs } from "../hooks";


export const getRecentDate = () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 60);
  const randomTime = new Date(
    past.getTime() + Math.random() * (today.getTime() - past.getTime())
  );
  return randomTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Appbar />

      <div className="flex justify-center px-6 py-8">
        {/* ====== MAIN FEED ====== */}
        <main className="flex-1 max-w-3xl">
          {loading ? (
            <div className="grid gap-6">
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </div>
          ) : (
            <div className="grid gap-6">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={getRecentDate()}
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
