import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data)).catch(console.error);
  }, 
  []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'bg-blue-100 text-blue-700' },
    { label: 'Candidates', value: stats.candidates, icon: '🎓', color: 'bg-green-100 text-green-700' },
    { label: 'Recruiters', value: stats.recruiters, icon: '🏢', color: 'bg-purple-100 text-purple-700' },
    { label: 'Total Jobs', value: stats.jobs, icon: '💼', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Applications', value: stats.applications, icon: '📋', color: 'bg-red-100 text-red-700' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        {!stats ? (
          <p className="text-gray-500">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <div key={i} className={`rounded-2xl shadow-md p-6 text-center ${card.color}`}>
                <div className="text-4xl mb-2">{card.icon}</div>
                <div className="text-4xl font-bold">{card.value}</div>
                <div className="text-sm font-semibold mt-1">{card.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;