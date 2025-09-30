import { Route, Routes } from "react-router";
import Login from "../pages/login/login";
import { LoginProvider } from "../utils/loginProvider";
import Sidebar from "../pages/sidebar/sidebar";
import Section from "../pages/section/section";
import KpiSectionPage from "../pages/KpiSectionPage/KpiSectionPage"; 
import KpiDetailPage from '../pages/KpiDetailPage/KpiDetailPage';
import InsertDataPage from "../pages/InsertDataPage/insertDataPage";
import KpiPage from "../pages/addKPI/KpiPage"; // adapte le chemin si besoin
const AppRoutes = () => {
  return (
    <LoginProvider>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<>404</>} />
        <Route path="/unauthorized" element={<>unauthorized</>} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/sections" element={<Section />} />
        <Route path="/section/:sectionName" element={<KpiSectionPage />} />
        <Route path="/kpi/:kpiId" element={<KpiDetailPage />} />
  <Route path="/insert-data" element={<InsertDataPage />} /> 
  <Route path="/kpi" element={<KpiPage />} /> 
      </Routes>
    </LoginProvider>
  );
};

export default AppRoutes;
