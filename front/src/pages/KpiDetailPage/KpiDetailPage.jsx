import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import "./KpiDetailPage.css"; // Assure-toi d’avoir le CSS associé

const KpiDetailPage = () => {
  const { kpiId } = useParams();
  const navigate = useNavigate();

  const [kpi, setKpi] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [secondaryKpis, setSecondaryKpis] = useState([]);
  const [mode, setMode] = useState("daily");

  const chartRef = useRef(null);
  const monthlyChartRef = useRef(null);

  // Charger les données KPI
  useEffect(() => {
    axios.get(`http://localhost:3000/api/kpis/${kpiId}/details`)
      .then(res => {
        setKpi(res.data.kpi);
        setDailyData(res.data.dailyData);
        setSecondaryKpis(res.data.secondaryKpis);
      })
      .catch(err => console.error("Erreur chargement KPI :", err));
  }, [kpiId]);

  // Générer les données mensuelles
  useEffect(() => {
    if (dailyData.length > 0) {
      const grouped = {};
      dailyData.forEach(({ date, target, actual }) => {
        const month = new Date(date).toLocaleString("default", { month: "short" });
        if (!grouped[month]) grouped[month] = { target: [], actual: [] };
        grouped[month].target.push(target);
        grouped[month].actual.push(actual);
      });

      const monthly = Object.entries(grouped).map(([month, values]) => ({
        month,
        avgTarget: values.target.reduce((a, b) => a + b, 0) / values.target.length,
        avgActual: values.actual.reduce((a, b) => a + b, 0) / values.actual.length
      }));

      setMonthlyData(monthly);
    }
  }, [dailyData]);

  // Affichage du graphique daily
  useEffect(() => {
    if (mode === "daily" && chartRef.current && dailyData.length > 0) {
      new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: dailyData.map(d => d.date),
          datasets: [
            {
              label: "Target",
              data: dailyData.map(d => d.target),
              backgroundColor: "rgba(54, 162, 235, 0.5)"
            },
            {
              label: "Actual",
              data: dailyData.map(d => d.actual),
              backgroundColor: "rgba(255, 99, 132, 0.5)"
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Daily KPI Performance" }
          }
        }
      });
    }
  }, [mode, dailyData]);

  // Affichage du graphique monthly
  useEffect(() => {
    if (mode === "monthly" && monthlyChartRef.current && monthlyData.length > 0) {
      new Chart(monthlyChartRef.current, {
        type: "bar",
        data: {
          labels: monthlyData.map(d => d.month),
          datasets: [
            {
              label: "Target (moyenne)",
              data: monthlyData.map(d => d.avgTarget),
              backgroundColor: "rgba(54, 162, 235, 0.5)"
            },
            {
              label: "Actual (moyenne)",
              data: monthlyData.map(d => d.avgActual),
              backgroundColor: "rgba(255, 99, 132, 0.5)"
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Monthly KPI Performance" }
          }
        }
      });
    }
  }, [mode, monthlyData]);

  // Préparer les lignes inversées pour le tableau daily
  const dailyDates = dailyData.map(d => d.date);
  const targetRow = dailyData.map(d => d.target);
  const actualRow = dailyData.map(d => d.actual);

  return (
    <div className="kpi-detail-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>← Retour aux KPIs</button>
      <h2 className="kpi-detail-title">{kpi?.nom}</h2>

      <div className="mode-toggle">
        <button className={mode === "daily" ? "active" : ""} onClick={() => setMode("daily")}>Daily</button>
        <button className={mode === "monthly" ? "active" : ""} onClick={() => setMode("monthly")}>Monthly</button>
      </div>

      {mode === "daily" ? (
        <>
          <div className="chart-container">
            <canvas ref={chartRef} id="dailyChart" width="400" height="200"></canvas>
            {dailyData.length === 0 && <p>Aucune donnée journalière.</p>}
          </div>

          <table className="kpi-table">
            <thead>
              <tr>
                <th></th>
                {dailyDates.map((date, index) => (
                  <th key={index}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Target</td>
                {targetRow.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
              <tr>
                <td>Actual</td>
                {actualRow.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className="chart-container">
            <canvas ref={monthlyChartRef} id="monthlyChart" width="400" height="200"></canvas>
            {monthlyData.length === 0 && <p>Aucune donnée mensuelle.</p>}
          </div>

          <table className="kpi-table">
            <thead>
              <tr>
                <th>Mois</th>
                <th>Target (moyenne)</th>
                <th>Actual (moyenne)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.length === 0 ? (
                <tr><td colSpan="3">Aucune donnée.</td></tr>
              ) : (
                monthlyData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.month}</td>
                    <td>{row.avgTarget.toFixed(1)}%</td>
                    <td>{row.avgActual.toFixed(1)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      <h3 className="kpi-detail-subtitle">Secondary KPIs</h3>
      <div className="secondary-kpi-grid">
        {secondaryKpis.map((kpi) => (
          <div key={kpi.id} className="secondary-kpi-card">
            <h4>{kpi.nom}</h4>
            <p>Unité : {kpi.unit || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiDetailPage;
