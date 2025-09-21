import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title || !description) return alert("Please fill all fields");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content: description },
        {
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to publish blog");
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Navbar with Publish button */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Draft</h1>
        </div>
        <button
          onClick={handlePublish}
          className="px-6 py-2 bg-green-200 text-green-900 font-medium rounded-full hover:bg-green-300 transition cursor-pointer"
        >
          Publish
        </button>
      </div>

      {/* Editor */}
      <div className="flex justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          {/* Title Input */}
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full text-5xl font-serif font-bold text-gray-800 placeholder-gray-400 focus:outline-none mb-6"
            placeholder="Title"
          />

          {/* Content Editor */}
          <TextEditor onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

function TextEditor({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      onChange={onChange}
      rows={20}
      className="w-full text-xl text-gray-800 font-serif placeholder-gray-400 focus:outline-none resize-none"
      placeholder="Tell your story..."
    />
  );
}
