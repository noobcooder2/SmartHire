import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Smart<span className="text-yellow-400">Hire</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/jobs" className="hover:text-yellow-300 transition">Jobs</Link>
          {user ? (
            <>
              <span className="text-yellow-300 font-semibold">Hi, {user.name}!</span>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-1.5 rounded-full font-semibold hover:bg-red-400 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">Login</Link>
              <Link to="/register" className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-800 px-4 pb-4 flex flex-col gap-3">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/jobs" className="hover:text-yellow-300">Jobs</Link>
          {user ? (
            <button onClick={handleLogout} className="text-left hover:text-yellow-300">Logout</button>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
              <Link to="/register" className="hover:text-yellow-300">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;