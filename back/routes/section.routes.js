const express = require('express');
const router = express.Router();
const Section = require('../models/section');

router.get('/', async (req, res) => {
  try {
    const sections = await Section.findAll();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
