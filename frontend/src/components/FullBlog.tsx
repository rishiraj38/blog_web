import type { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { Comments } from "./Comments";
import { Reaction } from "./Reaction";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const publishedDate = formatDate(blog.createdAt);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-20">
      <Appbar />

      <div className="flex justify-center px-4 sm:px-6 pt-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-8 md:p-16 relative">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                {blog.title}
              </h1>

              {/* Author + Meta Info */}
              <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-slate-700">
                <Avatar size="big" name={blog.author.name || "Anonymous"} avatar={blog.author.avatar} />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white text-lg">
                      {blog.author.name || "Anonymous"}
                    </span>
                    <button className="px-4 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                      Follow
                    </button>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                    {publishedDate} · {Math.ceil(blog.content.length / 100)} min read
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg md:prose-xl max-w-none text-slate-700 dark:text-slate-300 leading-relaxed mb-12 prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl whitespace-pre-wrap">
                {blog.content}
              </div>

              {/* Reaction Buttons */}
              <div className="mb-12">
                <Reaction postId={blog.id} />
              </div>

              {/* Comments */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8">
                <Comments blogId={blog.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
