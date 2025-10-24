import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "../../Hooks/ImageUpload";
import { useNavigate } from "react-router";
import { useState } from "react";

const ChannelForm = ({ onAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
      group: "",
      logo: "",
      file: null,
    },
  });

  const [preview, setPreview] = useState(null); // logo preview
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Uploading image...");

    let uploadedLogo = data.logo; // direct image url

    if (data.file && data.file.length > 0) {
      try {
        const imgRes = await ImageUpload(data.file[0]);
        if (imgRes.success) {
          uploadedLogo = imgRes.data.url;
        } else {
          toast.error("Image upload failed!", { id: toastId });
          return;
        }
      } catch (err) {
        toast.error("Image upload error!", { id: toastId }, err?.message);
        return;
      }
    }

    const channelData = {
      name: data.name,
      url: data.url,
      group: data.group || "OTHERS",
      logo: uploadedLogo,
    };
    const token = localStorage.getItem("access-token");
    try {
      const res = await axios.post("http://localhost:4000/", channelData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("✅ Channel added successfully!", { id: toastId });
      reset();
      setPreview(null);
      if (onAdded) onAdded(res.data);
    } catch (err) {
      toast.error("Failed to save channel", { id: toastId }, err?.message);
    }
  };

  // handle file preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Channel
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Channel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="BTV"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Stream URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stream URL (.m3u8)
            </label>
            <input
              {...register("url", {
                required: "URL is required",
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: "Enter valid http/https URL",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/stream.m3u8"
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>

          {/* Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <input
              {...register("group")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="BANGLA / SPORTS"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL (optional)
            </label>
            <input
              {...register("logo")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://cdn.example.com/logo.png"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OR Upload Logo
            </label>
            <input
              type="file"
              {...register("file")}
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Logo Preview */}
          {preview && (
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
              <img
                src={preview}
                alt="logo preview"
                className="mx-auto h-24 object-contain border p-1 rounded-lg bg-gray-50 shadow-sm"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Add Channel"}
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Back to Page
        </button>
      </div>
    </div>
  );
};

export default ChannelForm;
