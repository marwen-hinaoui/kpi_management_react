const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/section.controller");

router.get("/", sectionController.getAllSections);

module.exports = router;
