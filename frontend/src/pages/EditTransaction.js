import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddTransaction.css"; // ✅ Reuse the same styles as AddTransaction

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState({
    amount: "",
    description: "",
    category: "",
    account: "",
    date: "",
    userId: 1, // example userId, replace with logged-in user later
  });

  // ✅ Fetch transaction details on load
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/transactions/${id}`);
        setTransaction(res.data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        alert("Failed to load transaction details.");
      }
    };
    fetchTransaction();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/transactions/update/${id}`, transaction);
      alert("Transaction updated successfully!");
      navigate("/transactions");
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction!");
    }
  };

  return (
    <div className="add-transaction-page">
      <div className="form-header">
        <h2>Edit Transaction</h2>
      </div>

      <form className="transaction-form" onSubmit={handleUpdate}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={transaction.amount || ""}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={transaction.description || ""}
          onChange={handleChange}
        />

        <select
          name="category"
          value={transaction.category || ""}
          onChange={handleChange}
          required
        >
          <option value="">Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Salary">Salary</option>
        </select>

        <select
          name="account"
          value={transaction.account || ""}
          onChange={handleChange}
          required
        >
          <option value="">Account</option>
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
          <option value="Card">Card</option>
        </select>

        <input
          type="date"
          name="date"
          value={transaction.date || ""}
          onChange={handleChange}
          required
        />

        <button type="submit" className="save-btn">
          Update
        </button>
      </form>

      {/* ✅ Bottom Navigation */}
      <div className="bottom-nav">
        <a href="/dashboard">🏠 Dashboard</a>
        <a href="/transactions" className="active">📋 Transactions</a>
        <a href="/budget">📊 Budget</a>
        <a href="/profile">👤 Profile</a>
      </div>
    </div>
  );
}

export default EditTransaction;
