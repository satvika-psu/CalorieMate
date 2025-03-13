import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutPlanDisplay from "../components/WorkoutPlanDisplay";

const Workout = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const { userEmail } = useContext(UserContext);

  const homecontainerStyle = {
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(to right top, #fdcfbf, #ebcbb0, #d7c7a7, #c2c3a2, #adbea1, #a3bda2, #99bca5, #8fbba8, #8bbfac, #86c2b1, #81c6b6, #7bc9bc)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  // Inline styles
  const containerStyle = {
    minHeight: "100vh",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  return (
    <div style={homecontainerStyle}>
      <div className="container" style={containerStyle}>
        <h2 className="my-4" style={{ color: "white" }}>
          Customize Your Workout{" "}
        </h2>
        <div style={{ width: "100%", maxWidth: "1400px", padding: "20px" }}>
          <WorkoutForm setWorkoutPlan={setWorkoutPlan} userEmail={userEmail} />
          {workoutPlan && (
            <WorkoutPlanDisplay
              workoutPlan={workoutPlan}
              setWorkoutPlan={setWorkoutPlan}
              userEmail={userEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Workout;
