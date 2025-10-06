import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author?: { name?: string; avatarUrl?: string }; // optional avatarUrl
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
  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">Comments</h3>

      {loading ? (
        <div className="space-y-4 mb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-5 mb-8">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {c.author?.avatarUrl ? (
                  <img
                    src={c.author.avatarUrl}
                    alt={c.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {getInitials(c.author?.name)}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">
                    {c.author?.name || "Anonymous"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition disabled:opacity-60"
        >
          Post
        </button>
      </form>
    </div>
  );
};
