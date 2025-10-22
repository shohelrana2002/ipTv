import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useGetAuth from "../Hooks/useGetAuth";
import axios from "axios";
import toast from "react-hot-toast";

const PrivateRoutes = ({ children }) => {
  const { loading } = useGetAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access-token");
        if (!token) {
          navigate("/login"); // navigate inside useEffect
          return;
        }

        const { data } = await axios.get("http://localhost:4000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // assuming first user is the logged in user
        const user = data[0];
        setUserData(user);
        if (!user || user.role !== "admin") {
          navigate("/login");
        }
      } catch (err) {
        toast.error(err.message);
        localStorage.removeItem("access-token");
        navigate("/login");
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading || fetching) return <div>Loading...</div>;

  return userData && userData.role === "admin" ? <>{children}</> : null;
};

export default PrivateRoutes;
