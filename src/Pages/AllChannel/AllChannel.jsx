// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// const AllChannel = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [filtered, setFiltered] = useState([]);

//   // Fetch all channels
//   const fetchChannels = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/");
//       setData(res.data);
//       setFiltered(res.data); // Initially all
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChannels();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//       });

//       if (result.isConfirmed) {
//         // Delete call backend
//         await axios.delete(`http://localhost:4000/${id}`);

//         // UI update
//         const updatedData = data.filter((ch) => ch._id !== id);
//         setData(updatedData);
//         setFiltered(updatedData);

//         // Success Swal
//         await Swal.fire({
//           title: "Deleted!",
//           text: "Your channel has been deleted.",
//           icon: "success",
//         });
//       }
//     } catch (err) {
//       Swal.fire({
//         title: "Error!",
//         text: `Failed to delete channel${err.message}`,
//         icon: "error",
//       });
//     }
//   };

//   // Edit placeholder
//   const handleEdit = (channel) => {
//     alert(`Edit functionality for: ${channel.name}`);
//   };

//   // Search button click
//   const handleSearch = () => {
//     const q = query.trim().toLowerCase();
//     if (!q) {
//       setFiltered(data);
//       return;
//     }
//     const result = data.filter(
//       (ch) =>
//         ch.name.toLowerCase().includes(q) ||
//         (ch.group && ch.group.toLowerCase().includes(q))
//     );
//     setFiltered(result);
//   };

//   // Reset button click
//   const handleReset = () => {
//     setQuery("");
//     setFiltered(data);
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto mt-6">
//       <h2 className="text-2xl font-semibold mb-4">
//         All Channels ({filtered.length})
//       </h2>

//       {/* Search */}
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by name or group..."
//           className="p-2 border rounded w-full"
//         />
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Search
//         </button>
//         <button
//           onClick={handleReset}
//           className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Table */}
//       <table className="w-full border-collapse shadow rounded overflow-hidden">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-4 py-2">#</th>
//             <th className="border px-4 py-2">Logo</th>
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Group</th>
//             <th className="border px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filtered.length > 0 ? (
//             filtered.map((ch, index) => (
//               <tr key={ch._id || index} className="hover:bg-gray-50">
//                 <td className="border px-4 py-2 text-center">{index + 1}</td>
//                 <td className="border px-4 py-2 text-center">
//                   <img
//                     src={ch.logo}
//                     alt={ch.name}
//                     className="w-12 h-8 object-contain mx-auto"
//                   />
//                 </td>
//                 <td className="border px-4 py-2">{ch.name}</td>
//                 <td className="border px-4 py-2">{ch.group}</td>
//                 <td className="border px-4 py-2 text-center space-x-2">
//                   <button
//                     onClick={() => handleEdit(ch)}
//                     className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(ch._id)}
//                     className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={5} className="text-center py-4 text-gray-500">
//                 No channels found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AllChannel;

import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";

const AllChannel = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const api = useApi();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    group: "",
    logo: "",
    url: "",
  });

  // Fetch all channels
  const fetchChannels = async () => {
    try {
      const res = await axios.get("http://localhost:4000/");
      setData(res.data);
      setFiltered(res.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
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
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await api.delete(`/${id}`);
        const updatedData = data.filter((ch) => ch._id !== id);
        setData(updatedData);
        setFiltered(updatedData);
        await Swal.fire(
          "Deleted!",
          "Your channel has been deleted.",
          "success"
        );
      }
    } catch (err) {
      Swal.fire("Error!", `Failed to delete channel: ${err.message}`, "error");
    }
  };

  // Open Edit modal
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
    const token = localStorage.getItem("access-token");
    try {
      const { _id } = selectedChannel;

      await axios.put(`http://localhost:4000/${_id}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = data.map((ch) =>
        ch._id === _id ? { ...ch, ...editData } : ch
      );
      setData(updatedData);
      setFiltered(updatedData);
      setEditModalOpen(false);
      Swal.fire("Updated!", "Channel has been updated.", "success");
    } catch (err) {
      Swal.fire("Error!", "Failed to update channel.", "error", err);
    }
  };

  // Search
  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(data);
      return;
    }
    const result = data.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) ||
        (ch.group && ch.group.toLowerCase().includes(q))
    );
    setFiltered(result);
  };

  // Reset
  const handleReset = () => {
    setQuery("");
    setFiltered(data);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">
        All Channels ({filtered.length})
      </h2>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or group..."
          className="p-2 border rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>
      {/*  */}
      {/* Table */}
      <table className="w-full border-collapse shadow rounded overflow-hidden">
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
          {filtered.length > 0 ? (
            filtered.map((ch, index) => (
              <tr key={ch._id || index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 text-center">
                  <img
                    src={ch.logo || ""}
                    alt={ch.name}
                    className="w-12 h-8 object-contain mx-auto"
                  />
                </td>
                <td className="border px-4 py-2">{ch.name}</td>
                <td className="border px-4 py-2">{ch.group}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(ch)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ch._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
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
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllChannel;
