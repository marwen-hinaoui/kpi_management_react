import React, { useState, useEffect } from "react";
import { Layout, Select, DatePicker, Input, Button, Table, message } from "antd";
import dayjs from "dayjs";
import Sidebar from "../sidebar/sidebar"; // adapte le chemin si besoin
import "./insertDataPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const { Option } = Select;
const { RangePicker } = DatePicker;
const { Content } = Layout;

const InsertDataPage = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [unit, setUnit] = useState("Unit");
  const [massColumn, setMassColumn] = useState("target");
  const [massValue, setMassValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [kpis, setKpis] = useState([]);
const navigate = useNavigate();

const [sectionsWithKpis, setSectionsWithKpis] = useState([]);
const [selectedSection, setSelectedSection] = useState(null);
const [selectedKpiId, setSelectedKpiId] = useState(null);

useEffect(() => {
  axios.get("http://localhost:3000/api/kpis/sections-with-kpis")
    .then(res => setSectionsWithKpis(res.data))
    .catch(err => console.error("Erreur chargement sections/KPIs :", err));
}, []);
  const handleRangeSelect = (dates) => {
    if (!dates) return;
    const start = dayjs(dates[0]);
    const end = dayjs(dates[1]);
    const days = [];

    for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, "day")) {
      days.push({
        key: d.format("YYYY-MM-DD"),
        date: d.format("YYYY-MM-DD"),
        target: "",
        actual: "",
        col1: "",
        col2: "",
        comment: ""
      });
    }

    setTableData(days);
  };

  const applyMassFill = () => {
    const updated = tableData.map(row => ({
      ...row,
      [massColumn]: massValue
    }));
    setTableData(updated);
  };

  const updateCell = (index, field, value) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

const handleSave = async () => {
  if (!selectedKpiId) {
    message.error("Veuillez sélectionner un KPI.");
    return;
  }

  try {
    await axios.post(`http://localhost:3000/api/kpis/${selectedKpiId}/data`, {
      year,
      month,
      unit,
      data: tableData.map(row => ({
        date: row.date,
        target: parseFloat(row.target),
        actual: parseFloat(row.actual),
        col1: row.col1,
        col2: row.col2,
        comment: row.comment
      }))
    });

    message.success("Données enregistrées !");
    navigate(`/kpi/${selectedKpiId}`);
  } catch (err) {
    console.error("Erreur enregistrement :", err);
    message.error("Échec de l'enregistrement.");
  }
};



  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      render: (_, record, index) => (
        <Input value={record.target} onChange={e => updateCell(index, "target", e.target.value)} />
      )
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (_, record, index) => (
        <Input value={record.actual} onChange={e => updateCell(index, "actual", e.target.value)} />
      )
    },
    {
      title: "",
      dataIndex: "col1",
      key: "col1",
      render: (_, record, index) => (
        <Input value={record.col1} onChange={e => updateCell(index, "col1", e.target.value)} />
      )
    },
    {
      title: "",
      dataIndex: "col2",
      key: "col2",
      render: (_, record, index) => (
        <Input value={record.col2} onChange={e => updateCell(index, "col2", e.target.value)} />
      )
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (_, record, index) => (
        <Input value={record.comment} onChange={e => updateCell(index, "comment", e.target.value)} />
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      <Sidebar />
      <div style={{ display: "flex" }}>
  <div style={{
    width: "250px",
    backgroundColor: "#fff",
    padding: "1rem",
    borderRight: "1px solid #ddd",
    height: "100vh",
    overflowY: "auto"
  }}>
    <h3>Sections</h3>
    {sectionsWithKpis.map(section => (
      <div key={section.section}>
        <Button
          type={selectedSection === section.section ? "primary" : "default"}
          block
          onClick={() => {
            setSelectedSection(section.section);
            setSelectedKpiId(null);
          }}
          style={{ marginBottom: "0.5rem" }}
        >
          {section.section}
        </Button>

        {selectedSection === section.section && (
          <div style={{ marginLeft: "1rem" }}>
            {section.kpis.map(kpi => (
              <Button
                key={kpi.id}
                type={selectedKpiId === kpi.id ? "primary" : "default"}
                block
                onClick={() => setSelectedKpiId(kpi.id)}
                style={{ marginBottom: "0.5rem" }}
              >
                {kpi.nom}
              </Button>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>

  
</div>

      <div style={{ display: "flex" }}>

 
          </div>

      <Content style={{ padding: "2rem", backgroundColor: "#f9f9f9" }}>
        <h2>Insert Data</h2>

        <div className="filters">
          <div className="left-row">
      <Select value={year} onChange={setYear} style={{ width: 120 }}>
    {years.map((y) => (
      <Option key={y} value={y.toString()}>{y}</Option>
    ))}
  </Select>
  <Select value={month} onChange={setMonth} style={{ width: 120, marginLeft: 10 }}>
    {months.map((m) => (
      <Option key={m} value={m}>{m}</Option>
    ))}
  </Select>
            <Select value={unit} onChange={setUnit} style={{ width: 120, marginLeft: 10 }}>
              <Option value="Unit">Unit</Option>
              <Option value="%">%</Option>
              <Option value="€">€</Option>
            </Select>
          </div>

          <div className="right">
            <label><strong>Mass Fill:</strong></label>
            <RangePicker onChange={handleRangeSelect} />
            <div style={{ marginTop: 10 }}>
              <Select value={massColumn} onChange={setMassColumn} style={{ width: 150 }}>
                <Option value="target">Target</Option>
                <Option value="actual">Actual</Option>
                <Option value="comment">Comment</Option>
                <Option value="col1">Colonne 1</Option>
                <Option value="col2">Colonne 2</Option>
              </Select>
              <Input
                placeholder="Valeur"
                value={massValue}
                onChange={e => setMassValue(e.target.value)}
                style={{ width: 150, marginLeft: 10 }}
              />
              <Button onClick={applyMassFill} style={{ marginLeft: 10 }}>Appliquer</Button>
            </div>
          </div>
        </div>

        <Table columns={columns} dataSource={tableData} pagination={false} />

        <div className="save-button">
          <Button type="primary" onClick={handleSave}>Save</Button>
        </div>
      </Content>
    </Layout>
  );
};

export default InsertDataPage;
