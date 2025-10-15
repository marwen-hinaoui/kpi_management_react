import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import { Column, Line } from "@ant-design/plots";
import "../KpiDetailPage/KpiDetailPage.css";

const KpiDetailPage = () => {
  const { kpiId } = useParams();
  const [kpi, setKpi] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [mode, setMode] = useState("daily");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/kpis/${kpiId}/details`)
      .then((res) => {
        setKpi(res.data.kpi);
        setDailyData(res.data.dailyData);
        
        const grouped = {};
        res.data.dailyData.forEach(({ date, target, actual }) => {
          const month = new Date(date).toLocaleString("default", {
            month: "short",
          });
          if (!grouped[month]) grouped[month] = { target: [], actual: [] };
          grouped[month].target.push(target);
          grouped[month].actual.push(actual);
        });
        
        const monthly = Object.entries(grouped).map(([month, values]) => ({
          month,
          target: values.target.reduce((a, b) => a + b, 0) / values.target.length,
          actual: values.actual.reduce((a, b) => a + b, 0) / values.actual.length,
        }));
        
        setMonthlyData(monthly);
      })
      .catch((err) => console.error("Erreur chargement KPI :", err));
  }, [kpiId]);

  // Configuration pour le graphique quotidien - Colonnes pour Actual seulement
  const dailyChartConfig = {
    data: dailyData,
    xField: "date",
    yField: "actual",
    color: "#1890ff",
    columnWidthRatio: 0.6,
    height: 400,
    legend: false,
  };

  // Configuration pour le graphique mensuel - Colonnes pour Actual seulement
  const monthlyChartConfig = {
    data: monthlyData,
    xField: "month",
    yField: "actual",
    color: "#1890ff",
    columnWidthRatio: 0.6,
    height: 400,
    legend: false,
  };

  // Configuration combinée pour afficher Actual en colonnes ET Target en ligne
  const dailyCombinedConfig = {
    data: dailyData,
    children: [
      {
        type: "interval", // Colonnes pour Actual
        encode: {
          x: "date",
          y: "actual",
        },
        style: {
          fill: "#1890ff",
        },
      },
      {
        type: "line", // Ligne pour Target
        encode: {
          x: "date",
          y: "target",
        },
        style: {
          stroke: "#ff4d4f",
          lineWidth: 2,
        },
        axis: {
          y: {
            title: "Valeurs",
          },
        },
      },
    ],
    height: 400,
    legend: {
      position: "top",
      items: [
        { name: "Actual", marker: { symbol: "square", style: { fill: "#1890ff" } } },
        { name: "Target", marker: { symbol: "line", style: { stroke: "#ff4d4f", lineWidth: 2 } } },
      ],
    },
  };

  const monthlyCombinedConfig = {
    data: monthlyData,
    children: [
      {
        type: "interval", // Colonnes pour Actual
        encode: {
          x: "month",
          y: "actual",
        },
        style: {
          fill: "#1890ff",
        },
      },
      {
        type: "line", // Ligne pour Target
        encode: {
          x: "month",
          y: "target",
        },
        style: {
          stroke: "#ff4d4f",
          lineWidth: 2,
        },
        axis: {
          y: {
            title: "Valeurs",
          },
        },
      },
    ],
    height: 400,
    legend: {
      position: "top",
      items: [
        { name: "Actual", marker: { symbol: "square", style: { fill: "#1890ff" } } },
        { name: "Target", marker: { symbol: "line", style: { stroke: "#ff4d4f", lineWidth: 2 } } },
      ],
    },
  };

  return (
    <div className="kpi-detail-layout">
      <Sidebar />
      <div className="kpi-detail-content">
        <h2 className="kpi-detail-title">{kpi?.nom}</h2>
        <div className="mode-toggle">
          <button
            className={mode === "daily" ? "active" : ""}
            onClick={() => setMode("daily")}
          >
            Daily
          </button>
          <button
            className={mode === "monthly" ? "active" : ""}
            onClick={() => setMode("monthly")}
          >
            Monthly
          </button>
        </div>
        <div className="chart-box">
          {/* Option 1: Seulement les colonnes pour Actual */}
          {/* <Column {...(mode === "daily" ? dailyChartConfig : monthlyChartConfig)} /> */}
          
          {/* Option 2: Colonnes pour Actual + Ligne pour Target */}
          <Line {...(mode === "daily" ? dailyCombinedConfig : monthlyCombinedConfig)} />
        </div>
        <div className="table-box kpi-table-wrapper">
          {mode === "daily" ? (
            <table className="kpi-table">
              <thead>
                <tr>
                  <th></th>
                  {dailyData.map((d, i) => (
                    <th key={i}>{d.date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Target</td>
                  {dailyData.map((d, i) => (
                    <td key={i}>{d.target}</td>
                  ))}
                </tr>
                <tr>
                  <td>Actual</td>
                  {dailyData.map((d, i) => (
                    <td key={i}>{d.actual}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
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
                  <tr>
                    <td colSpan="3">Aucune donnée.</td>
                  </tr>
                ) : (
                  monthlyData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.month}</td>
                      <td>{row.target.toFixed(1)}%</td>
                      <td>{row.actual.toFixed(1)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiDetailPage;