import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access-token");
  const navigate = useNavigate();
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token]);

  // Handle role change
  const handleRoleChange = async (email, newRole) => {
    if (!token) return toast.error("No token found. Please login.");

    try {
      const { data } = await axios.patch(
        `http://localhost:4000/dashBoard/allUsers/${email}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Role update failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Change Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, i) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium text-gray-800">{user.name}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.email, e.target.value)
                    }
                    className={`border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-indigo-300 focus:outline-none ${
                      user.email === localStorage.getItem("user-email")
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    disabled={user.email === localStorage.getItem("user-email")}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-2">
        <button onClick={() => navigate(-1)} className="btn btn-outline ">
          Back To Page
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
