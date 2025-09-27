const express = require('express');
const router = express.Router();

const Kpi = require('../models/kpi');
const Section = require('../models/section');

// GET tous les KPIs
router.get('/', async (req, res) => {
  try {
    const kpis = await Kpi.findAll();
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST un nouveau KPI
router.post('/', async (req, res) => {
  const { nom, description, unit } = req.body;
  try {
    const newKpi = await Kpi.create({ nom, description, unit });
    res.status(201).json(newKpi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET KPIs par section
router.get('/section/:sectionName', async (req, res) => {
  try {
    const section = await Section.findOne({
      where: { nom: req.params.sectionName },
      include: {
        model: Kpi,
        through: { attributes: [] }
      }
    });

    if (!section) return res.status(404).json({ error: "Section introuvable" });

    res.json(section.Kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:kpiId/details', async (req, res) => {
  const { kpiId } = req.params;
  try {
    const kpi = await Kpi.findByPk(kpiId);
    const dailyData = await KpiDaily.findAll({ where: { kpi_id: kpiId } });
    const secondaryKpis = await Kpi.findAll({ where: { parent_kpi_id: kpiId } });

    res.json({
      kpi,
      dailyData,
      secondaryKpis
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
