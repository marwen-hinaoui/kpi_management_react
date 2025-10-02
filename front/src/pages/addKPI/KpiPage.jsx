import React, { useState } from "react";
import { Layout, Button, Modal, Form, Input, Select, message } from "antd";
import Sidebar from "../sidebar/sidebar"; // adapte le chemin si besoin
import "./KpiPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

const sections = ["Production", "Quality", "Maintenance"];


const KpiPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedKpiPrincipal, setSelectedKpiPrincipal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [kpiPrincipaux, setKpiPrincipaux] = useState({
    Production: ["Efficiency", "Output"],
    Quality: ["Scrap Rate", "Defects"],
    Maintenance: ["Downtime", "TRS"]
  });

  const [kpiSecondaires, setKpiSecondaires] = useState({
    Efficiency: ["TRS Cutting", "AIP"],
    Output: ["Project Output", "IDOCs"],
    ScrapRate: ["Rework", "Audit Score"],
    Defects: ["Visual", "Functional"],
    Downtime: ["Machine Stop", "Intervention"],
    TRS: ["TRS Cutting", "TRS Welding"]
  });

const handleSave = async () => {
  try {
    const values = await form.validateFields();
    const { name, type, section } = values;

    await axios.post("http://localhost:3000/api/kpis", {
      nom: name,
      type,
      section
    });

    // ✅ Stocker temporairement le KPI dans localStorage
    const newKpi = { nom: name, type, section };
    localStorage.setItem("newKpi", JSON.stringify(newKpi));

    message.success("KPI ajouté avec succès !");
    setIsModalOpen(false);
    form.resetFields();

    // Naviguer vers la section
    navigate(`/sections/${section}`);
  } catch (err) {
    console.error("Erreur lors de l'ajout du KPI :", err);
    message.error("Échec de l'ajout du KPI.");
  }
};


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Content style={{ padding: "2rem", backgroundColor: "#f9f9f9", display: "flex" }}>
        <div className="kpi-sidebar">
          <h3>Sections</h3>
          {sections.map(section => (
            <Button
              key={section}
              type={selectedSection === section ? "primary" : "default"}
              onClick={() => {
                setSelectedSection(section);
                setSelectedKpiPrincipal(null);
              }}
              block
              style={{ marginBottom: "0.5rem" }}
            >
              {section}
            </Button>
          ))}

          {selectedSection && (
            <>
              <h3 style={{ marginTop: "1rem" }}>KPI Principaux</h3>
              {kpiPrincipaux[selectedSection]?.map(kpi => (
                <Button
                  key={kpi}
                  type={selectedKpiPrincipal === kpi ? "primary" : "default"}
                  onClick={() => setSelectedKpiPrincipal(kpi)}
                  block
                  style={{ marginBottom: "0.5rem" }}
                >
                  {kpi}
                </Button>
              ))}
            </>
          )}

          {selectedKpiPrincipal && (
            <>
              <h3 style={{ marginTop: "1rem" }}>KPI Secondaires</h3>
              {kpiSecondaires[selectedKpiPrincipal]?.map(kpi => (
                <Button key={kpi} block style={{ marginBottom: "0.5rem" }}>
                  {kpi}
                </Button>
              ))}
            </>
          )}

          <Button
            type="dashed"
            onClick={() => setIsModalOpen(true)}
            style={{ marginTop: "2rem", width: "100%" }}
          >
            ➕ Add KPI
          </Button>
        </div>

        <div className="kpi-content">
          <h2>Bienvenue sur la page KPI</h2>
          <p>Sélectionne une section pour afficher les KPIs.</p>
        </div>

        <Modal
          title="Ajouter un KPI"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
            <Button key="save" type="primary" onClick={handleSave}>Save</Button>
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Nom du KPI" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select>
                <Option value="Principal">Principal</Option>
                <Option value="Secondaire">Secondaire</Option>
              </Select>
            </Form.Item>
            <Form.Item name="section" label="Section" rules={[{ required: true }]}>
              <Select>
                {sections.map(section => (
                  <Option key={section} value={section}>{section}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default KpiPage;
