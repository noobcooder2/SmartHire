const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/user');

// Helper: score a job based on skill match
const scoreJob = (jobSkills, userSkills) => {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
  return jobSkillsLower.filter(s => userSkillsLower.some(u => u.includes(s) || s.includes(u))).length;
};

router.post('/recommend', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.skills || user.skills.length === 0)
      return res.status(400).json({ message: 'Please add skills to your profile first' });

    const jobs = await Job.find().populate('recruiter', 'name');

    if (jobs.length === 0)
      return res.status(400).json({ message: 'No jobs available yet' });

    // Try Gemini first
    try {
      const prompt = `You are a job recommendation AI.
A candidate has these skills: ${user.skills.join(', ')}.
Here are available jobs:
${JSON.stringify(jobs.map(j => ({ id: j._id.toString(), title: j.title, skills: j.skills })))}
Return ONLY a JSON array of top 3 job IDs by skill match.
Example: ["id1","id2","id3"]
Return ONLY the raw JSON array, nothing else.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );

      const data = await geminiRes.json();

      if (data.error) throw new Error(data.error.message);
      if (!data.candidates?.[0]) throw new Error('No Gemini candidates');

      const text = data.candidates[0].content.parts[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const recommendedIds = JSON.parse(clean);
      const recommendedJobs = await Job.find({ _id: { $in: recommendedIds } }).populate('recruiter', 'name');

      console.log('✅ Gemini recommendations served');
      return res.json({ recommendations: recommendedJobs, source: 'gemini' });

    } catch (geminiErr) {
      // Gemini failed — use local skill matching fallback
      console.log('⚠️ Gemini failed, using local matching:', geminiErr.message);

      const scored = jobs
        .map(job => ({ job, score: scoreJob(job.skills, user.skills) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.job);

      return res.json({ recommendations: scored, source: 'local' });
    }

  } catch (err) {
    console.error('AI route error:', err.message);
    res.status(500).json({ message: 'Recommendation failed', error: err.message });
  }
});

module.exports = router;