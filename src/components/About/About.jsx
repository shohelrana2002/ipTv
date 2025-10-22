import React from "react";
import { Link } from "react-router";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-pulse">
          About Us
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto animate-fadeIn">
          Learn more about our mission, vision, and what drives us to build
          amazing web applications.
        </p>
      </section>

      {/* Content Section */}
      <section className="container mx-auto p-6 flex flex-col md:flex-row items-center gap-8 mt-12">
        {/* Image / Illustration */}
        <div className="md:w-1/2">
          <img
            src="https://cms-assets.tutsplus.com/cdn-cgi/image/width=800/uploads/users/2361/posts/36065/image/what_is_illustration_example_illustrator.jpg"
            alt="About illustration"
            className="rounded-xl shadow-lg w-full object-cover animate-fadeIn"
          />
        </div>

        {/* Text Content */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
            We aim to provide high-quality, responsive, and user-friendly web
            applications that empower people and businesses to achieve their
            goals.
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-6">
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
            To become a trusted technology partner by creating innovative
            solutions that make a difference in the digital world.
          </p>

          {/* Call to Action */}
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:bg-blue-700 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="mt-auto"></div>
    </div>
  );
};

export default About;
