import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar } from "./BlogCard";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author?: { name?: string; avatarUrl?: string }; 
}

export const Comments = ({ blogId }: { blogId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/v1/comment/${blogId}`, {
          headers: { Authorization: token },
        });
        // @ts-expect-error: Backend response type may not match Comment[] exactly
        setComments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [blogId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/api/v1/comment`,
        { postId: blogId, content: newComment },
        { headers: { Authorization: token } }
      );

      setComments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: newComment,
          createdAt: new Date().toISOString(),
          author: { name: "You" },
        },
      ]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    }
  };

  // Function to generate initials avatar if no image

  return (
    <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
      <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
        Comments
        <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {loading ? (
        <div className="space-y-4 mb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-5 mb-8">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar name={c.author?.name || "A"} size="small" />
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">
                    {c.author?.name || "Anonymous"}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Leave a comment</h4>
        <div className="relative">
            <textarea
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-y"
            />
            <button
            type="submit"
            disabled={!newComment.trim()}
            className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
            <PaperAirplaneIcon className="w-5 h-5" />
            </button>
        </div>
      </form>
    </div>
  );
};
