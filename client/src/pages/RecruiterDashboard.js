import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/applications/recruiter`, { headers });
      setApplications(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/applications/${id}/status`, { status }, { headers });
      setApplications(prev =>
        prev.map(app => app._id === id ? { ...app, status } : app)
      );
    } catch (err) { console.error(err); }
  };

  const statusColor = (status) => {
    if (status === 'shortlisted') return 'text-green-600';
    if (status === 'rejected') return 'text-red-500';
    return 'text-yellow-600';
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading applicants...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Recruiter Dashboard</h1>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
            No applications yet. Share your job listings to get candidates.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{app.candidate?.name}</p>
                    <p className="text-gray-500 text-sm">{app.candidate?.email}</p>
                    <p className="text-blue-600 font-semibold mt-1">
                      Applied for: {app.job?.title} @ {app.job?.company}
                    </p>
                    {app.candidate?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {app.candidate.skills.map((s, i) => (
                          <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                    {app.candidate?.bio && (
                      <p className="text-gray-500 text-sm mt-2 italic">"{app.candidate.bio}"</p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-semibold capitalize text-sm ${statusColor(app.status)}`}>
                      ● {app.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(app._id, 'shortlisted')}
                        disabled={app.status === 'shortlisted'}
                        className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-400 transition disabled:opacity-40"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, 'rejected')}
                        disabled={app.status === 'rejected'}
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-400 transition disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;