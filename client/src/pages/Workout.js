import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutPlanDisplay from "../components/WorkoutPlanDisplay";

const Workout = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const { userEmail } = useContext(UserContext);

  // Inline styles
  const containerStyle = {
    minHeight: "100vh",
    background:
      "linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(22,93,112,1) 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  return (
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
  );
};

export default Workout;
