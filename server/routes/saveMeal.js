const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/", async (req, res) => {
  console.log("SAVE MEAL PLAN CALLED", req.body);

  try {
    const { selectedMeals, mealPlan, userEmail } = req.body;

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
          recipe_types: mealType,
          recipe_name: recipeTitle,
          date: today, // Current date
          calorie: selectedMeal ? selectedMeal.calories : 0,
          serving_size: 1,
          email: userEmail,
          calories_per_serving: selectedMeal ? selectedMeal.calories : 0,
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

router.get("/today", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const { data, error } = await supabase
      .from("Meals")
      .select("*")
      .eq("date", today);

    //console.log("SERVER BACKEND response data", data);
    if (error) {
      throw error;
    }
    if (data.length === 0) {
      return res.status(200).json({ message: "No meals found for today" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching meals:", error.message);
    res.status(500).json({ error: "Failed to fetch today's meals" });
  }
});

router.put("/update/:id", async (req, res) => {
  const mealId = req.params.id;
  const { newServing, newCalorie } = req.body;
  console.error("Serving SIZE", newServing);

  try {
    if (!newServing || isNaN(newServing) || newServing <= 0) {
      console.error("Invalid serving size value", newServing);
      return res.status(400).json({ message: "Invalid serving size value" });
    }
    const { data, error } = await supabase
      .from("Meals")
      .update({ serving_size: newServing, calorie: newCalorie })
      .eq("id", mealId);
    if (error) {
      throw error;
    }
    res.status(200).json({ message: "Meal updated successfully", data });
  } catch (error) {
    console.error("Error updating meal:", error.message);
    res.status(500).json({ message: "Failed to update meal" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from("Meals").delete().eq("id", id);

    if (error) {
      throw error;
    }
    res.status(200).json({ message: "Meal deleted successfully", data });
  } catch (error) {
    console.error("Error deleting meal:", error.message, id);
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

module.exports = router;
