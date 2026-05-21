import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-tight">
        Smart<span className="text-yellow-400">Hire</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/jobs" className="hover:text-yellow-400 transition font-medium">Jobs</Link>

        {user?.role === 'recruiter' && (
  <>
        <Link to="/post-job" className="hover:text-yellow-400 transition font-medium">Post Job</Link>
        <Link to="/recruiter" className="hover:text-yellow-400 transition font-medium">My Applicants</Link>
        </>
        )}

        {user?.role === 'candidate' && (
          <Link to="/dashboard" className="hover:text-yellow-400 transition font-medium">Dashboard</Link>
        )}

        {user?.role === 'admin' && (
          <Link to="/admin" className="hover:text-yellow-400 transition font-medium">Admin</Link>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-blue-200 text-sm">Hi, {user.name.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-semibold text-sm hover:bg-yellow-300 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="hover:text-yellow-400 transition font-medium">Login</Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-semibold text-sm hover:bg-yellow-300 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;