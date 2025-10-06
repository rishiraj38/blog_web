import { Link } from "react-router-dom";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"; 

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  commentCount?: number; // added comment count
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  commentCount = 0, // default 0
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl mx-auto mb-6 transition hover:shadow-md cursor-pointer">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar name={authorName} />
          <span className="text-sm text-gray-700 font-medium">
            {authorName}
          </span>
          <Circle />
          <span className="text-sm text-gray-500">{publishedDate}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-600 text-md font-light line-clamp-3">
          {content.slice(0, 120) + "..."}
        </p>
        <div className="flex justify-between items-center pt-4 text-gray-500 text-sm font-light">
          <span>{`${Math.ceil(content.length / 100)} minute(s) read`}</span>
          <span className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            {commentCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${
        size === "small" ? "w-8 h-8" : "w-12 h-12"
      } bg-gradient-to-r from-blue-500 to-cyan-400`}
    >
      <span
        className={`${
          size === "small" ? "text-sm" : "text-lg"
        } font-semibold text-white`}
      >
        {name[0].toUpperCase()}
      </span>
    </div>
  );
}
