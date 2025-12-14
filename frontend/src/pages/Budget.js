import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Budget.css";

const CATEGORY_LIMITS = {
  Food: 2000,
  Travel: 1600,
  Shopping: 400,
  Health: 1000,
  Other: 800,
};

export default function Budget() {
  const userId = Number(localStorage.getItem("userId")) || 1;

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);

  // 🔹 FETCH DATA
  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/transactions/list/${userId}`
      );
      setTransactions(res.data);
      calculateBudget(res.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/goals/list/${userId}`
      );
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals", err);
    }
  };

  // 🔹 CORE BUDGET LOGIC
  const calculateBudget = (transactions) => {
    const expenses = transactions.filter((t) => t.type === "expense");

    const categoryMap = {};
    expenses.forEach((t) => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    });

    const finalCategories = Object.keys(CATEGORY_LIMITS).map((cat) => ({
      name: cat,
      budget: CATEGORY_LIMITS[cat],
      spent: categoryMap[cat] || 0,
    }));

    setCategories(finalCategories);
  };

  // 🔹 SUMMARY
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="budget-page">
      <h1>Budget</h1>

      <div className="budget-container">
        {/* ------------------ BUDGET ------------------ */}
        <div className="budget-card">
          <h3>Monthly Budget</h3>

          {categories.map((c) => {
            const used = Math.min(
              100,
              Math.round((c.spent / c.budget) * 100)
            );

            return (
              <div key={c.name} className="budget-row">
                <div>
                  <b>{c.name}</b>
                  <div>
                    ₹{c.budget - c.spent} remaining • {used}% used
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${used}%` }}
                    />
                  </div>
                </div>
                <div>₹{c.budget}</div>
              </div>
            );
          })}

          {/* ------------------ GOALS ------------------ */}
          <h3 style={{ marginTop: "20px" }}>Savings Goals</h3>

          {goals.length === 0 ? (
            <p>No savings goals yet.</p>
          ) : (
            goals.map((g) => {
              const saved = g.savedAmount || 0;
              const target = g.targetAmount || 1;
              const remainingGoal = target - saved;
              const percent = Math.min(
                100,
                Math.round((saved / target) * 100)
              );

              return (
                <div key={g.id} className="goal-row">
                  <div>
                    <b>{g.name}</b>
                    <div>₹{remainingGoal} remaining</div>
                    <div className="progress-bar small">
                      <div
                        className="progress-fill goal"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ------------------ SUMMARY ------------------ */}
        <aside className="budget-summary">
          <h3>Summary</h3>
          <p>Total Budget: ₹{totalBudget}</p>
          <p>Total Spent: ₹{totalSpent}</p>
          <p>Remaining: ₹{remaining}</p>
        </aside>
      </div>
    </div>
  );
}
