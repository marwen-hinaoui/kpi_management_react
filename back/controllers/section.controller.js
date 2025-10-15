const Section = require("../models/section");

const getAllSections = async (req, res) => {
  try {
    const sections = await Section.findAll();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllSections };
