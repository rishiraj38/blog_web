import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post<{ url: string }>(`${BACKEND_URL}/api/v1/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      return response.data.url;
    } catch (err) {
      console.error("Upload failed", err);
      setError("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
