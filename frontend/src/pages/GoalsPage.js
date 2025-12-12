import React, { useState, useEffect } from "react";
import axios from "axios";

function GoalsPage() {
  const userId = localStorage.getItem("userId");

  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    userId: userId,
  });

  const [updateAmount, setUpdateAmount] = useState("");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/goals/list/${userId}`)
      .then((res) => setGoals(res.data))
      .catch((err) => console.error("Error fetching goals:", err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/goals", {
        ...formData,
        savedAmount: 0,
      });
      alert("Goal added successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error adding goal");
    }
  };

  const handleAddSavings = async (goalId) => {
    if (!updateAmount || updateAmount <= 0) return alert("Enter valid amount");

    try {
      await axios.put(
        `http://localhost:8080/api/goals/update-saved/${goalId}`,
        { amount: Number(updateAmount) }
      );
      alert("Savings updated!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error updating savings");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/goals/${id}`);
      alert("Goal deleted!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error deleting goal");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>🎯 Savings Goals</h2>

      {/* Add Goal Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          name="name"
          placeholder="Goal Name"
          onChange={handleChange}
          required
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          name="targetAmount"
          type="number"
          placeholder="Target Amount"
          onChange={handleChange}
          required
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          name="deadline"
          type="date"
          onChange={handleChange}
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            flex: "1",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Goal
        </button>
      </form>

      {/* Goals List */}
      {goals.length === 0 ? (
        <p>No goals added yet.</p>
      ) : (
        goals.map((g) => {
          const progress = Math.min(
            (g.savedAmount / g.targetAmount) * 100,
            100
          ).toFixed(0);

          return (
            <div
              key={g.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#fffdf7",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.10)",
              }}
            >
              <h3>{g.name}</h3>

              <div
                style={{
                  background: "#eee",
                  height: "12px",
                  borderRadius: "20px",
                  margin: "8px 0",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: progress >= 100 ? "#2ecc71" : "#00aaff",
                    borderRadius: "20px",
                    transition: "0.4s",
                  }}
                ></div>
              </div>

              <p>
                <strong>{progress}% Completed</strong>
                <br />
                Saved: ₹{g.savedAmount} / ₹{g.targetAmount}
                <br />
                Deadline: {g.deadline || "No deadline"}
              </p>

              {/* Add Savings Input */}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <input
                  type="number"
                  placeholder="Add amount"
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  style={{ flex: 1, padding: "8px" }}
                />
                <button
                  onClick={() => handleAddSavings(g.id)}
                  style={{
                    backgroundColor: "#1b72ff",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ➕ Add
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GoalsPage;
