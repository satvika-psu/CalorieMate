import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  fetchWorkouts,
  deleteWorkout,
  updateWorkoutDuration,
  updateWorkoutStatus,
} from "../services/workoutService";
import {
  fetchSelectedMeals,
  handleDeleteMeal,
  handleEditMeal,
} from "../services/mealService";

const Dashboard = () => {
  const { userEmail } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false); // State for Workouts details
  const [showMealDetails, setShowMealDetails] = useState(false); // State for Selected Meals details
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editingMealId, setEditingMealId] = useState(null);
  const [newDuration, setNewDuration] = useState("");
  const [newServing, setServing] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch workouts and selected meals on component mount
  useEffect(() => {
    if (userEmail) {
      // Fetch workouts
      fetchWorkouts(userEmail)
        .then(setWorkouts)
        .catch((err) => setError(err.message));

      // Fetch selected meals
      fetchSelectedMeals(userEmail)
        .then((meals) => {
          // Ensure that meals is an array before setting it
          setSelectedMeals(Array.isArray(meals) ? meals : []);
        })
        .catch((err) => console.error("Error fetching selected meals:", err))
        .finally(() => setLoading(false));
    } else {
      setError("User is not logged in");
      setLoading(false);
    }
  }, [userEmail]);

  // Toggle function for Workouts details
  const toggleWorkoutDetails = () => {
    setShowWorkoutDetails((prev) => !prev);
  };

  // Toggle function for Selected Meals details
  const toggleMealDetails = () => {
    setShowMealDetails((prev) => !prev);
  };

  // Function to delete workout
  const handleDelete = async (workoutId) => {
    try {
      await deleteWorkout(workoutId);
      setWorkouts(await fetchWorkouts(userEmail));
      setMessage("Workout Deleted Sucessfully!!");
      setTimeout(() => {
        setMessage("");
      }, 5000);
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
      setMessage("Workout Updated Sucessfully!!");
      setEditingWorkoutId(null);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Function to update workout status
  const handleStatusUpdate = async (workoutId, status) => {
    try {
      await updateWorkoutStatus(workoutId, status);
      setWorkouts(await fetchWorkouts(userEmail));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEditMealLocal = (mealId, currentDuration) => {
    setEditingMealId(mealId);
    //setNewDuration(currentDuration);
  };

  const handleSaveMealLocal = async (mealId, newServing, calorie) => {
    setEditingMealId(mealId);
    try {
      await handleEditMeal(mealId, newServing, calorie);
      //setWorkouts(await showWorkoutDetails(userEmail));
      setMessage("Meal Updated Sucessfully!!");
      fetchSelectedMeals(userEmail)
        .then((meals) => {
          setSelectedMeals(Array.isArray(meals) ? meals : []);
        })
        .catch((err) => console.error("Error fetching selected meals:", err))
        .finally(() => setLoading(false));
    } catch (err) {
      console.error(err.message);
    }
    setEditingMealId(null);
  };

  const handleDeleteMealLocal = async (mealId) => {
    try {
      await handleDeleteMeal(mealId);
      setMessage("Meal deleted Sucessfully!!");
      fetchSelectedMeals(userEmail)
        .then((meals) => {
          setSelectedMeals(Array.isArray(meals) ? meals : []);
        })
        .catch((err) => console.error("Error deleting selected meal:", err))
        .finally(() => setLoading(false));
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    alignItems: "center",
    height: "200vh",
    padding: "20px",
    width: "100%",
    marginTop: "30px",
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
    background: "white",
    fontFamily: "Poppins",
  };

  const headingStyle = {
    color: "purple",
    marginBottom: "10px",
    fontFamily: "Poppins",
    fontSize: "25px",
  };

  const subheadingStyle = {
    color: "Green",
    marginBottom: "20px",
    fontFamily: "Poppins",
    fontSize: "18px",
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
    backgroundColor: " rgb(8, 97, 99)",
    color: "white",
    textAlign: "left",
    padding: "10px",
  };

  const tableCellStyle = {
    padding: "5px",
    border: "white",
    color: "white",
  };

  const tableCellStyleM = {
    padding: "10px",
    textAlign: "center",
    border: "1px solid #ddd",
    color: "black",
  };
  const tableContainerStyleM = {
    width: "100%",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    marginTop: "10px",
  };
  const buttonStyle = {
    marginTop: "10px",
    background: "#8fbba8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontFamily: "Poppins",
    marginLeft: "5px",
    marginRight: "5px",
    outline: "none",
  };

  const tableButtonStyle = {
    marginTop: "10px",
    background: " rgb(8, 97, 99)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontFamily: "Poppins",
    marginLeft: "5px",
    marginRight: "5px",
    outline: "none",
    padding: "5px",
    width: "70%",
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
            onClick={toggleWorkoutDetails}
            style={buttonStyle}
          >
            {showWorkoutDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Conditional rendering of workout details */}

        {showWorkoutDetails && (
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
                            style={tableButtonStyle}
                            onClick={() => handleSaveDuration(workout.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            style={tableButtonStyle}
                            onClick={() =>
                              handleEdit(workout.id, workout.duration)
                            }
                          >
                            Edit
                          </button>
                        )}
                        <button
                          style={tableButtonStyle}
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
                              style={tableButtonStyle}
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
                {message && (
                  <p
                    style={{
                      color: "white",
                      marginTop: "15px",
                      background: " rgb(8, 97, 99)",
                      padding: "5px",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}
                  >
                    {message}
                  </p>
                )}
              </table>
            )}
          </div>
        )}

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
          <h2 style={headingStyle}>Selected Meals</h2>
          {loading ? (
            <p>Loading selected meals...</p>
          ) : selectedMeals.length === 0 ? (
            <p>No meals selected for today.</p>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={toggleMealDetails}
                style={buttonStyle}
              >
                {showMealDetails ? "Hide Details" : "Show Details"}
              </button>

              {showMealDetails && (
                <div style={tableContainerStyleM}>
                  {loading ? (
                    <p>Loading meal plans...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : selectedMeals.length === 0 ? (
                    <p>No meals selected for today.</p>
                  ) : (
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Date</th>
                          <th style={tableHeaderStyle}>Meal</th>
                          <th style={tableHeaderStyle}>Calories</th>
                          <th style={tableHeaderStyle}>Serving size</th>
                          <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMeals.map((meal, index) => (
                          <tr key={index}>
                            <td style={tableCellStyleM}>{meal.date}</td>
                            <td style={tableCellStyleM}>{meal.recipe_name}</td>
                            <td style={tableCellStyleM}>{meal.calorie}</td>
                            <td style={tableCellStyleM}>
                              {editingMealId === meal.id ? (
                                <input
                                  type="number"
                                  value={newServing}
                                  onChange={(e) => setServing(e.target.value)}
                                  required
                                />
                              ) : (
                                meal.serving_size
                              )}
                            </td>
                            <td style={tableCellStyleM}>
                              {editingMealId === meal.id ? (
                                <button
                                  style={tableButtonStyle}
                                  onClick={() =>
                                    handleSaveMealLocal(
                                      meal.id,
                                      newServing,
                                      meal.calories_per_serving * newServing
                                    )
                                  }
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  style={tableButtonStyle}
                                  onClick={() =>
                                    handleEditMealLocal(
                                      meal.id,
                                      newServing,
                                      meal.calorie * newServing
                                    )
                                  }
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                style={tableButtonStyle}
                                onClick={() => handleDeleteMealLocal(meal.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {message && (
                        <p
                          style={{
                            color: "white",
                            marginTop: "15px",
                            background: " rgb(8, 97, 99)",
                            padding: "5px",
                            borderRadius: "5px",
                            textAlign: "center",
                          }}
                        >
                          {message}
                        </p>
                      )}
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
