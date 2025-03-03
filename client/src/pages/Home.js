import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signin from "./Signin";
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
    fontSize: 16,
    textAlign: "center",
    color: "white",
    marginTop: 10,
    marginBottom: 10,
    lineHeight: "1.5em",
  };

  const homeContainerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background:
      "linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(22,93,112,1) 100%)",
    height: "50vh",
  };

  const signInContainerStyle = {
    display: showSignIn ? "block" : "none", // Display sign-in form based on state
    position: "absolute",
    top: "30%",
    left: "80%",
    transform: "translate(-30%, -50%)",
    width: "300px",
    padding: "20px",
    textAlign: "center",
    alignItems: "center",
  };

  return (
    <div>
      {/* Home page container */}
      <div style={homeContainerStyle}>
        <div>
          <p style={descriptionstyle}>welcome to </p>
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
                fontSize: 16,
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
