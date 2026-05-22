import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [aiMsg, setAiMsg] = useState('');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchApplications();
    if (user?.skills) setSkills(user.skills.join(', '));
    if (user?.bio) setBio(user.bio);
  }, []);

  const fetchApplications = async () => {
  try {
      const res = await axios.get('http://localhost:5000/api/applications/my', { headers });
      setApplications(res.data);
    } catch (err) { console.error(err); }
  };

  const updateProfile = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/profile`, { skills, bio }, { headers });
      setProfileMsg('✅ Profile updated! Now try AI recommendations.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg('❌ Update failed');
    }
  };

  const getRecommendations = async () => {
    setAiLoading(true);
    setAiMsg('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/recommend`, {}, { headers });
      setRecommendations(res.data.recommendations);
      if (res.data.recommendations.length === 0) setAiMsg('No matching jobs found.');
    } catch (err) {
      setAiMsg(err.response?.data?.message || 'AI failed. Try again.');
    }
    setAiLoading(false);
  };

  const statusColor = (status) => {
    if (status === 'shortlisted') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>

        {/* Profile / Skills */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">👤 My Profile & Skills</h2>
          <p className="text-sm text-gray-500 mb-3">Add your skills so AI can recommend the best jobs for you.</p>
          <input
            type="text"
            placeholder="Skills (e.g. React, Node.js, MongoDB)"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Short bio about yourself..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={updateProfile}
            className="bg-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
          >
            Save Profile
          </button>
          {profileMsg && <p className="mt-2 text-sm text-green-600">{profileMsg}</p>}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-2">🤖 AI Job Recommendations</h2>
          <p className="text-sm text-gray-500 mb-4">Based on your skills, Gemini AI will suggest the best matching jobs.</p>
          <button
            onClick={getRecommendations}
            disabled={aiLoading}
            className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition"
          >
            {aiLoading ? '⏳ Thinking...' : '✨ Get AI Recommendations'}
          </button>
          {aiMsg && <p className="mt-3 text-sm text-red-500">{aiMsg}</p>}
          {recommendations.length > 0 && (
            <div className="mt-4 space-y-3">
              {recommendations.map(job => (
                <div key={job._id} className="border border-blue-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{job.title}</p>
                    <p className="text-blue-600 text-sm">{job.company} — {job.location}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skills.map((s, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">📋 My Applications</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500">You haven't applied to any jobs yet. <Link to="/jobs" className="text-blue-600 underline">Browse Jobs</Link></p>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app._id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{app.job?.title}</p>
                    <p className="text-blue-600 text-sm">{app.job?.company} — {app.job?.location}</p>
                    <p className="text-gray-400 text-xs mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;