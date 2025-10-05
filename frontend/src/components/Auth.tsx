import type { SignupInput } from "@rishi438/zod";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/blogs");
    }
  }, [navigate]);

  async function sendRequest() {
    if (loading) return; 
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      const jwt = response.data;
      localStorage.setItem("token", String(jwt));
      navigate("/blogs");
    } catch (e) {
      if (e) {
        // @ts-expect-error expect
        setError(e.response?.data?.message || "Something went wrong");
      } else {
        setError("Error while signing in");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">
              {type === "signup" ? "Create an account" : "Welcome back"}
            </div>
            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>

          <div className="pt-8">
            {type === "signup" && (
              <LabelledInput
                label="Name"
                placeholder="Rishi Raj..."
                onChange={(e) =>
                  setPostInputs({ ...postInputs, name: e.target.value })
                }
              />
            )}

            <LabelledInput
              label="Email"
              placeholder="testuser@gmail.com"
              onChange={(e) =>
                setPostInputs({ ...postInputs, email: e.target.value })
              }
            />

            <LabelledInput
              label="Password"
              type="password"
              placeholder="123456"
              onChange={(e) =>
                setPostInputs({ ...postInputs, password: e.target.value })
              }
            />

            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

            <button
              onClick={sendRequest}
              type="button"
              disabled={loading}
              className={`mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 
                focus:outline-none focus:ring-4 focus:ring-gray-300 
                font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading
                ? "Please wait..."
                : type === "signup"
                ? "Sign up"
                : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
