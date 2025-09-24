import { Circle } from "./BlogCard";

export const BlogSkeleton = () => {
  return (
    <div
      role="status"
      className="animate-pulse bg-white rounded-xl shadow-sm p-6 w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Circle />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded-full w-32 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>

      <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>

      <div className="space-y-2 mb-4">
        <div className="h-2.5 bg-gray-200 rounded-full w-full"></div>
        <div className="h-2.5 bg-gray-200 rounded-full w-5/6"></div>
        <div className="h-2.5 bg-gray-200 rounded-full w-4/6"></div>
      </div>

      <div className="h-2.5 bg-gray-200 rounded-full w-20"></div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};
