import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router";

const AllChannel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    group: "",
    logo: "",
    url: "",
  });

  const token = localStorage.getItem("access-token");

  // Fetch channels
  const fetchChannels = async () => {
    try {
      const res = await axios.get("https://ip-backend-five.vercel.app/");
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Delete channel
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`https://ip-backend-five.vercel.app/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedData = data.filter((ch) => ch._id !== id);
        setData(updatedData);
        setFiltered(updatedData);
        Swal.fire("Deleted!", "Channel has been deleted.", "success");
      }
    } catch (err) {
      Swal.fire("Error!", `Failed to delete channel: ${err?.message}`, "error");
    }
  };

  // Open edit modal
  const handleEdit = (channel) => {
    setSelectedChannel(channel);
    setEditData({
      name: channel.name,
      group: channel.group,
      logo: channel.logo,
      url: channel.url || "",
    });
    setEditModalOpen(true);
  };

  // Update channel
  const handleUpdate = async () => {
    try {
      const { _id } = selectedChannel;
      await axios.put(`https://ip-backend-five.vercel.app/${_id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = data.map((ch) =>
        ch._id === _id ? { ...ch, ...editData } : ch
      );
      setData(updatedData);
      setFiltered(updatedData);
      setEditModalOpen(false);
      Swal.fire("Updated!", "Channel has been updated.", "success");
    } catch (err) {
      Swal.fire("Error!", "Failed to update channel.", err?.message);
    }
  };

  // Search + filter
  const handleFilter = () => {
    let result = [...data];

    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (ch) =>
          ch.name.toLowerCase().includes(q) ||
          (ch.group && ch.group.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (category !== "ALL") {
      result = result.filter(
        (ch) => ch.group && ch.group.toLowerCase() === category.toLowerCase()
      );
    }

    setFiltered(result);
  };

  // Reset filters
  const handleReset = () => {
    setQuery("");
    setCategory("ALL");
    setFiltered(data);
  };

  if (loading) return <Loading />;

  // Extract unique categories for dropdown
  const categories = [
    "ALL",
    ...new Set(data.map((ch) => ch.group).filter(Boolean)),
  ];

  return (
    <div className="bg-base-300 min-h-screen">
      <div className="max-w-7xl container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          All Channels ({filtered.length})
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="p-2 border rounded w-full sm:w-1/3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/4"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Reset
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Logo</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Group</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((ch, index) => (
                  <tr key={ch._id} className="hover:bg-gray-200 cursor-pointer">
                    <td className="border px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <img
                        src={
                          ch.logo ||
                          "data:image/jpeg;base64,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"
                        }
                        alt={ch.name}
                        className="w-12 h-8 mx-auto object-contain"
                      />
                    </td>
                    <td className="border px-4 py-2">{ch.name}</td>
                    <td className="border px-4 py-2">{ch.group}</td>
                    <td className="border px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(ch)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ch._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No channels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Channel</h2>
              <input
                type="text"
                placeholder="Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Group"
                value={editData.group}
                onChange={(e) =>
                  setEditData({ ...editData, group: e.target.value })
                }
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Logo URL"
                value={editData.logo}
                onChange={(e) =>
                  setEditData({ ...editData, logo: e.target.value })
                }
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Stream URL"
                value={editData.url}
                onChange={(e) =>
                  setEditData({ ...editData, url: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChannel;
