import type { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { Comments } from "./Comments";
import { Reaction } from "./Reaction";
import { Tooltip } from "./Tooltip";

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
              <h1 className="text-1xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                {blog.title}
              </h1>

              {/* Cover Image */}
              {blog.imageUrl && (
                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}

              {/* Author + Meta Info */}
              <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-slate-700">
                <Avatar size="big" name={blog.author.name || "Anonymous"} image={blog.author.avatar} />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white text-lg">
                      {blog.author.name || "Anonymous"}
                    </span>
                    <Tooltip content="Coming Soon">
                      <button disabled className="px-4 py-1 text-xs font-bold text-blue-700/50 dark:text-blue-300/50 bg-blue-100/50 dark:bg-blue-900/30 rounded-full cursor-not-allowed transition-colors">
                        Follow
                      </button>
                    </Tooltip>
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
