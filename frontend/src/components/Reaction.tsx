import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";

type ReactionType = "like" | "dislike" | null;

interface ReactionCounts {
  likes: number;
  dislikes: number;
}

interface ReactionResponse {
  likes: number;
  dislikes: number;
  userReaction: ReactionType;
}

interface ReactionProps {
  postId: string;
}

export const Reaction = ({ postId }: ReactionProps) => {
  const [userReaction, setUserReaction] = useState<ReactionType>(null);
  const [counts, setCounts] = useState<ReactionCounts>({
    likes: 0,
    dislikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchReaction = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ReactionResponse>(
          `${BACKEND_URL}/api/v1/reaction/${postId}`,
          {
            headers: { Authorization: token },
          }
        );
        setCounts({ likes: res.data.likes, dislikes: res.data.dislikes });
        setUserReaction(res.data.userReaction);
      } catch (err) {
        console.error("Failed to fetch reactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReaction();
  }, [postId, token]);

  const handleReaction = async (type: "like" | "dislike") => {
    if (loading || updating) return; 
    setUpdating(true);

    const prevCounts = { ...counts };
    const prevReaction = userReaction;

    const keyMap: Record<Exclude<ReactionType, null>, keyof ReactionCounts> = {
      like: "likes",
      dislike: "dislikes",
    };

    const newCounts = { ...counts };

    if (userReaction === type) {
      newCounts[keyMap[type]] -= 1;
      setUserReaction(null);
    } else {
      if (userReaction) newCounts[keyMap[userReaction]] -= 1;
      newCounts[keyMap[type]] += 1;
      setUserReaction(type);
    }
    setCounts(newCounts);

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/reaction/${postId}`,
        { type },
        { headers: { Authorization: token } }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update reaction");
      setCounts(prevCounts);
      setUserReaction(prevReaction);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={() => handleReaction("like")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer ${
          userReaction === "like"
            ? "bg-blue-500 text-white border-blue-500"
            : "border-gray-300 text-gray-700"
        } hover:bg-blue-100 transition`}
        disabled={loading || updating}
      >
        <HandThumbUpIcon className="w-5 h-5" /> {counts.likes}
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer ${
          userReaction === "dislike"
            ? "bg-red-500 text-white border-red-500"
            : "border-gray-300 text-gray-700"
        } hover:bg-red-100 transition`}
        disabled={loading || updating}
      >
        <HandThumbDownIcon className="w-5 h-5" /> {counts.dislikes}
      </button>
    </div>
  );
};
