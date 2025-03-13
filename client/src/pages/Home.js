import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signin from "./Signin";
import backgroundImage from "../images/background.png";
const Home = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  // Function to hide the Signin form after successful sign-in
  const handleSignInSuccess = () => {
    setShowSignIn(false);
  };

  const handleStartNowClick = () => {
    navigate("/signup");
  };
  const titlestyle = {
    fontFamily: "Poppins",
    fontSize: 40,
    lineHeight: "1.5em",
    letterSpacing: "0.5em ",
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
  };

  const taglinestyle = {
    fontFamily: "Poppins",
    fontSize: 14,
    textAlign: "center",
    color: "purple",
    marginTop: 10,
    marginBottom: 10,
    lineHeight: "1.5em",
    letterSpacing: "0.25em",
    fontWeight: "bold",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#28a745",
    border: "0px",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "40px",
    textAlign: "center",
  };

  const descriptionstyle = {
    fontFamily: "Poppins",
    fontSize: 20,
    textAlign: "center",
    color: "rgb(255,127,80)",
    marginTop: 10,
    marginBottom: 10,
    lineHeight: "1.5em",
  };

  const pageContainerStyle = {
    height: "100vh", // Full viewport height
    backgroundImage: `url(${backgroundImage})`, // Set the background image here
    backgroundSize: "cover", // Ensure the image covers the entire page
    backgroundPosition: "center", // Center the image
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const homeContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "-25vh",
  };

  const signInContainerStyle = {
    display: showSignIn ? "block" : "none",
    position: "absolute",
    top: "40%",
    left: "80%",
    transform: "translate(-30%, -50%)",
    width: "300px",
    padding: "20px",
    textAlign: "center",
    alignItems: "center",
  };

  return (
    <div style={pageContainerStyle}>
      {/* Home page container */}
      <div style={homeContainerStyle}>
        <div>
          <p style={descriptionstyle}>Welcome to </p>
          <h1 style={titlestyle}>CALORIEMATE</h1>
          <p style={taglinestyle}>
            Track Nutrition, Plan Meals, Crush Workouts
          </p>
          <button style={buttonStyle} onClick={handleStartNowClick}>
            Start Now
          </button>

          <p style={descriptionstyle}>
            Already have an account?{" "}
            <span
              style={{
                color: "purple",
                textDecoration: "underline",
                marginLeft: 5,
                marginTop: 5,
                fontSize: 18,
                cursor: "pointer",
              }}
              onClick={() => setShowSignIn(true)}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      {/* Conditionally render the Signin form */}
      <div style={signInContainerStyle}>
        {showSignIn && <Signin handleSignInSuccess={handleSignInSuccess} />}
      </div>
    </div>
  );
};

export default Home;
