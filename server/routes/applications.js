const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const protect = require('../middleware/auth');

// POST - Candidate applies for a job
router.post('/apply', protect, async (req, res) => {
  try {
    if (req.user.role !== 'candidate')
      return res.status(403).json({ message: 'Only candidates can apply' });

    const { jobId, coverLetter } = req.body;
    const existing = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = new Application({ job: jobId, candidate: req.user.id, coverLetter });
    await application.save();
    res.status(201).json({ message: 'Applied successfully!', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Candidate's own applications
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location jobType salary')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Recruiter sees applicants for their jobs
router.get('/recruiter', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Not authorized' });

    const jobs = await Job.find({ recruiter: req.user.id });
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company location')
      .populate('candidate', 'name email skills bio')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT - Recruiter updates application status
router.put('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter')
      return res.status(403).json({ message: 'Not authorized' });

    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;