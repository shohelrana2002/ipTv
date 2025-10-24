import { useState } from "react";
import { useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useGetAuth from "../../Hooks/useGetAuth";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();
  const { handleSignUp, handleSendEmailVerification } = useGetAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSignUp(form.email, form.password);
      await handleSendEmailVerification();
      toast.success("Verification mail sent! Please check your Gmail 📧");
      await axios.post("http://localhost:4000/users", {
        name: form.name,
        email: form.email,
        role: "user",
      });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || err?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-indigo-600 to-purple-600 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
      >
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-center text-gray-800 mb-6"
        >
          Create Account ✨
        </motion.h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-lg p-3 transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-lg p-3 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-gray-600 font-medium">Password</label>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-lg p-3 pr-10 transition-all duration-200"
            />
            <span
              className="absolute right-4 top-10 cursor-pointer select-none text-xl"
              onClick={() => setShow(!show)}
              title="Show/Hide Password"
            >
              {show ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Role */}
          <div>
            <label className="text-gray-600 font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-lg p-3 transition-all duration-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Register Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
          >
            Register
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 mt-6"
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
