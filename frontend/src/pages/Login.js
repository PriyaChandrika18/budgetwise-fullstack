import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate for redirect
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ React Router navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Backend login API call
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      // ✅ Assume backend returns user info (id, name, email, etc.)
      const user = response.data;

      // ✅ Save user info in localStorage for later use
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name || "User");
      localStorage.setItem("userEmail", user.email);

      alert("✅ Login successful!");

      // ✅ Redirect to Profile page
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        <p>Login to your BudgetWise account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-text">
          Don’t have an account?{" "}
          <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
