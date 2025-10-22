import React, { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// ✅ Helper
const normalizeGroup = (g) =>
  g ? g.toString().trim().toUpperCase() : "OTHERS";

// ✅ HLS Player Hook
function useHlsPlayer(src, onLevels) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        if (onLevels) onLevels(data.levels.filter((l) => l.height > 0));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) toast.error("Stream error or not available!");
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      toast.error("HLS not supported in this browser.");
    }

    return () => {
      if (hls) hls.destroy();
      hlsRef.current = null;
    };
  }, [src, onLevels]);

  return { videoRef, hlsRef };
}

// ✅ Player Component
function Player({ src, poster }) {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const { videoRef, hlsRef } = useHlsPlayer(src, setLevels);

  const changeQuality = (height) => {
    if (!hlsRef.current) return;

    if (height === -1) {
      hlsRef.current.currentLevel = -1;
      setCurrentLevel(-1);
    } else {
      const levelIndex = levels.findIndex((l) => l.height === height);
      if (levelIndex !== -1) {
        hlsRef.current.currentLevel = levelIndex;
        setCurrentLevel(height);
      }
    }
  };

  return (
    <div className="w-full bg-black rounded-md overflow-hidden shadow-lg relative">
      <video
        ref={videoRef}
        controls
        playsInline
        autoPlay
        poster={poster}
        className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[480px] object-cover bg-black"
      />

      {/* Quality Selector */}
      {levels.length > 0 && (
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs rounded px-2 py-1 z-10">
          <select
            value={currentLevel}
            onChange={(e) => changeQuality(Number(e.target.value))}
            className="bg-transparent outline-none"
          >
            <option value={-1}>Auto</option>
            {levels.map((l) => (
              <option key={l.height} value={l.height}>
                {l.height}p
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// ✅ Channel Card
function ChannelCard({ ch, onPlay, active }) {
  return (
    <div
      className={`flex flex-col items-center p-2 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border ${
        active ? "border-blue-500 bg-blue-50" : "border-transparent bg-white"
      }`}
      onClick={() => onPlay(ch)}
    >
      <div className="w-full flex items-center justify-center h-20 mb-2">
        {ch.logo ? (
          <img
            src={ch.logo}
            alt={ch.name}
            className="max-h-16 object-contain"
            onError={(e) => (e.currentTarget.style.opacity = 0.6)}
          />
        ) : (
          <div className="text-sm font-bold text-gray-700">{ch.name}</div>
        )}
      </div>
      <div className="w-full text-center text-sm font-medium">{ch.name}</div>
      <div className="w-full text-xs text-gray-500 mt-1">{ch.group}</div>
    </div>
  );
}

// ✅ Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ✅ Main App
const LiveTVApp = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load from Server
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000");
        setChannels(data);
      } catch (err) {
        toast.error("Failed to load channels!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  const sanitized = useMemo(() => {
    const map = new Map();
    channels.forEach((c, idx) => {
      const url = (c.url || "").trim();
      if (!url) return;
      const key = url + "|" + (c.name || "channel") + "|" + (c.group || "");
      if (!map.has(key)) {
        map.set(key, {
          name: (c.name || `Channel ${idx + 1}`).trim(),
          group: normalizeGroup(c.group || c["group-title"] || ""),
          logo: c.logo || "",
          url,
        });
      }
    });
    return Array.from(map.values());
  }, [channels]);

  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("ALL");
  const [current, setCurrent] = useState(null);

  const groups = useMemo(() => {
    const s = new Set(["ALL"]);
    sanitized.forEach((c) => s.add(c.group || "OTHERS"));
    return Array.from(s);
  }, [sanitized]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sanitized.filter((ch) => {
      if (activeGroup !== "ALL" && ch.group !== activeGroup) return false;
      if (!q) return true;
      return (
        (ch.name || "").toLowerCase().includes(q) ||
        (ch.group || "").toLowerCase().includes(q)
      );
    });
  }, [sanitized, query, activeGroup]);

  useEffect(() => {
    if (!current && filtered.length) setCurrent(filtered[0]);
  }, [filtered, current]);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">📺 Live TV</h1>
            <p className="text-sm text-gray-600 mt-1">
              Loaded channels: <strong>{sanitized.length}</strong>
            </p>
          </div>

          <div className="w-full md:w-1/2 relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channel or group..."
              className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </header>

        {/* Main Content */}
        {loading ? (
          <Spinner />
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="md:col-span-2 space-y-4">
              {current && <Player src={current?.url} poster={current?.logo} />}

              <div className="flex flex-wrap gap-2 items-center mt-2">
                {groups.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={`px-3 py-1 rounded-full border transition ${
                      activeGroup === g
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 mt-4">
                  Channels ({filtered.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((ch, index) => (
                    <ChannelCard
                      key={index}
                      ch={ch}
                      active={current?.url === ch.url}
                      onPlay={setCurrent}
                    />
                  ))}
                </div>
              </div>
            </section>

            <aside className="md:col-span-1 space-y-4">
              <div className="bg-white p-3 rounded-md shadow-sm sticky top-4">
                <h3 className="font-semibold mb-2">Now Playing</h3>
                {current ? (
                  <div className="flex items-center gap-3">
                    {current.logo ? (
                      <img
                        src={current.logo}
                        alt={current.name}
                        className="w-16 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 flex items-center justify-center">
                        No Logo
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{current.name}</p>
                      <p className="text-xs text-gray-500">{current.group}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    No channel selected
                  </div>
                )}
              </div>
            </aside>
          </main>
        )}

        <footer className="mt-6 text-center text-xs text-gray-500">
          Built with ❤️ by{" "}
          <span className="text-orange-400 font-semibold">Md. Shohel Rana</span>
        </footer>
      </div>
    </div>
  );
};

export default LiveTVApp;
