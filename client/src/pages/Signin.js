import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext"; // Import UserContext

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get the context value to update the userEmail
  const { setUserEmail } = useContext(UserContext);

  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://caloriemate-server.vercel.app"
      : "http://localhost:5000";

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/signin`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Update the context with the signed-in user's email
        setUserEmail(email);
        navigate("/browsefood");
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
    alignItems: "center",
    height: "10vh",
    width: "150%",
    maxWidth: "800px",
  };

  const formStyle = {
    padding: "2rem",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "800px",
    backgroundImage:
      "linear-gradient(to right top, #c2c3a2, #adbea1, #a3bda2, #adbea1)",
  };

  const headingStyle = {
    fontFamily: "Poppins",
    textAlign: "center",
    fontSize: "20px",
    marginBottom: "2rem",
    color: "Purple",
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
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontFamily: "Poppins",
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
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSignin}>
        <h1 style={headingStyle}>User Login</h1>
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
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button type="submit" style={buttonStyle}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
