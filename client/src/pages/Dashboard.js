import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

import {
  fetchWorkouts,
  deleteWorkout,
  updateWorkoutDuration,
  updateWorkoutStatus,
} from "../services/workoutService";

const Dashboard = () => {
  const { userEmail } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [newDuration, setNewDuration] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fetch workouts on component mount
  useEffect(() => {
    if (userEmail) {
      fetchWorkouts(userEmail)
        .then(setWorkouts)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setError("User is not logged in");
      setLoading(false);
    }
  }, [userEmail]);
  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  // Function to delete workout
  const handleDelete = async (workoutId) => {
    try {
      await deleteWorkout(workoutId);
      setWorkouts(await fetchWorkouts(userEmail));
      setMessage("Workout deleted Sucessfully!!");
    } catch (err) {
      console.error(err.message);
    }
  };

  //Function to edit workout
  const handleEdit = (workoutId, currentDuration) => {
    setEditingWorkoutId(workoutId);
    setNewDuration(currentDuration);
  };

  //Function to save updated workout duration
  const handleSaveDuration = async (workoutId) => {
    try {
      await updateWorkoutDuration(workoutId, newDuration);
      setWorkouts(await fetchWorkouts(userEmail));
      setEditingWorkoutId(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Function to update workout status when clicked on mark as completed button
  const handleStatusUpdate = async (workoutId, status) => {
    try {
      await updateWorkoutStatus(workoutId, status);
      setWorkouts(await fetchWorkouts(userEmail));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Function to calculate total calories based on the workout status
  const getTotalCalories = (status) => {
    return workouts
      .filter((workout) => workout.status === status)
      .reduce((total, workout) => total + workout.totalcalories, 0);
  };
  const totalCaloriesTrue = getTotalCalories(true);
  const totalCaloriesFalse = getTotalCalories(false);
  const totalCalories = totalCaloriesTrue + totalCaloriesFalse;
  const progressPercentage = Math.min(
    (totalCaloriesTrue / totalCalories) * 100,
    100
  );

  //Styles
  const homeContainerStyle = {
    height: "200vh",
    padding: "20px",
    width: "100%",
    backgroundImage:
      "linear-gradient(to right top, #fdcfbf, #ebcbb0, #d7c7a7, #c2c3a2, #adbea1, #a3bda2, #99bca5, #8fbba8, #8bbfac, #86c2b1, #81c6b6, #7bc9bc)",
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "200vh",
    padding: "20px",
    width: "100%",
    marginTop: "20px",
    marginLeft: "100px",
    background: "transparent",
  };

  const headingContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "Flex-start",
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid lightgray",
    borderRadius: "12px",
    width: "70%",
    backgroundColor: "white",
    fontFamily: "Poppins",
  };

  const headingStyle = {
    color: "purple",
    marginBottom: "10px",
    fontFamily: "Poppins",
    fontSize: "20px",
  };

  const subheadingStyle = {
    color: "Green",
    marginBottom: "20px",
    fontFamily: "Poppins",
    fontSize: "15px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Poppins",
  };

  const tableContainerStyle = {
    width: "70%",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
  };
  const tableHeaderStyle = {
    backgroundColor: " rgba(34, 193, 195, 1)",
    color: "white",
    textAlign: "left",
    padding: "10px",
  };

  const tableCellStyle = {
    padding: "5px",
    border: "white",
    color: "white",
  };

  const buttonStyle = {
    marginTop: "10px",
    background: " rgba(34, 193, 195, 1)",
    color: " white",
    border: " none",
    borderRadius: "5px",
    fontFamily: "Poppins",
    marginLeft: "5px",
    marginRight: "5px",
    outline: "none",
  };

  const progressBarStyle = {
    width: "100%",
    backgroundColor: "#e0e0df",
    borderRadius: "8px",
    height: "20px",
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: "100%",
    background:
      "repeating-linear-gradient(45deg, #4caf50, #4caf50 10px, #81c784 10px, #81c784 20px)",
    borderRadius: "5px",
    transition: "width 0.5s ease-out",
  });

  return (
    <div style={homeContainerStyle}>
      <div className="container" style={containerStyle}>
        <div style={headingContainerStyle}>
          <h1 style={headingStyle}>Workouts</h1>
          <p style={subheadingStyle}>
            Number of workouts for today:{" "}
            {workouts.filter((workout) => !workout.status).length}
          </p>
          <button
            className="btn btn-primary"
            onClick={toggleDetails}
            style={buttonStyle}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Conditional rendering of workout details */}
        {showDetails && (
          <div style={tableContainerStyle}>
            {loading ? (
              <p>Loading workouts...</p>
            ) : error ? (
              <p>{error}</p>
            ) : workouts.length === 0 ? (
              <p>No workouts found for today.</p>
            ) : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Date</th>
                    <th style={tableHeaderStyle}>Activity</th>
                    <th style={tableHeaderStyle}>Duration (minutes)</th>
                    <th style={tableHeaderStyle}>Actions</th>
                    <th style={tableHeaderStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout, index) => (
                    <tr key={index}>
                      <td style={tableCellStyle}>{workout.date}</td>
                      <td style={tableCellStyle}>{workout.workouttype}</td>

                      <td style={tableCellStyle}>
                        {editingWorkoutId === workout.id ? (
                          <input
                            type="number"
                            value={newDuration}
                            onChange={(e) => setNewDuration(e.target.value)}
                            required
                          />
                        ) : (
                          workout.duration
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        {editingWorkoutId === workout.id ? (
                          <button
                            style={buttonStyle}
                            onClick={() => handleSaveDuration(workout.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            style={buttonStyle}
                            onClick={() =>
                              handleEdit(workout.id, workout.duration)
                            }
                          >
                            Edit
                          </button>
                        )}
                        <button
                          style={buttonStyle}
                          onClick={() => handleDelete(workout.id)}
                        >
                          Delete
                        </button>
                      </td>

                      <td style={tableCellStyle}>
                        {workout.status ? (
                          "✔️ Accomplished"
                        ) : (
                          <>
                            {""}
                            <button
                              style={buttonStyle}
                              onClick={() =>
                                handleStatusUpdate(workout.id, !workout.status)
                              }
                            >
                              Mark as completed
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {message && <p style={{ color: "white" }}>{message}</p>}
              </table>
            )}
          </div>
        )}

        <div style={headingContainerStyle}>
          <h1 style={headingStyle}>Crush Limits</h1>
          <p style={subheadingStyle}>Click here to add a new workout (+) </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/workout")}
            style={buttonStyle}
          >
            Click Here
          </button>
        </div>

        <div style={headingContainerStyle}>
          <h2 style={headingStyle}>Your Progress</h2>
          <p style={subheadingStyle}>
            Total Calories Burned: {totalCaloriesTrue}
          </p>
          <p style={subheadingStyle}>
            {" "}
            Total Calories Planned: {totalCalories}
          </p>
          <div style={progressBarStyle}>
            <div style={progressFillStyle(progressPercentage)}></div>
          </div>
          <p>{progressPercentage}% of your goal achieved</p>
        </div>

        <div style={headingContainerStyle}>
          <h2 style={headingStyle}>Your Weekly Progress</h2>
          <p style={subheadingStyle}>Total Calories Burned Weekly : {}</p>
          <p style={subheadingStyle}>
            {" "}
            Total Calories Planned for the Week: {}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
