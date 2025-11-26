import { Link } from "react-router-dom";
import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  commentCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  imageUrl?: string;
  avatar?: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  commentCount = 0,
  likeCount = 0,
  dislikeCount = 0,
  imageUrl,
  avatar,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`} className="block group">
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500/50 relative overflow-hidden group">
        <div className="p-8">
          {/* Decorative gradient blob */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar name={authorName} avatar={avatar} />
              <div className="flex flex-col">
                <span className="text-sm text-slate-900 dark:text-slate-200 font-bold">
                  {authorName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{publishedDate}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed line-clamp-3 mb-6 font-medium">
              {content}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {`${Math.ceil(content.length / 100)} min read`}
              </span>
              <div className="flex items-center gap-5 text-slate-400">
                <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{commentCount}</span>
                </span>
                <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                  <HandThumbUpIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{likeCount}</span>
                </span>
                <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                  <HandThumbDownIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{dislikeCount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};



export function Avatar({
  name = "A",
  size = "small",
  avatar,
}: {
  name?: string;
  size?: "small" | "big";
  avatar?: string;
}) {
  const sizeClasses = size === "small" ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg";

  if (avatar) {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${sizeClasses}`}
      >
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${sizeClasses} bg-blue-600`}
    >
      <span className="font-semibold text-white">
        {name[0]?.toUpperCase() || "A"}
      </span>
    </div>
  );
}
