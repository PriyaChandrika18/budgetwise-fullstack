// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const userId = Number(localStorage.getItem("userId")) || 1;

  // ---------- STATES ----------
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  // ---------- API CALLS ----------
  const fetchSummary = async () => {
    const res = await fetch(
      `http://localhost:8080/api/transactions/summary/${userId}`
    );
    setSummary(await res.json());
  };

  const fetchGoals = async () => {
    const res = await fetch(
      `http://localhost:8080/api/goals/list/${userId}`
    );
    setGoals(await res.json());
  };

  const fetchTransactions = async () => {
    const res = await fetch(
      `http://localhost:8080/api/transactions/list/${userId}`
    );
    setTransactions(await res.json());
  };

  useEffect(() => {
    fetchSummary();
    fetchGoals();
    fetchTransactions();
  }, []);

  // ---------- FILTERING ----------
  const filteredTransactions = transactions.filter((t) => {
    const matchSearch = t.category
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchMonth =
      !monthFilter ||
      t.date?.slice(0, 7) === monthFilter;

    return matchSearch && matchMonth;
  });

  // ---------- PIE CHART ----------
  const incomeExpensePie = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [
          summary.income || 0,
          summary.expense || 0,
        ],
        backgroundColor: ["#22C55E", "#EF4444"],
      },
    ],
  };

  // ---------- SPENDING BY CATEGORY ----------
  const categoryMap = {};
  filteredTransactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const spendingChart = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryMap),
        backgroundColor: "#FF6B6B",
      },
    ],
  };

  // ---------- GOAL CHART ----------
  const goalBarData = {
    labels: goals.map((g) => g.name),
    datasets: [
      {
        label: "Saved",
        data: goals.map((g) => g.savedAmount || 0),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Target",
        data: goals.map((g) => g.targetAmount || 0),
        backgroundColor: "#A1A1AA",
      },
    ],
  };

  // ---------- MONTHLY TIMELINE ----------
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const monthlyMap = {};
  transactions.forEach((t) => {
    if (t.type !== "expense") return;
    const [yyyy, mm] = t.date.split("-");
    const key = `${monthNames[mm - 1]} ${yyyy}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + t.amount;
  });

  const monthlySpendingData = {
    labels: Object.keys(monthlyMap),
    datasets: [
      {
        label: "Monthly Expense",
        data: Object.values(monthlyMap),
        borderColor: "#F97316",
        backgroundColor: "rgba(249,115,22,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // ---------- EXPORT ----------
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 15);
    doc.autoTable({
      head: [["Category", "Amount", "Type", "Payment", "Date"]],
      body: filteredTransactions.map((t) => [
        t.category,
        `₹${t.amount}`,
        t.type,
        t.paymentMethod,
        t.date,
      ]),
    });
    doc.save("transactions.pdf");
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(filteredTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  // ---------- UI ----------
  return (
    <div className="dashboard-container">
      <h2>📊 Budget Overview</h2>

      <div className="summary">
        <div className="card income">
          <h3>Total Income</h3>
          <p>₹{summary.income}</p>
        </div>
        <div className="card expense">
          <h3>Total Expense</h3>
          <p>₹{summary.expense}</p>
        </div>
        <div className="card balance">
          <h3>Balance</h3>
          <p>₹{summary.balance}</p>
        </div>
      </div>

      <div className="filters">
        <input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />
        <button onClick={exportPDF}>Export PDF</button>
        <button onClick={exportExcel}>Export Excel</button>
      </div>

      <div className="chart-section">
        <div className="chart-box">
          <h3>Income vs Expense</h3>
          <Pie data={incomeExpensePie} />
        </div>

        <div className="chart-box">
          <h3>Goal Progress</h3>
          {goals.length === 0 ? <p>No Goals</p> : <Bar data={goalBarData} />}
        </div>
      </div>

      <div className="chart-box">
        <h3>Spending by Category</h3>
        {Object.keys(categoryMap).length === 0 ? (
          <p>No expense data</p>
        ) : (
          <Bar data={spendingChart} />
        )}
      </div>

      <div className="chart-box">
        <h3>Monthly Spending</h3>
        <Line data={monthlySpendingData} />
      </div>
    </div>
  );
};

export default Dashboard;
