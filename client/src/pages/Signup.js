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
        setSuccessMessage("Signup Successful! Please sign in now!!");
        setUserEmail(email);

        // Optional: Delay the navigation to allow time to show success message
        setTimeout(() => {
          navigate("/");
        }, 4000);
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
    backgroundImage:
      "linear-gradient(to right top, #fdcfbf, #ebcbb0, #d7c7a7, #c2c3a2, #adbea1, #a3bda2, #99bca5, #8fbba8, #8bbfac, #86c2b1, #81c6b6, #7bc9bc)",
  };

  const formStyle = {
    marginTop: "150px",
    padding: "3rem",
    borderRadius: "10px",
    //boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
    background: " #d4edda",
  };

  const headingStyle = {
    fontFamily: "Poppins",
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "2rem",
    color: "green",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    margin: "0.8rem 0",
    borderRadius: "4px",
    border: "whitesmoke",
    fontSize: "1rem",
    fontFamily: "Poppins",
    background: "white",
  };
  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontFamily: "Poppins",
    marginBottom: "1rem",
  };

  // Screen reader only style for hidden labels
  const srOnlyStyle = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: 0,
  };

  return (
    <div>
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSignup}>
          <h1 style={headingStyle}>Signup Today</h1>
          <div>
            <label htmlFor="email" style={srOnlyStyle}>
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="password" style={srOnlyStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
          {successMessage && (
            <p
              style={{
                color: "green",
                backgroundColor: "white",
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
                //margin: "10px 0",
                fontFamily: "Poppins",
              }}
            >
              {successMessage}
            </p>
          )}
          <p
            style={{
              fontFamily: "Poppins",
              color: "rgb(0, 64, 0)",
              marginTop: 5,
              fontSize: 18,
            }}
          >
            Already have an account?{""}
            <Link
              to="/"
              style={{
                fontFamily: "Poppins",
                color: "purple",
                textDecoration: "underline",
                marginLeft: 5,
                marginTop: 5,
                fontSize: 18,
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
