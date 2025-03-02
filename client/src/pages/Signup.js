// pages/Signup.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Get the context value to update the userEmail
  const { setUserEmail } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email,
        password,
      });

      if (response.status === 200) {
        setSuccessMessage("Signup successful! Please log in.");
        setUserEmail(email);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response ? error.response.data.error : "Something went wrong"
      );
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh",
    width: "100%",
    //maxWidth: "400px",
    background:
      "linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(22,93,112,1) 100%)",
  };

  const formStyle = {
    padding: "3rem",
    borderRadius: "10px",
    //boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
    background:
      "linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(22,93,112,1) 100%)",
  };

  const headingStyle = {
    fontFamily: "Poppins",
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "2rem",
    color: "White",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    margin: "0.8rem 0",
    borderRadius: "4px",
    border: "whitesmoke",
    fontSize: "1rem",
    fontFamily: "Poppins",
    background:
      "linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(22,93,112,1) 100%)",
  };
  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    background:
      "linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(22,93,112,1) 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontFamily: "Poppins",
  };

  return (
    <div>
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSignup}>
          <h1 style={headingStyle}>Signup Today</h1>
          {/*<div>
            <label>Name:</label>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>*/}
          <div>
            {/*<label>Email:</label>*/}
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            {/*<label>Password:</label>*/}
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
          {successMessage && (
            <p style={{ color: "green", textAlign: "center" }}>
              {successMessage}
            </p>
          )}
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
          <p style={{ fontFamily: "Poppins", color: "white", marginTop: 5 }}>
            Already have an account?{""}
            <Link
              to="/"
              style={{
                fontFamily: "Poppins",
                color: "purple",
                textDecoration: "underline",
                marginLeft: 5,
                marginTop: 5,
                fontSize: 16,
              }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
