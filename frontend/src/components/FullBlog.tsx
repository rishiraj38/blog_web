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
    <div className="bg-white min-h-screen">
      <Appbar />

      <div className="flex justify-center px-4 sm:px-10 md:px-16 lg:px-24 pt-12 pb-20">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            {blog.title}
          </h1>

          {/* Author + Meta Info */}
          <div className="flex items-center gap-3 mb-10">
            <Avatar size="small" name={blog.author.name || "Anonymous"} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">
                  {blog.author.name || "Anonymous"}
                </span>
                <button className="ml-2 px-3 py-0.5 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition">
                  Follow
                </button>
              </div>
              <div className="text-gray-500 text-sm">
                {publishedDate} · {Math.ceil(blog.content.length / 100)} min
                read
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-6">
            {blog.content}
          </div>

          {/* Reaction Buttons */}
          <Reaction postId={blog.id} />

          {/* Comments */}
          <Comments blogId={blog.id} />
        </div>
      </div>
    </div>
  );
};
