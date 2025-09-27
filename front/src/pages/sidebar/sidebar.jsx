import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineAnalytics } from "react-icons/md";
import { COLORS } from "../../constant/colors";
import LearLogo from "../../assets/img/LearLogo1.png";
import { FONTSIZE, ICONSIZE } from "../../constant/FontSizes";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { RiDashboardHorizontalLine } from "react-icons/ri";

const { Sider } = Layout;

const navItems = [
  {
    key: "Sections",
    icon: <RiDashboardHorizontalLine size={ICONSIZE.SMALL} />,
    label: "Sections",
    route: "/sections",
  },
    {
    key: "Kpi",
  icon: <MdOutlineAnalytics size={ICONSIZE.SMALL} />,
      label: "kpi",
    route: "/kpi",
  },
  {
    key: "Insert Data",
    icon: <MdOutlineLibraryAdd size={ICONSIZE.SMALL} />,
    label: "Insert Data",
    route: "/insert-data",
  },

];

const Sidebar = () => {
  const collapsedSidebar = useSelector((state) => state.app.collapsedSidebar);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = navItems.find(
    (item) => location.pathname === item.route
  )?.key;

  const handleMenuClick = ({ key }) => {
    const item = navItems.find((item) => item.key === key);
    if (item && item.route) {
      navigate(item.route);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsedSidebar}
      width={200}
      collapsedWidth={60}
      trigger={null}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        overflow: "auto",
        zIndex: 999,
        backgroundColor: COLORS.WHITE,
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        borderRight: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsedSidebar ? "center" : "flex-start",
          paddingLeft: collapsedSidebar ? 0 : 16,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <img src={LearLogo} alt="Logo" style={{ width: 40 }} />
      </div>

      <Menu
        theme="light"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={navItems}
        style={{ borderRight: 0, fontSize: FONTSIZE.PRIMARY }}
      />

      <style>{`
        .ant-menu-item {
          border-radius: 5px !important;
        }
        .ant-menu-light .ant-menu-item-selected,
        .ant-menu-light .ant-menu-item:hover {
          background-color: ${COLORS.LearRed} !important;
          color: ${COLORS.WHITE} !important;
        }
        .ant-menu-light .ant-menu-item:hover .anticon {
          color: ${COLORS.WHITE} !important;
        }
      `}</style>
    </Sider>
  );
};

export default Sidebar;