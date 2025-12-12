import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddTransaction.css";
import BottomNav from "../components/BottomNav";

function AddTransaction() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description || !category || !paymentMethod || !type || !date) {
      toast.error("⚠️ Please fill all fields!", { position: "top-center" });
      return;
    }

    // Ensure userId exists in localStorage
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = 1;
      localStorage.setItem("userId", "1");
    }

    const transaction = {
      userId: Number(userId),
      title: description,
      description: description,
      amount: Number(amount),
      category,
      paymentMethod,
      type,
      date
    };

    console.log("Sending:", transaction);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/transactions",
        transaction,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("Response:", response.data);

      toast.success("✔ Transaction added successfully!", {
        position: "top-center",
      });

      // Reset UI
      setAmount("");
      setDescription("");
      setCategory("");
      setPaymentMethod("");
      setType("");
      setDate("");

      setTimeout(() => navigate("/transactions"), 800);

    } catch (error) {
      console.error("Error:", error.response?.data || error);
      toast.error("❌ Failed to add transaction!", { position: "top-center" });
    }
  };

  return (
    <div className="add-transaction-page">
      <div className="add-transaction-container">
        <h2>Add Transaction</h2>

        <form onSubmit={handleSubmit} className="transaction-form">

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Rent</option>
            <option>Salary</option>
            <option>Shopping</option>
            <option>Health</option>
            <option>Other</option>
          </select>

          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Select Payment Method</option>
            <option>Cash</option>
            <option>Bank</option>
            <option>UPI</option>
            <option>Credit Card</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <button type="submit" className="save-btn">Save</button>
        </form>
      </div>

      <BottomNav />
      <ToastContainer />
    </div>
  );
}

export default AddTransaction;
