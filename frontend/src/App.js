// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components & Pages
import Sidebar from "./components/Sidebar";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Core Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import Profile from "./pages/Profile";

// Milestone 3 Pages
import Budget from "./pages/Budget";

import "./App.css";

/**
 * Simple helper that decides if a user is logged in.
 * We use localStorage userId as in your project — adjust if your auth uses a different key/token.
 */
const isAuthenticated = () => Boolean(localStorage.getItem("userId"));

/**
 * ProtectedRoute wrapper component.
 * Renders children when authenticated; otherwise redirects to /login
 */
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

/**
 * AppLayout component handles showing/hiding the sidebar using React Router's location.
 * We add a small inline style to shift the main content to the right when sidebar is present.
 */
function AppLayout({ children }) {
  const location = useLocation();
  // pages where sidebar must be hidden
  const hideSidebarOn = ["/login", "/register"];
  const showSidebar = !hideSidebarOn.includes(location.pathname);

  // If your Sidebar width is different, change this value (px)
  const SIDEBAR_WIDTH = 260;

  const mainStyle = showSidebar
    ? { marginLeft: SIDEBAR_WIDTH, width: `calc(100% - ${SIDEBAR_WIDTH}px)`, transition: "margin-left 0.15s" }
    : { marginLeft: 0, width: "100%" };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {showSidebar && <Sidebar />}
      <main style={mainStyle}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <AppLayout>
        <Routes>
          {/* Root: redirect to profile if logged in, else to login */}
          <Route path="/" element={isAuthenticated() ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-transaction"
            element={
              <ProtectedRoute>
                <AddTransaction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-transaction/:id"
            element={
              <ProtectedRoute>
                <EditTransaction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />

        

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

         

          {/* 404 fallback */}
          <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: 40 }}>🚫 404 - Page Not Found</h2>} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
