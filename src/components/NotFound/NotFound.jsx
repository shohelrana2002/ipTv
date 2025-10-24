import React from "react";
import { useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center g-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-4">
      {/* Animated 404 Text */}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[8rem] font-extrabold drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl font-semibold mb-2 text-center"
      >
        Oops! Page Not Found 😢
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center text-lg text-white/80 max-w-md mb-8"
      >
        The page you're looking for doesn’t exist or has been moved. Don’t
        worry, you can always go back to the home page.
      </motion.p>

      {/* Home Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all"
      >
        ⬅️ Back to Home
      </motion.button>

      {/* Decorative Wave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-0"
      >
        <svg
          className="relative block w-[calc(200%+1.3px)] h-[120px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.9,82.7-16.43,168.18-17.67,250.45.39,110.37,24.47,219.65,73.35,329.61,90.16,60.19,9.26,122,6.08,179.55-12V120H0V16.48C91.61,37.18,226.94,67.23,321.39,56.44Z"
            fill="white"
          ></path>
        </svg>
      </motion.div>
    </div>
  );
};

export default NotFound;
