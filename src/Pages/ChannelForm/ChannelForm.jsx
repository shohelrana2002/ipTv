import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "../../Hooks/ImageUpload";

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
        toast.error("Image upload error!", { id: toastId }, err);
        return;
      }
    }

    const channelData = {
      name: data.name,
      url: data.url,
      group: data.group || "OTHERS",
      logo: uploadedLogo,
    };

    try {
      const res = await axios.post("http://localhost:4000/", channelData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("✅ Channel added successfully!", { id: toastId });
      reset();
      if (onAdded) onAdded(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save channel", { id: toastId });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
      <Toaster position="top-right" />
      <h3 className="text-lg font-semibold mb-3">Add Channel</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Channel Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded"
            placeholder="BTV"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
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
            className="w-full p-2 border rounded"
            placeholder="https://example.com/stream.m3u8"
          />
          {errors.url && (
            <p className="text-red-500 text-xs">{errors.url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Group</label>
          <input
            {...register("group")}
            className="w-full p-2 border rounded"
            placeholder="BANGLA / SPORTS"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Logo URL (optional)
          </label>
          <input
            {...register("logo")}
            className="w-full p-2 border rounded"
            placeholder="https://cdn.example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">OR Upload Logo</label>
          <input
            type="file"
            {...register("file")}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Add Channel"}
        </button>
      </form>
    </div>
  );
};

export default ChannelForm;
