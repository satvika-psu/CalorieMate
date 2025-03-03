// routes/generateMealPlan.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// API Key for api-ninjas.com
require("dotenv").config();
require("dotenv").config({ path: "../.env" });
const API_KEY = process.env.API_NINJAS_KEY;
const API_URL = "https://api.api-ninjas.com/v1/recipe";

router.get("/", async (req, res) => {
  console.log(
    "Error fetching recipes for ${calories}, :${mealsCount}, ${mealTypes}"
  );
});

// Route for generating a meal plan
router.post("/", async (req, res) => {
  const { calories, mealsCount, mealTypes } = req.body;
  console.log(
    "Error fetching recipes for ${calories}, :${mealsCount}, ${mealTypes}"
  );

  if (!calories || !mealsCount || !mealTypes || !Array.isArray(mealTypes)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const caloriesPerMeal = Math.floor(calories / mealsCount);
  const mealPlan = {};

  for (const mealType of mealTypes) {
    try {
      const response = await axios.get(API_URL, {
        params: { query: mealType },
        headers: { "X-Api-Key": API_KEY },
      });

      const recipes = response.data;
      mealPlan[mealType] = recipes.slice(0, 3).map((recipe) => ({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        estimatedCalories: caloriesPerMeal,
      }));
    } catch (error) {
      console.error(`Error fetching recipes for ${mealType}:`, error);
      mealPlan[mealType] = [];
    }
  }

  res.json(mealPlan);
});

module.exports = router;
