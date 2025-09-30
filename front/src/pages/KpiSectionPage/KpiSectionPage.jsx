import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
        setKpis(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des KPIs :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [sectionName]);

  return (
    <div className="kpi-section-wrapper">
      <button className="back-button" onClick={() => navigate("/sections")}>
        ← Retour aux sections
      </button>
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
  );
};

export default KpiSectionPage;
