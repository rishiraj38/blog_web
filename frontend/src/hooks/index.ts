import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  author: {
    name: string;
    avatar?: string;
  };
  commentCount: number;
  reactionCounts: {
    likes: number;
    dislikes: number;
  };
}

// Hook to fetch a single blog by ID
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get<Blog>(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          {
            headers: { Authorization: localStorage.getItem("token") || "" },
          }
        );
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return { loading, blog };
};

// Hook to fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<{ blogs: Blog[] }>(
          `${BACKEND_URL}/api/v1/blog/bulk`,
          {
            headers: { Authorization: localStorage.getItem("token") || "" },
          }
        );
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { loading, blogs };
};
