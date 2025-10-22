import { Link } from "react-router";

const Home = () => {
  return (
    <div className="flex flex-col   from-gray-100 to-gray-200">
      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-700 animate-pulse">
          Welcome to My Page
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl md:text-2xl max-w-2xl animate-fadeIn">
          This page demonstrates dynamic routes, responsive layout, and
          interactive UI.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/liveTv"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Go to Live TV
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:bg-green-600 hover:scale-105"
          >
            About Page
          </Link>
        </div>

        {/* Decorative Animated Elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
        </div>
      </main>
    </div>
  );
};

export default Home;
