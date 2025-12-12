// src/pages/Transactions.js

import React, { useEffect, useState } from "react";
import "./Transactions.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    paymentMethod: "",
    type: "",
    date: "",
  });

  const userId = 1; // static until login

  // ---------------- FETCH ----------------
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/list/${userId}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ---------------- DELETE ----------------
  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) fetchTransactions();
      else alert("Delete failed");
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ---------------- START EDIT ----------------
  const startEditing = (tx) => {
    setEditingId(tx.id);

    // Convert dd-MM-yyyy → yyyy-MM-dd
    const [dd, mm, yyyy] = tx.date.split("-");
    const convertDate = `${yyyy}-${mm}-${dd}`;

    setForm({
      description: tx.description || tx.title || "",
      amount: tx.amount,
      category: tx.category,
      paymentMethod: tx.paymentMethod,
      type: tx.type,
      date: convertDate,
    });
  };

  const cancelEdit = () => setEditingId(null);

  // ---------------- SAVE EDIT ----------------
  const saveEdit = async () => {
    if (!editingId) return;

    // Convert yyyy-MM-dd → dd-MM-yyyy for backend
    const [yyyy, mm, dd] = form.date.split("-");
    const formattedDate = `${dd}-${mm}-${yyyy}`;

    const updatedTransaction = {
      description: form.description,
      title: form.description, // legacy safe field
      amount: Number(form.amount),
      category: form.category,
      paymentMethod: form.paymentMethod,
      type: form.type,
      date: formattedDate,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTransaction),
        }
      );

      if (res.ok) {
        setEditingId(null);
        fetchTransactions();
      } else {
        const errorMsg = await res.text();
        alert("Update failed: " + errorMsg);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <h2 className="transactions-title">All Transactions</h2>

        <div className="transaction-list">
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className={`transaction-card ${
                  tx.type === "income" ? "income" : "expense"
                }`}
              >
                {/* -------- EDIT MODE -------- */}
                {editingId === tx.id ? (
                  <>
                    <input
                      type="text"
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />

                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Category"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />

                    <select
                      value={form.paymentMethod}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                    >
                      <option>Cash</option>
                      <option>Bank</option>
                      <option>UPI</option>
                      <option>Credit Card</option>
                    </select>

                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>

                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />

                    <button className="save-btn" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  /* -------- VIEW MODE -------- */
                  <>
                    <div className="transaction-info">
                      <strong>{tx.description || tx.title}</strong>
                      <span>
                        {tx.category} | {tx.paymentMethod}
                      </span>
                      <small>{tx.date}</small>
                    </div>

                    <div className={`transaction-amount ${tx.type}`}>
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                    </div>

                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(tx)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTransaction(tx.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
