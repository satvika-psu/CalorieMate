const express = require("express");
const axios = require("axios");
require("dotenv").config();
require("dotenv").config({ path: "../.env" });

const router = express.Router();
const CALORIE_NINJA_API_URL = "https://api.calorieninjas.com/v1/nutrition";
const MEALDB_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php";

// Route to fetch nutrition data
router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Food query is required" });
  }

  try {
    // Fetch nutrition data from Calorie Ninja API
    const nutritionResponse = await axios.get(CALORIE_NINJA_API_URL, {
      headers: {
        "X-Api-Key": process.env.CALORIE_NINJA_API_KEY,
      },
      params: { query: query },
    });

    console.log("Calorie Ninja API Response:", nutritionResponse.data);

    const nutritionData = nutritionResponse.data.items;

    if (!nutritionData || nutritionData.length === 0) {
      return res
        .status(404)
        .json({ error: "No nutrition data found for the provided query." });
    }

    // Format response
    const responseData = nutritionData.map((item) => ({
      name: item.name,
      calories: item.calories,
      carbohydrates: item.carbohydrates_total_g,
      protein: item.protein_g,
      fat: item.fat_total_g,
      fat_saturated: item.fat_saturated_g,
      fiber: item.fiber_g,
      sugar: item.sugar_g,
      sodium: item.sodium_mg,
      potassium: item.potassium_mg,
      cholesterol: item.cholesterol_mg,
      serving_size: item.serving_size_g,
    }));

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching data from Calorie Ninja API:", error.message);
    res.status(500).json({ error: "Failed to fetch nutrition data." });
  }
});

// Route to fetch meal image from MealDB API
router.get("/mealimage", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await axios.get(MEALDB_API_URL, {
      params: { s: query },
    });

    console.log("MealDB API Response:", response.data);

    if (!response.data.meals || response.data.meals.length === 0) {
      return res.status(404).json({ error: "No meals found" });
    }

    console.log("Meal Image URL:", response.data.meals[0].strMealThumb);

    res.json({ imageUrl: response.data.meals[0].strMealThumb });
  } catch (error) {
    console.error("Error fetching data from MealDB API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch meal image", details: error.message });
  }
});

module.exports = router;
