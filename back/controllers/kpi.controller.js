const Kpi = require("../models/kpi");
const Section = require("../models/section");
const KpiData = require("../models/KpiData");

const getAllKpis = async (req, res) => {
  try {
    const kpis = await Kpi.findAll();
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createKpi = async (req, res) => {
  const { nom, description, unit } = req.body;
  try {
    const newKpi = await Kpi.create({ nom, description, unit });
    res.status(201).json(newKpi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getKpisBySection = async (req, res) => {
  try {
    const section = await Section.findOne({
      where: { nom: req.params.sectionName },
      include: { model: Kpi },
    });

    if (!section) return res.status(404).json({ error: "Section introuvable" });
    res.json(section.Kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getKpiDetails = async (req, res) => {
  const { kpiId } = req.params;
  try {
    const kpi = await Kpi.findByPk(kpiId);
    const dailyData = await KpiData.findAll({ where: { kpi_id: kpiId } });
    res.json({ kpi, dailyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postKpiData = async (req, res) => {
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
        unit,
      });
    }
    res.status(201).json({ message: "Données enregistrées avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getSectionsWithKpis = async (req, res) => {
  try {
    const sections = await Section.findAll({
      include: { model: Kpi, through: { attributes: [] } },
    });

    const result = sections.map((section) => ({
      section: section.nom,
      kpis: section.Kpis.map((kpi) => ({
        id: kpi.id,
        nom: kpi.nom,
      })),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllKpis,
  createKpi,
  getKpisBySection,
  getKpiDetails,
  postKpiData,
  getSectionsWithKpis,
};
