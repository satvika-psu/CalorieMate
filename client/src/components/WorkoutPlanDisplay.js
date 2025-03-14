import React, { useState } from "react";
//import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveWorkout } from "../services/workoutService";

// Function to dynamically get image path based on workout type
const getImagePath = (workoutType) => {
  try {
    return require(`../images/${workoutType.toLowerCase()}.jpg`);
  } catch (error) {
    return require(`../images/default.jpg`);
  }
};

const WorkoutPlanDisplay = ({ workoutPlan, setWorkoutPlan, userEmail }) => {
  const [saveMessages, setSaveMessages] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [viewWorkouts, setViewWorkouts] = useState(false);
  const navigate = useNavigate();

  // Function to Save Workout
  const handleSaveWorkout = async (workoutType) => {
    if (!userEmail) {
      setErrorMessages((prev) => ({
        ...prev,
        [workoutType]: "No user email found. Please sign in.",
      }));
      return;
    }

    try {
      const workoutData = workoutPlan[workoutType];
      const id = Date.now(); // Unique ID for each workout
      await saveWorkout({
        id: id,
        workoutType: workoutType,
        duration: workoutData.duration,
        caloriesBurned: workoutData.caloriesBurned,
        email: userEmail,
        totalCalories: workoutData.totalCalories,
      });

      setSaveMessages((prev) => ({
        ...prev,
        [workoutType]: "Workout saved successfully!",
      }));
      setErrorMessages((prev) => ({
        ...prev,
        [workoutType]: "",
      }));

      setViewWorkouts(true);
    } catch (error) {
      console.error("Error saving workout:", error);
      setErrorMessages((prev) => ({
        ...prev,
        [workoutType]: "Failed to save workout. Please try again.",
      }));
    }
  };

  const handleDurationChange = (e, workoutType) => {
    const newDuration = e.target.value;
    setWorkoutPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };
      const caloriesPerMinute = prevPlan[workoutType].caloriesBurned / 60;
      updatedPlan[workoutType].duration = newDuration;
      updatedPlan[workoutType].totalCalories = (
        (newDuration / 60) *
        caloriesPerMinute *
        60
      ).toFixed(2);
      return updatedPlan;
    });
  };

  // Styles
  const cardStyle = () => ({
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
  });

  const cardImageStyle = () => ({
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px 10px 0 0",
  });

  const inputStyle = () => ({
    width: "100%",
    padding: "8px",
    borderRadius: "3px",
    border: "1px solid #ddd",
    fontSize: "15px",
    fontFamily: "Poppins",
  });

  const buttonStyle = () => ({
    width: "100%",
    padding: "0.8rem",
    backgroundImage:
      "linear-gradient(to right top,rgb(106, 146, 104),rgb(81, 119, 94))",

    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "18px",
    fontFamily: "Poppins",
  });

  const messageStyle = (type) => ({
    color: type === "success" ? "green" : "red",
    fontSize: "16px",
    marginTop: "20px",
    textAlign: "center",
  });
  const handleViewWorkouts = () => {
    navigate("/dashboard");
  };

  return (
    <div className="workout-plan mt-4">
      <h2
        className="mb-3"
        style={{ color: "white", textAlign: "center", padding: "10px" }}
      >
        Workout Plan for the Day
      </h2>
      <div className="row">
        {Object.keys(workoutPlan).map((workoutType, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-3 shadow-sm" style={cardStyle()}>
              <img
                src={getImagePath(workoutType)}
                alt={workoutType}
                className="card-img-top"
                style={cardImageStyle()}
              />
              <div className="card-body">
                <h3
                  className="card-title text-capitalize"
                  style={{
                    color: "rgba(22,93,112,1)",
                    fontSize: "25px",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  {workoutType}
                </h3>
                <div
                  className="exercise-item"
                  style={{
                    color: "rgba(22,93,112,1)",
                    marginBottom: "20px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  <p>
                    Duration (minutes):
                    <input
                      type="number"
                      className="form-control"
                      value={workoutPlan[workoutType].duration}
                      onChange={(e) => handleDurationChange(e, workoutType)}
                      style={inputStyle()}
                    />
                  </p>
                  <p>
                    Calories Burned (per hour):{" "}
                    {workoutPlan[workoutType].caloriesBurned}
                  </p>
                  <p>
                    Total Calories: {workoutPlan[workoutType].totalCalories}
                  </p>
                </div>

                <button
                  style={buttonStyle()}
                  onClick={() => handleSaveWorkout(workoutType)}
                >
                  Save Workout
                </button>

                {saveMessages[workoutType] && (
                  <p style={messageStyle("success")}>
                    {saveMessages[workoutType]}
                  </p>
                )}
                {errorMessages[workoutType] && (
                  <p style={messageStyle("error")}>
                    {errorMessages[workoutType]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewWorkouts && (
        <div className="view-workouts-container mt-4">
          <button style={buttonStyle()} onClick={handleViewWorkouts}>
            View Workouts by Date
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanDisplay;
