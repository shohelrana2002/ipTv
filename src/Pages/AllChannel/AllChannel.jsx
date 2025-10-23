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
      const res = await axios.get("http://localhost:4000/");
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error(err.message);
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
        await axios.delete(`http://localhost:4000/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedData = data.filter((ch) => ch._id !== id);
        setData(updatedData);
        setFiltered(updatedData);
        Swal.fire("Deleted!", "Channel has been deleted.", "success");
      }
    } catch (err) {
      Swal.fire("Error!", `Failed to delete channel: ${err.message}`, "error");
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
      await axios.put(`http://localhost:4000/${_id}`, editData, {
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
      Swal.fire("Error!", "Failed to update channel.", err);
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
                        src={ch.logo || ""}
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
