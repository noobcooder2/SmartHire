const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const User = require('../models/user');
const Job = require('../models/Job');
const Application = require('../models/Application');

router.get('/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments(); 
    const recruiters = await User.countDocuments({ role: 'recruiter' });
    const candidates = await User.countDocuments({ role: 'candidate' });

    res.json({ users, jobs, applications, recruiters, candidates });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 