import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Smart<span className="text-yellow-400">Hire</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/jobs" className="hover:text-yellow-300 transition">Jobs</Link>
          <Link to="/login" className="hover:text-yellow-300 transition">Login</Link>
          <Link to="/register" className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition">
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 px-4 pb-4 flex flex-col gap-3">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/jobs" className="hover:text-yellow-300">Jobs</Link>
          <Link to="/login" className="hover:text-yellow-300">Login</Link>
          <Link to="/register" className="hover:text-yellow-300">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;