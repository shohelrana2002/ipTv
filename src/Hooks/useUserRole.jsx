import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useUserRole = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access-token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          "https://ip-backend-five.vercel.app/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        toast.error(err?.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, role: user?.role, loading };
};

export default useUserRole;
