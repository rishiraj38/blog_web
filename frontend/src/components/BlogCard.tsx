import { Link } from "react-router-dom";
import {
  ChatBubbleLeftIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ClockIcon,
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
  variant?: "list" | "grid";
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
  variant = "list",
}: BlogCardProps) => {
  const readingTime = Math.ceil(content.length / 100);

  if (variant === "grid") {
    return (
      <Link to={`/blog/${id}`}>
        <article className="group relative bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 h-full flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={authorName} size="small" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {authorName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {publishedDate}
                </p>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
              {title}
            </h2>

            {/* Content Preview */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
              {content}
            </p>

            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>{readingTime} min</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                  {commentCount}
                </span>
                <span className="flex items-center gap-1">
                  <HandThumbUpIcon className="w-3.5 h-3.5" />
                  {likeCount}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // List variant (default)
  return (
    <Link to={`/blog/${id}`}>
      <article className="group relative bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="p-7">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={authorName} size="small" />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {authorName}
              </span>
              <Circle />
              <span className="text-slate-500 dark:text-slate-400">
                {publishedDate}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
            {title}
          </h2>

          {/* Content Preview */}
          <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed line-clamp-2 mb-5">
            {content}
          </p>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ClockIcon className="w-4 h-4" />
              <span className="font-medium">{readingTime} min read</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span className="font-medium">{commentCount}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                <HandThumbUpIcon className="w-4 h-4" />
                <span className="font-medium">{likeCount}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <HandThumbDownIcon className="w-4 h-4" />
                <span className="font-medium">{dislikeCount}</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600"></div>;
}

export function Avatar({
  name = "A",
  size = "small",
}: {
  name?: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${
        size === "small" ? "w-9 h-9" : "w-12 h-12"
      } bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm`}
    >
      <span
        className={`${
          size === "small" ? "text-sm" : "text-lg"
        } font-semibold text-white`}
      >
        {name[0]?.toUpperCase() || "A"}
      </span>
    </div>
  );
}
