const express = require("express");
const router = express.Router();
const kpiController = require("../controllers/kpi.controller");

router.get("/", kpiController.getAllKpis);
router.post("/", kpiController.createKpi);
router.get("/section/:sectionName", kpiController.getKpisBySection);
router.get("/:kpiId/details", kpiController.getKpiDetails);
router.post("/:kpiId/data", kpiController.postKpiData);
router.get("/sections-with-kpis", kpiController.getSectionsWithKpis);

module.exports = router;
