import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar"; 
import "./section.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Section = () => {
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  axios
    .get("http://localhost:3000/api/sections")
    .then((res) => {
      console.log("Sections reçues :", res.data);
      setSections(res.data);
    })
    .catch((err) => console.error("Erreur API :", err));
}, []);

  const handleSectionClick = (sectionName) => {
    navigate(`/section/${sectionName}`);
  };

  return (
    <div className="section-wrapper">
      <Sidebar />
      <div className="section-content">
        <h1 className="section-title">Sections</h1>
        <div className="section-grid">
           {sections.map((section) => (
                <div
                  key={section.id}
                  className="section-card"
                  onClick={() => handleSectionClick(section.nom)}
                >
                  {section.nom}
                </div>
              ))
              }
        </div>
      </div>
    </div>
  );
};

export default Section;
