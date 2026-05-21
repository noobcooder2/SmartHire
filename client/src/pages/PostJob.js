import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostJob = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '',
    skills: '', salary: '', jobType: 'Full-time'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Job posted successfully!');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!user || user.role !== 'recruiter') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl font-semibold">Only recruiters can post jobs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Post a New Job</h1>

        {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="title" placeholder="Job Title" onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="text" name="company" placeholder="Company Name" onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="text" name="salary" placeholder="Salary (e.g. ₹5-8 LPA)" onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="text" name="skills" placeholder="Skills (comma separated: React, Node.js, MongoDB)" onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <select name="jobType" onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
          <textarea name="description" placeholder="Job Description" rows="5" onChange={handleChange} required className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button type="submit" className="bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;