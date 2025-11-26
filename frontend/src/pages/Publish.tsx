import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { type ChangeEvent, useState, useEffect } from "react";
import { Image as ImageIcon, Type, FileText, Upload, Loader2, X } from "lucide-react";

export const Publish = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setFetching(true);
      axios
        .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          const blog = response.data as any;
          setTitle(blog.title);
          setDescription(blog.content);
          if (blog.imageUrl) {
            setImageUrl(blog.imageUrl);
            setImagePreview(blog.imageUrl);
          }
          setFetching(false);
        })
        .catch((e) => {
          console.error("Error fetching blog", e);
          setFetching(false);
        });
    }
  }, [id]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageUrl("");
    setImagePreview("");
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in title and content");
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(
          `${BACKEND_URL}/api/v1/blog`,
          {
            id,
            title,
            content: description,
            imageUrl: imageUrl || undefined,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        navigate(`/blog/${id}`);
      } else {
        const response = await axios.post<{ id: string }>(
          `${BACKEND_URL}/api/v1/blog`,
          {
            title,
            content: description,
            imageUrl: imageUrl || undefined,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        navigate(`/blog/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Appbar />
        <div className="h-screen flex flex-col justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Appbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {id ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {id ? "Update your story" : "Share your story with the world"}
            </p>
          </div>

          {/* Main form card */}
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <ImageIcon size={18} className="text-blue-600 dark:text-blue-400" />
                Add Image (Optional)
              </label>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={40} className="text-slate-400 dark:text-slate-500 mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG or GIF</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <Type size={18} className="text-blue-600 dark:text-blue-400" />
                Title
              </label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-lg font-semibold rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent block w-full px-5 py-4 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Enter an engaging title..."
              />
            </div>

            {/* Content Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                Content
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent block w-full px-5 py-4 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 min-h-[400px] resize-y"
                placeholder="Tell your story..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handlePublish}
                disabled={loading}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? (id ? "Updating..." : "Publishing...") : (id ? "Update Post" : "Publish Post")}
              </button>

              <button
                onClick={() => navigate("/blogs")}
                className="px-8 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Writing Tips */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
              ✨ Writing Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>• Start with a compelling hook to grab attention</li>
              <li>• Break up long paragraphs for better readability</li>
              <li>• Use the image upload to add visual interest</li>
              <li>• End with a clear call-to-action or conclusion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
