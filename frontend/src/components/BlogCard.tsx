import { Link } from "react-router-dom";
import {
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface BlogCardProps {
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  commentCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  imageUrl?: string;
  variant?: "list" | "grid";
}

export const BlogCard = ({
  id,
  authorName,
  authorAvatar,
  title,
  content,
  publishedDate,
  commentCount = 0,
  likeCount = 0,
  imageUrl,
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
              <Avatar name={authorName} image={authorAvatar} size="small" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {authorName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {publishedDate}
                </p>
              </div>
            </div>

            {/* Image Section */}
          {imageUrl && (
            <div className="w-full md:w-48 lg:w-56 shrink-0 order-first md:order-last">
              <div className="h-56 md:h-48 lg:h-56 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}  {/* Title */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
              {title}
            </h2>

            {/* Content Preview */}
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed line-clamp-2 md:line-clamp-3 hidden sm:block font-serif">
                {(() => {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(content, "text/html");
                  const toRemove = doc.querySelectorAll("style, script");
                  toRemove.forEach((el) => el.remove());
                  const plainText = doc.body.textContent || "";
                  return (
                    plainText.slice(0, 250) +
                    (plainText.length > 250 ? "..." : "")
                  );
                })()}
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


  return (
    <Link to={`/blog/${id}`}>
      <article className="group relative border-b border-slate-200 dark:border-slate-800 py-8 first:pt-0 last:border-0">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col h-full">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar name={authorName} image={authorAvatar} size="small" />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {authorName}
                </span>
                <span className="text-slate-500 dark:text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {publishedDate}
                </span>
              </div>
            </div>

            {/* Title & Preview */}
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors break-words">
                {title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed line-clamp-2 md:line-clamp-3 hidden sm:block font-serif break-words">
                {(() => {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(content, "text/html");
                  const toRemove = doc.querySelectorAll("style, script");
                  toRemove.forEach((el) => el.remove());
                  const plainText = doc.body.textContent || "";
                  return (
                    plainText.slice(0, 200) +
                    (plainText.length > 200 ? "..." : "")
                  );
                })()}
              </p>
            </div>

            {/* Footer Stats */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-xs font-medium">
                    Article
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span className="font-medium">{commentCount}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  <HandThumbUpIcon className="w-4 h-4" />
                  <span className="font-medium">{likeCount}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          {imageUrl && (
            <div className="w-full md:w-40 lg:w-48 shrink-0 order-first md:order-last">
              <div className="h-48 md:h-28 lg:h-32 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}
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
  image,
}: {
  name?: string;
  size?: "small" | "big";
  image?: string;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${
        size === "small" ? "w-9 h-9" : "w-12 h-12"
      } bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={`${
            size === "small" ? "text-sm" : "text-lg"
          } font-semibold text-white`}
        >
          {name[0]?.toUpperCase() || "A"}
        </span>
      )}
    </div>
  );
}
