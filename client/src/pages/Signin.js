// pages/Signin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        // Redirect to home page after successful sign-in
        navigate("/home");
      }
    } catch (error) {
      setError(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
