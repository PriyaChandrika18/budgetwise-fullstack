import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "📋", label: "Transactions", path: "/transactions" },
    { icon: "📊", label: "Budget", path: "/budget" },
    { icon: "👤", label: "Profile", path: "/profile" },
  ];

  return (
    <div className="bottom-nav">
      {menuItems.map((item) => (
        <div
          key={item.label}
          className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default BottomNav;
