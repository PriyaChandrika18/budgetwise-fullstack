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
  const userId = 1; // temporary until login

  // ---------- STATES ----------
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  // ---------- ANIMATION / OPTIONS ----------
  const commonAnimation = {
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  const pieOptions = {
    ...commonAnimation,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  const barOptions = {
    ...commonAnimation,
    plugins: {
      legend: { position: "top" },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineOptions = {
    ...commonAnimation,
    plugins: {
      legend: { position: "top" },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // ---------- API CALLS ----------
  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/summary/${userId}`
      );
      setSummary(await res.json());
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/goals/list/${userId}`
      );
      setGoals(await res.json());
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/list/${userId}`
      );
      setTransactions(await res.json());
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchGoals();
    fetchTransactions();
  }, []);

  // ---------- FILTERING ----------
  const filteredTransactions = transactions.filter((t) => {
    const matchSearch = t.category
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchMonth =
      !monthFilter ||
      t.date.slice(3) === monthFilter.split("-").reverse().join("-");

    return matchSearch && matchMonth;
  });

  // ---------- CHART DATA ----------

  const incomeExpensePie = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [summary.income, summary.expense],
        backgroundColor: ["#22C55E", "#EF4444"],
      },
    ],
  };

  // Spending by category bar chart
  const spendingData = Object.values(
    filteredTransactions.reduce((acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = acc[t.category] || { category: t.category, amount: 0 };
        acc[t.category].amount += t.amount;
      }
      return acc;
    }, {})
  );

  const spendingChart = {
    labels: spendingData.map((d) => d.category),
    datasets: [
      {
        label: "Expenses",
        data: spendingData.map((d) => d.amount),
        backgroundColor: "#FF6B6B",
      },
    ],
  };

  const goalBarData = {
    labels: goals.map((g) => g.name),
    datasets: [
      {
        label: "Saved",
        data: goals.map((g) => g.savedAmount),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Target",
        data: goals.map((g) => g.targetAmount),
        backgroundColor: "#A1A1AA",
      },
    ],
  };

  // ----- MONTHLY SPENDING (TIMELINE) -----
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyMap = {};
  transactions.forEach((t) => {
    if (t.type !== "expense") return;
    const [dd, mm, yyyy] = t.date.split("-");
    const key = `${monthNames[parseInt(mm, 10) - 1]} ${yyyy}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = 0;
    }
    monthlyMap[key] += t.amount;
  });

  const monthlyLabels = Object.keys(monthlyMap);
  const monthlyValues = monthlyLabels.map((label) => monthlyMap[label]);

  const monthlySpendingData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Expense",
        data: monthlyValues,
        borderColor: "#F97316",
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
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

  return (
    <div className="dashboard-container">
      <h2>📊 Budget Overview</h2>

      {/* Summary Cards */}
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

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />

        <button onClick={exportPDF}>📄 Export PDF</button>
        <button onClick={exportExcel}>📊 Export Excel</button>
      </div>

      {/* Charts */}
      <div className="chart-section">
        {/* PIE CHART */}
        <div className="chart-box">
          <h3>Income vs Expense</h3>
          {summary.income === 0 && summary.expense === 0 ? (
            <p>No Data</p>
          ) : (
            <Pie data={incomeExpensePie} options={pieOptions} />
          )}
        </div>

        {/* GOAL CHART */}
        <div className="chart-box">
          <h3>Goal Progress</h3>
          {goals.length === 0 ? (
            <p>No Goals</p>
          ) : (
            <Bar data={goalBarData} options={barOptions} />
          )}
        </div>
      </div>

      {/* CATEGORY SPENDING */}
      <div className="chart-box" style={{ marginTop: "20px" }}>
        <h3>📦 Spending by Category</h3>
        {spendingData.length === 0 ? (
          <p>No expense data.</p>
        ) : (
          <div style={{ height: "280px" }}>
            <Bar data={spendingChart} options={barOptions} />
          </div>
        )}
      </div>

      {/* MONTHLY TIMELINE */}
      <div className="chart-box" style={{ marginTop: "20px" }}>
        <h3>📆 Monthly Spending Timeline</h3>
        {monthlyLabels.length === 0 ? (
          <p>No expense data across months.</p>
        ) : (
          <div style={{ height: "280px" }}>
            <Line data={monthlySpendingData} options={lineOptions} />
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="transactions-section">
        <h3>Recent Transactions</h3>
        {filteredTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <span>
                <strong>
                  {tx.description || tx.title || tx.category}
                </strong>{" "}
                — {tx.category}
              </span>
              <span
                className={tx.type === "income" ? "green" : "red"}
              >
                {tx.type === "income" ? "+" : "-"}₹{tx.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
