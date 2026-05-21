import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Jobs</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title, company or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-5 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No jobs found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(job => (
              <div key={job._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                    <p className="text-blue-600 font-semibold">{job.company}</p>
                    <p className="text-gray-500 text-sm mt-1">📍 {job.location} &nbsp;|&nbsp; 💼 {job.jobType} &nbsp;|&nbsp; 💰 {job.salary}</p>
                  </div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="bg-blue-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
                  >
                    View Details
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;