import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar"; // adapte le chemin si besoin

import "../KpiSectionPage/KpiSectionPage.css"; 
const KpiSectionPage = () => {
  const { sectionName } = useParams();
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchKpis = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/kpis/section/${sectionName}`);
      let loadedKpis = res.data;

      // ✅ Vérifier s’il y a un KPI temporaire à ajouter
      const newKpiRaw = localStorage.getItem("newKpi");
      if (newKpiRaw) {
        const newKpi = JSON.parse(newKpiRaw);
        if (newKpi.section === sectionName) {
          loadedKpis = [...loadedKpis, newKpi];
          localStorage.removeItem("newKpi"); // Nettoyer après usage
        }
      }

      setKpis(loadedKpis);
    } catch (err) {
      console.error("Erreur lors du chargement des KPIs :", err);
    } finally {
      setLoading(false);
    }
  };

  fetchKpis();
}, [sectionName]);


  return (
      <div className="kpi-section-layout">
    {/* Sidebar à gauche */}
    <Sidebar />
    <div className="kpi-section-wrapper">
      
   
      <h2 className="kpi-section-title">KPIs pour la section : {sectionName}</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : kpis.length === 0 ? (
        <p>Aucun KPI trouvé pour cette section.</p>
      ) : (
        <div className="kpi-list">
        {kpis.map((kpi) => (
  <div
    key={kpi.id}
    className="kpi-card"
    onClick={() => navigate(`/kpi/${kpi.id}`)}
  >
    <h3>{kpi.nom}</h3>
    <p>{kpi.description}</p>
    <span>Unité : {kpi.unit}</span>
  </div>
))}

        </div>
      )}

    </div>
      </div>
  );
};

export default KpiSectionPage;
