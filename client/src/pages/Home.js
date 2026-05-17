import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Dream Job with <span className="text-yellow-400">AI Power</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          SmartHire matches you with the best jobs using artificial intelligence
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition">
            Get Started
          </Link>
          <Link to="/jobs" className="border-2 border-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-600 transition">
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose SmartHire?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-gray-500">Get personalized job suggestions based on your skills and experience</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Quick Apply</h3>
            <p className="text-gray-500">Apply to multiple jobs with one click using your saved profile</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-500">Our algorithm finds the perfect match between candidates and recruiters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;