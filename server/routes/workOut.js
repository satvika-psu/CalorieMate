const express = require("express");
const router = express.Router();
const axios = require("axios");
const supabase = require("../supabaseClient");

require("dotenv").config();
require("dotenv").config({ path: "../.env" });

// API Key for api-ninjas.com
const API_KEY = process.env.API_NINJAS_KEY;
const API_URL = "https://api.api-ninjas.com/v1/caloriesburned";

// Route for generating workout plan
router.post("/", async (req, res) => {
  const { calories, workoutTypes } = req.body;
  if (!calories || !workoutTypes || !Array.isArray(workoutTypes)) {
    return res.status(400).json({ error: "Invalid input data" });
  }
  if (workoutTypes.length > 6) {
    return res
      .status(400)
      .json({ error: "Please select up to 6 activities only." });
  }
  const workoutPlan = {};

  // Divide the total calories equally among the selected activities
  const caloriesPerWorkout = (calories / workoutTypes.length).toFixed(2);
  for (const workoutType of workoutTypes) {
    try {
      console.log(`Fetching workout for activity: ${workoutType}`);

      const response = await axios.get(API_URL, {
        params: { activity: workoutType },
        headers: { "X-Api-Key": API_KEY },
      });
      const exercises = response.data;
      if (exercises.length > 0) {
        const exercise = exercises[0];
        const caloriesPerMinute = exercise.calories_per_hour / 60;
        const duration = (caloriesPerWorkout / caloriesPerMinute).toFixed(2);

        workoutPlan[workoutType] = {
          name: exercise.name,
          duration: duration,
          caloriesBurned: exercise.calories_per_hour,
          totalCalories: caloriesPerWorkout,
        };
      } else {
        workoutPlan[workoutType] = [];
      }
    } catch (error) {
      console.error(
        `Error fetching workout for ${workoutType}:`,
        error.message
      );
      workoutPlan[workoutType] = [];
    }
  }
  res.status(200).json(workoutPlan);
});

// Route for saving the generated workout plan to Supabase
router.post("/workout", async (req, res) => {
  const { workouttype, duration, caloriesburned, email, totalcalories } =
    req.body;
  const today = new Date().toISOString().split("T")[0];
  console.log("Today's date:", today);
  try {
    const { data, error } = await supabase.from("workout").insert([
      {
        workouttype: workouttype,
        duration: duration,
        caloriesburned: caloriesburned,
        email: email,
        date: today,
        totalcalories: totalcalories,
      },
    ]);
    if (error) {
      throw error;
    }
    res.status(200).json({ message: "Workout added successfully", data: data });
  } catch (error) {
    console.error("Error inserting Workout:", error.message);
    res.status(500).json({ error: "Failed to create Workout" });
  }
});

// Route to fetch saved workouts for today
router.get("/today", async (req, res) => {
  const { email } = req.query;
  const today = new Date().toISOString().split("T")[0];
  if (!email) {
    return res.status(400).json({ error: "User email is required" });
  }
  try {
    const { data, error } = await supabase
      .from("workout")
      .select("*")
      .eq("email", email)
      .eq("date", today);

    if (error) {
      throw error;
    }
    if (data.length === 0) {
      return res.status(200).json({ message: "No workouts found for today" });
    }
    console.log("Fetched workouts for today:", JSON.stringify(data, null, 2));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching workouts:", error.message);
    res.status(500).json({ error: "Failed to fetch today's workouts" });
  }
});

// Route to delete a workout
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("workout")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    res.status(200).json({ message: "Workout deleted successfully", data });
  } catch (error) {
    console.error("Error deleting workout:", error.message);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

// Route to update workout duration
router.put("/update/:id", async (req, res) => {
  const workoutId = req.params.id;
  const { duration } = req.body;

  try {
    if (!duration || isNaN(duration) || duration <= 0) {
      return res.status(400).json({ message: "Invalid duration value" });
    }
    const { data, error } = await supabase
      .from("workout")
      .update({ duration })
      .eq("id", workoutId);
    if (error) {
      throw error;
    }
    res.status(200).json({ message: "Workout updated successfully", data });
  } catch (error) {
    console.error("Error updating workout:", error.message);
    res.status(500).json({ message: "Failed to update workout" });
  }
});

// Rouet to  update the workout status
router.put("/status/:id", async (req, res) => {
  const workoutId = req.params.id;
  const { status } = req.body;

  if (typeof status !== "boolean") {
    return res.status(400).json({ error: "Status must be a boolean value" });
  }
  if (!workoutId) {
    return res.status(400).json({ error: "Workout ID is required" });
  }
  try {
    const { data, error } = await supabase
      .from("workout")
      .update({ status })
      .eq("id", workoutId);
    if (error) {
      console.error("Error updating status:", error.message);
      return res.status(500).json({ error: "Failed to update workout status" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Workout not found" });
    }
    res.status(200).json({ message: "Workout status updated successfully" });
  } catch (error) {
    console.error("Error in the server:", error.message);
    res.status(500).json({ error: "Failed to update workout status" });
  }
});

module.exports = router;
