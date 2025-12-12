import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "../styles/SavingsGoals.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SavingsGoals = () => {
  const userId = 1; // temp until login system connected

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);

  // Fetch goals
  const fetchGoals = async () => {
    const res = await fetch(`http://localhost:8080/api/goals/list/${userId}`);
    const data = await res.json();
    setGoals(data);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add Goal
  const handleAddGoal = async () => {
    if (!name || !targetAmount) return alert("Fill all fields");

    await fetch("http://localhost:8080/api/goals/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, targetAmount, userId }),
    });

    setName("");
    setTargetAmount("");
    fetchGoals(); // 🔥 Refresh only after change
  };

  // Save Edited Goal
  const handleSaveEdit = async () => {
    await fetch(`http://localhost:8080/api/goals/edit/${editingGoal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingGoal),
    });

    setEditingGoal(null);
    fetchGoals(); // 🔥 Refresh only after update
  };

  // Delete Goal
  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    await fetch(`http://localhost:8080/api/goals/delete/${id}`, {
      method: "DELETE",
    });

    fetchGoals(); // 🔥 Refresh after delete
  };

  // ---------- CHART DATA ----------

  const pieData = {
    labels: goals.map((g) => g.name),
    datasets: [
      {
        data: goals.map((g) => Math.min((g.savedAmount / g.targetAmount) * 100, 100)),
        backgroundColor: ["#FF6384", "#36A2EB", "#766434ff", "#4a935aff", "#6e478eff"],
      },
    ],
  };

  const barData = {
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
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="container">
      <h2>🎯 Savings Goals</h2>

      {/* Add Form */}
      <div className="goal-form">
        <input
          placeholder="Goal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target Amount (₹)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <button onClick={handleAddGoal}>➕ Add Goal</button>
      </div>

      {/* Charts */}
      {goals.length > 0 && (
        <div className="chart-section">
          <div className="chart-box">
            <h3>Progress Tracking</h3>
            <Pie data={pieData} />
          </div>

          <div className="chart-box">
            <h3>Target vs Saved</h3>
            <Bar data={barData} />
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="goal-list">
        {goals.map((goal) => {
          const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);

          return (
            <div key={goal.id} className="goal-item">
              <strong>{goal.name}</strong>
              <p>₹{goal.savedAmount} / ₹{goal.targetAmount}</p>

              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <button
                className="edit-btn"
                onClick={() =>
                  setEditingGoal({
                    id: goal.id,
                    name: goal.name,
                    targetAmount: goal.targetAmount,
                    savedAmount: goal.savedAmount,
                  })
                }
              >
                ✏ Edit
              </button>

              <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>
                ❌ Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit Popup */}
      {editingGoal && (
        <div className="popup">
          <div className="popup-box">
            <h3>Edit Goal</h3>

            <input
              value={editingGoal.name}
              onChange={(e) =>
                setEditingGoal({ ...editingGoal, name: e.target.value })
              }
            />

            <input
              type="number"
              value={editingGoal.targetAmount}
              onChange={(e) =>
                setEditingGoal({ ...editingGoal, targetAmount: e.target.value })
              }
            />

            <button className="save-btn" onClick={handleSaveEdit}>💾 Save</button>
            <button className="close-btn" onClick={() => setEditingGoal(null)}>✖ Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
