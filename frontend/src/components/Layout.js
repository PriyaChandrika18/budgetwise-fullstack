import React from "react";
import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("You have been logged out!");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>BudgetWise</h2>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "block",
                padding: "10px 15px",
                borderRadius: "6px",
                color: "#fff",
                textDecoration: "none",
                backgroundColor:
                  location.pathname === item.path ? "rgba(255,255,255,0.2)" : "transparent",
                marginBottom: "8px",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>{children}</div>
    </div>
  );
}

export default Layout;
