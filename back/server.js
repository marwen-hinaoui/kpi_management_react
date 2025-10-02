const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
const KpiData = require('./models/KpiData');
const PORT = 3000;
const HOST = "127.0.0.1";
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/kpis", require("./routes/kpi.routes"));
app.use("/api/sections", require("./routes/section.routes"));

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

    console.log(
      "Connected to DB and server running on http://" + HOST + ":" + PORT
    );
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
});
