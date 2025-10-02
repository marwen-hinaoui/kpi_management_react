const express = require('express');
const router = express.Router();

const Kpi = require('../models/kpi');
const Section = require('../models/section');
const KpiData = require('../models/KpiData');
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
    console.log("Chargement KPI ID :", kpiId);

    const kpi = await Kpi.findByPk(kpiId);
    const dailyData = await KpiData.findAll({ where: { kpi_id: kpiId } });
   // const secondaryKpis = await Kpi.findAll({ where: { parent_kpi_id: kpiId } });

    res.json({ kpi, dailyData });
  } catch (err) {
    console.error("Erreur chargement KPI :", err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/:kpiId/data', async (req, res) => {
  const { kpiId } = req.params;
  const { year, month, unit, data } = req.body;

  try {
    for (const entry of data) {
      await KpiData.create({
        kpi_id: kpiId,
        date: entry.date,
        target: entry.target,
        actual: entry.actual,
        col1: entry.col1,
        col2: entry.col2,
        comment: entry.comment,
        year,
        month,
        unit
      });
    }

    res.status(201).json({ message: "Données enregistrées avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
router.get('/sections-with-kpis', async (req, res) => {
  try {
    const sections = await Section.findAll({
      include: {
        model: Kpi,
        through: { attributes: [] }
      }
    });

    const result = sections.map(section => ({
      section: section.nom,
      kpis: section.Kpis.map(kpi => ({
        id: kpi.id,
        nom: kpi.nom
      }))
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
