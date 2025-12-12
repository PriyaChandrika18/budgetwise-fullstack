import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Budget.css";

const MOCK_CATEGORIES = [
  { id: 1, name: "Food & Dining", budget: 2000, spent: 800 },
  { id: 2, name: "Transportation", budget: 1600, spent: 800 },
  { id: 3, name: "Entertainment", budget: 800, spent: 300 },
  { id: 4, name: "Shopping", budget: 400, spent: 300 },
];

const MOCK_GOALS = [
  { id: 1, name: "Vacation Fund", target: 2500, saved: 500 },
  { id: 2, name: "Emergency Fund", target: 1000, saved: 200 },
];

export default function Budget() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  async function fetchData() {
    setError("");
    try {
      // Replace these with your real API endpoints.
      // Example: const catsRes = await axios.get(`/api/budgets/month/${selectedMonth}`);
      //          const goalsRes = await axios.get(`/api/goals/list`);
      // For now we'll use the mock data to show layout immediately:
      setTimeout(() => {
        setCategories(MOCK_CATEGORIES);
        setGoals(MOCK_GOALS);
      }, 200); // slight delay to simulate network
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      // fallback to mock so UI still shows
      setCategories(MOCK_CATEGORIES);
      setGoals(MOCK_GOALS);
    }
  }

  function handleMonthChange(e) {
    setSelectedMonth(e.target.value);
  }

  function addGoal() {
    if (!newGoalName || !newGoalTarget) return alert("Enter name and target");
    const newGoal = {
      id: Date.now(),
      name: newGoalName,
      target: Number(newGoalTarget),
      saved: 0,
    };
    setGoals((g) => [newGoal, ...g]);
    setNewGoalName("");
    setNewGoalTarget("");
  }

  function deleteGoal(id) {
    setGoals((g) => g.filter((x) => x.id !== id));
  }

  // computed summary
  const totalBudget = categories.reduce((s, c) => s + (c.budget || 0), 0);
  const totalSpent = categories.reduce((s, c) => s + (c.spent || 0), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="budget-page">
      <div className="budget-header">
        <a className="back-arrow" href="/dashboard">←</a>
        <h1>Budget</h1>
      </div>

      <div className="budget-controls">
        <label htmlFor="month">Month</label>
        <input id="month" type="month" value={selectedMonth} onChange={handleMonthChange} />
        <button className="budget-btn-primary" onClick={fetchData}>Refresh</button>
        {error && <span className="budget-error">{error}</span>}
      </div>

      <div className="budget-container">
        <div className="budget-card">
          <h3 className="card-title">Monthly Budget</h3>

          {categories.length === 0 ? (
            <p className="muted">No categories found.</p>
          ) : (
            categories.map((c) => {
              const used = Math.min(100, Math.round(((c.spent || 0) / (c.budget || 1)) * 100));
              const remainingText = (c.budget - (c.spent || 0));
              return (
                <div key={c.id} className="budget-row">
                  <div className="row-left">
                    <div className="icon-placeholder">🍽️</div>
                    <div className="row-meta">
                      <div className="cat-name">{c.name}</div>
                      <div className="cat-sub">{`₹${remainingText.toLocaleString()} remaining • ${used}% used`}</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: used + "%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="row-right">₹{c.budget.toLocaleString()}</div>
                </div>
              );
            })
          )}

          <h4 className="section-title">Savings Goals</h4>

          <div className="goal-input-row">
            <input
              className="goal-input"
              placeholder="Goal name"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
            />
            <input
              className="goal-input"
              placeholder="Target"
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
            />
            <button className="add-goal-btn" onClick={addGoal}>Add</button>
          </div>

          {goals.length === 0 ? (
            <p className="muted">No savings goals yet.</p>
          ) : (
            goals.map((g) => {
              const pct = Math.min(100, Math.round(((g.saved || 0) / (g.target || 1)) * 100));
              return (
                <div key={g.id} className="goal-row">
                  <div className="goal-left">
                    <div className="goal-icon">🎯</div>
                    <div>
                      <div className="goal-name">{g.name}</div>
                      <div className="goal-sub">₹{(g.target - (g.saved || 0)).toLocaleString()} remaining</div>
                      <div className="progress-bar small">
                        <div className="progress-fill goal" style={{ width: pct + "%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="goal-right">
                    <button className="goal-delete" onClick={() => deleteGoal(g.id)}>✕</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <aside className="budget-summary">
          <h3>Summary</h3>
          <div className="summary-row">
            <div>Total Budget</div>
            <div className="summary-value">₹{totalBudget.toLocaleString()}</div>
          </div>
          <div className="summary-row">
            <div>Total Spent</div>
            <div className="summary-value">₹{totalSpent.toLocaleString()}</div>
          </div>
          <div className="summary-row">
            <div>Remaining</div>
            <div className="summary-value">₹{remaining.toLocaleString()}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
