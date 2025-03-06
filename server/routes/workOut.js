const express = require("express");
const router = express.Router();
const axios = require("axios");
const supabase = require("../supabaseClient");

// Load environment variables
require("dotenv").config();
require("dotenv").config({ path: "../.env" });

// API Key for api-ninjas.com
const API_KEY = process.env.API_NINJAS_KEY;
const API_URL = "https://api.api-ninjas.com/v1/caloriesburned";

// Route for generating a workout plan
router.post("/", async (req, res) => {
  const { calories, workoutTypes } = req.body;

  // Validate the input
  if (!calories || !workoutTypes || !Array.isArray(workoutTypes)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  if (workoutTypes.length > 3) {
    return res
      .status(400)
      .json({ error: "Please select up to 3 activities only." });
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
        // Get the first matched exercise
        const exercise = exercises[0];
        const caloriesPerMinute = exercise.calories_per_hour / 60;
        // Calculate duration
        const duration = (caloriesPerWorkout / caloriesPerMinute).toFixed(2);

        workoutPlan[workoutType] = {
          name: exercise.name,
          duration: duration,
          caloriesBurned: exercise.calories_per_hour,
          // Set total calories to equally divided value
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
  const { workouttype, duration, caloriesburned, email } = req.body;
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

module.exports = router;
