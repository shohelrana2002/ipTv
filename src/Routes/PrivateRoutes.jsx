import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import useGetAuth from "../Hooks/useGetAuth";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading/Loading";

const PrivateRoutes = ({ children }) => {
  const { loading, setLoading } = useGetAuth();
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access-token");
        if (!token) {
          <Navigate to={"/login"} state={location?.pathname} replace />; // navigate inside useEffect
          return;
        }

        const { data } = await axios.get("http://localhost:4000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // assuming first user is the logged in user
        const user = data[0];
        setUserData(user);
        if (!user || user.role !== "admin") {
          ("/login");
        }
      } catch (err) {
        toast.error(err?.message);
        localStorage.removeItem("access-token");
        <Navigate to={"/login"} state={location?.pathname} replace />; // navigate inside useEffect
      } finally {
        setLoading(false);
        setFetching(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (loading || fetching) return <Loading />;

  return userData && userData.role === "admin" ? <>{children}</> : null;
};

export default PrivateRoutes;
