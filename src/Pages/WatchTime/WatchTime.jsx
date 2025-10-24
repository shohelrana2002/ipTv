import React, { useEffect, useState } from "react";
import useBaseURL from "../../Hooks/useBaseURL";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import Loading from "../../components/Loading/Loading";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate } from "react-router";
const WatchTime = () => {
  const [loading, setLoading] = useState(false);
  const api = useBaseURL();
  const [watch, setWatch] = useState([]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("access-token");
    const fetchWatchTime = async () => {
      try {
        const { data } = await api.get("/dashboard/watchTime", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWatch(data);
      } catch (err) {
        toast.error(err?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchTime();
  }, []);

  const chartData = watch.map((item) => ({
    ...item,
    minutes: item.totalSeconds / 60,
  }));
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA46BE",
    "#FF4560",
    "#26A69A",
  ];
  const navigate = useNavigate();
  if (loading) return <Loading />;
  return (
    <>
      <NavBar />
      <div className="flex justify-center font-semibold items-center mt-3 ">
        <button onClick={() => navigate(-1)} className="btn btn-accent">
          Back To Page
        </button>
      </div>
      <div className="bg-base-200" style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="minutes"
              nameKey={"channelName"}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default WatchTime;
