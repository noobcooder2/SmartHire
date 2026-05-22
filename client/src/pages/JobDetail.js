import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    setError('');
    try {
      await axios.post(
        'http://localhost:5000/api/applications/apply',
        { jobId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Applied successfully! Check your dashboard for status updates.');
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed. Try again.');
    }
    setApplying(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!job) return <p className="text-center mt-10">Job not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
        <p className="text-blue-600 font-semibold text-lg mt-1">{job.company}</p>
        <p className="text-gray-500 mt-2">📍 {job.location} &nbsp;|&nbsp; 💼 {job.jobType} &nbsp;|&nbsp; 💰 {job.salary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill, i) => (
            <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Job Description</h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <p className="text-gray-400 text-sm mt-4">Posted by: {job.recruiter?.name}</p>

        {message && <div className="mt-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mt-4 bg-red-100 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        {user?.role === 'candidate' && !message && (
          <button
            onClick={handleApply}
            disabled={applying}
            className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition disabled:opacity-60"
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}

        {!user && (
          <button
            onClick={() => navigate('/login')}
            className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition"
          >
            Login to Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetail;