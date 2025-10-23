import React, { useEffect, useState } from "react";
import useBaseURL from "../../Hooks/useBaseURL";

const WatchTime = () => {
  const api = useBaseURL();
  const [watch, setWatch] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    const fetchWatchTime = async () => {
      try {
        const { data } = await api.get("/dashboard/watchTime", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWatch(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWatchTime();
  }, []);
  return (
    <div>
      {watch.map((watchT) => (
        <div key={watchT._id}>
          <p>{(watchT.totalSeconds / 60).toFixed(2)}Minites</p>
          <p>{watchT.channelUrl}</p>
        </div>
      ))}
    </div>
  );
};

export default WatchTime;
