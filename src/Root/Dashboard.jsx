import React from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar/NavBar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-blue-400 to-purple-500 p-4">
        <NavBar />
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Add Channel Button */}
          <button
            onClick={() => navigate("/dashBoard/channelAdd")}
            className="px-8 py-6 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition transform hover:scale-105"
          >
            Add Channel
          </button>

          {/* All Channels Button */}
          <button
            onClick={() => navigate("/dashBoard/allChannel")}
            className="px-8 py-6 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-purple-50 transition transform hover:scale-105"
          >
            All Channels
          </button>
          <button
            onClick={() => navigate("/dashBoard/allUsers")}
            className="px-8 py-6 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-purple-50 transition transform hover:scale-105"
          >
            All Users
          </button>
        </div>

        <p className="mt-10 text-white text-lg opacity-80">
          Manage your channels easily from here.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
