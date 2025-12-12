import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { FaHome, FaWallet, FaPlus, FaChartPie, FaUser, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <h2 className="logo">{expanded ? "💰 BudgetWise" : "💰"}</h2>

      <nav>
        <Link to="/dashboard">
          <FaHome /> {expanded && <span>Dashboard</span>}
        </Link>

        <Link to="/transactions">
          <FaWallet /> {expanded && <span>Transactions</span>}
        </Link>

        <Link to="/add-transaction">
          <FaPlus /> {expanded && <span>Add Transaction</span>}
        </Link>

        <Link to="/budget">
          <FaChartPie /> {expanded && <span>Budget</span>}
        </Link>

        <Link to="/profile">
          <FaUser /> {expanded && <span>Profile</span>}
        </Link>

        {/* 🔥 Settings Removed */}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> {expanded && <span>Logout</span>}
      </button>
    </div>
  );
}

export default Sidebar;
