import React, { useState } from "react";
import axios from "axios";

// Function to dynamically get image path based on workout type
const getImagePath = (workoutType) => {
  try {
    return require(`../images/${workoutType.toLowerCase()}.jpg`);
  } catch (error) {
    return require(`../images/default.jpg`);
  }
};

const WorkoutForm = ({ setWorkoutPlan, userEmail }) => {
  const [calories, setCalories] = useState("");
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [error, setError] = useState("");

  const availableWorkouts = [
    "RUNNING",
    "CYCLING",
    "SWIMMING",
    "JOGGING",
    "DANCING",
    "BADMINTON",
    "TENNIS",
    "BOXING",
    "BASKETBALL",
    "VOLLEYBALL",
    "BASEBALL",
    "YOGA",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!calories || workoutTypes.length === 0) {
      setError("Please provide calories and select at least one workout.");
      return;
    }

    if (workoutTypes.length > 6) {
      setError("You can select up to 6 workout activities.");
      return;
    }
    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Log the date to check if it's correctly formatted
    console.log("Today's date:", today);

    try {
      const response = await axios.post("http://localhost:5000/api/workout", {
        email: userEmail,
        calories: parseInt(calories),
        workoutTypes,
        date: today,
      });

      if (response.status === 200) {
        setWorkoutPlan(response.data);
        setError("");
      } else {
        setError("Failed to fetch workout plan. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching workout plan:", error);
      setError(
        error.response?.data?.error ||
          "Failed to fetch workout plan. Please try again."
      );
    }
  };

  const handleWorkoutSelect = (workout) => {
    if (workoutTypes.includes(workout)) {
      // Deselect workout
      setWorkoutTypes(workoutTypes.filter((w) => w !== workout));
    } else if (workoutTypes.length < 6) {
      // Select workout if less than 3 are selected
      setWorkoutTypes([...workoutTypes, workout]);
    }
  };

  // Styles
  const buttonStyle = () => ({
    width: "100%",
    padding: "0.8rem",
    backgroundImage:
      "linear-gradient(to right top,rgb(106, 146, 104),rgb(81, 119, 94))",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "20px",
    fontFamily: "Poppins",
  });

  const formContainerStyle = () => ({
    borderRadius: "10px",
    padding: "20px",
    color: "white",
    fontFamily: "Poppins",
    fontSize: "20px",
    marginTop: "15px",
  });

  const inputStyle = () => ({
    borderRadius: "5px",
    fontFamily: "Poppins",
    backgroundImage:
      "linear-gradient(to right top, #adbea1, #a3bda2, #99bca5, #8fbba8, #8bbfac, #86c2b1, #81c6b6, #7bc9bc)",

    padding: "10px",
    marginBottom: "10px",

    fontSize: "18px",
    fontWeight: "500",
  });

  const workoutCardStyle = (workoutTypes, workout) => ({
    cursor: "pointer",
    border: workoutTypes.includes(workout)
      ? "3px solid white"
      : "1px solid lightgray",
    borderRadius: "10px",
    background: workoutTypes.includes(workout)
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(255, 255, 255, 0.1)",
    color: "white",
  });

  const cardImageStyle = () => ({
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px 10px 0 0",
  });

  return (
    <div className="workout-form-container p-4" style={formContainerStyle()}>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <input
            type="text"
            id="calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Enter Calories To Burn"
            className="form-control"
            style={inputStyle()}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label className="mb-2">Select Workout Types (Up to 3):</label>
          <div className="row">
            {availableWorkouts.map((workout, index) => (
              <div key={index} className="col-md-3 mb-3">
                <div
                  className={`card text-center ${
                    workoutTypes.includes(workout) ? "border-primary" : ""
                  }`}
                  onClick={() => handleWorkoutSelect(workout)}
                  style={workoutCardStyle(workoutTypes, workout)}
                >
                  <img
                    src={getImagePath(workout)}
                    alt={workout}
                    className="card-img-top"
                    style={cardImageStyle()}
                  />
                  <div className="card-body">
                    <p className="card-text text-capitalize">{workout}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={buttonStyle()}>
          Proceed
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
