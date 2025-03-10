const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/", async (req, res) => {
  console.log("SAVE MEAL PLAN CALLED", req.body);

  try {
    const { selectedMeals, mealPlan } = req.body;

    if (!selectedMeals || typeof selectedMeals !== "object" || !mealPlan) {
      return res.status(400).json({ message: "Invalid meal data format" });
    }

    const today = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

    // Convert selectedMeals into an array of meal objects for insertion
    const mealData = Object.entries(selectedMeals).map(
      ([mealType, recipeTitle]) => {
        const selectedMeal = mealPlan[mealType].find(
          (meal) => meal.title === recipeTitle
        );

        return {
          recipe_types: mealType, // Column name matches the database
          recipe_name: recipeTitle, // Column name matches the database
          date: today, // Current date
          calorie: selectedMeal ? selectedMeal.calories : 0, // Calories of the selected recipe (default to 0 if not found)
        };
      }
    );

    console.log("Meal Data for Insert:", mealData);

    // Insert multiple meal records into Supabase
    const { data, error } = await supabase.from("Meals").insert(mealData);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ message: "Database insert failed", error });
    }

    res
      .status(200)
      .json({ message: "Meal plan saved successfully!", mealPlan: data });
  } catch (error) {
    console.error("Error saving meal plan:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
