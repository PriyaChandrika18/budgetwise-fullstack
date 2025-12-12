// src/pages/BudgetPage.js
import React, { useEffect, useState } from "react";
import "../styles/Budget.css"; // keep using your existing Budget.css file
import Budget from "../components/Budget";

const BudgetPage = () => {
  const userId = 1; // temporary until you hook real login

  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [editingBudget, setEditingBudget] = useState(null);

  // -------- API CALLS --------
  const fetchBudgets = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/budgets/list/${userId}`
      );
      const data = await res.json();
      setBudgets(data || []);
    } catch (err) {
      console.error("Error loading budgets:", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const resetForm = () => {
    setEditingBudget(null);
    setCategory("");
    setLimitAmount("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !limitAmount) {
      alert("Please fill category and limit amount");
      return;
    }

    const body = {
      category,
      limitAmount: Number(limitAmount),
      userId,
      // backend can compute spentAmount from transactions
    };

    try {
      if (editingBudget) {
        await fetch(
          `http://localhost:8080/api/budgets/edit/${editingBudget.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...editingBudget, ...body }),
          }
        );
      } else {
        await fetch("http://localhost:8080/api/budgets/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      resetForm();
      fetchBudgets();
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget category?")) return;

    try {
      await fetch(`http://localhost:8080/api/budgets/delete/${id}`, {
        method: "DELETE",
      });
      fetchBudgets();
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  // -------- SUMMARY --------
  const totalPlanned = budgets.reduce(
    (sum, b) => sum + (b.limitAmount || 0),
    0
  );
  const totalSpent = budgets.reduce(
    (sum, b) => sum + (b.spentAmount || 0),
    0
  );
  const totalRemaining = Math.max(totalPlanned - totalSpent, 0);
  const overallPct =
    totalPlanned > 0 ? Math.min((totalSpent / totalPlanned) * 100, 100) : 0;

  return (
    <div className="budget-page">
      {/* header row like screenshot */}
      <div className="budget-header-row">
        <div>
          <h2>Budget 🔥</h2>
          <p className="budget-subtitle">
            Plan your spending by category for this month.
          </p>
        </div>
        <button
          type="button"
          className="primary-btn"
          onClick={resetForm}
        >
          + New category
        </button>
      </div>

      {/* 1 month budget card */}
      <div className="budget-summary-card">
        <div className="summary-top">
          <div>
            <h3>1 Month budget</h3>
            <p className="summary-subtitle">Across all categories</p>
          </div>

          <div className="summary-amounts">
            <div>
              <span className="summary-label">Planned</span>
              <p className="summary-value">₹{totalPlanned}</p>
            </div>
            <div>
              <span className="summary-label">Spent</span>
              <p className="summary-value">₹{totalSpent}</p>
            </div>
            <div>
              <span className="summary-label">Remaining</span>
              <p className="summary-value">₹{totalRemaining}</p>
            </div>
          </div>
        </div>

        <div className="overall-progress">
          <div
            className="overall-progress-bar"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* add / edit form card */}
      <div className="budget-card add-budget-card">
        <h3>
          {editingBudget ? "Edit budget category" : "Create budget category"}
        </h3>
        <form className="budget-form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Category (Food, Shopping, Rent...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className="input"
            type="number"
            placeholder="Monthly limit (₹)"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
          />

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingBudget ? "💾 Save changes" : "➕ Add"}
            </button>
            {editingBudget && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                ✖ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* cards grid like screenshot */}
      <div className="budgets-grid">
        {budgets.length === 0 ? (
          <p className="empty-text">
            No budgets yet. Add a category above to get started.
          </p>
        ) : (
          budgets.map((b) => (
            <Budget
              key={b.id}
              budget={b}
              onEdit={(bud) => {
                setEditingBudget(bud);
                setCategory(bud.category);
                setLimitAmount(bud.limitAmount);
              }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
