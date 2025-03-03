import React, { useState } from "react";
import axios from "axios";

require("dotenv").config();
require("dotenv").config({ path: "../.env" });
const API_KEY = process.env.API_NINJAS_KEY;

const MealPlan = () => {
  const [calories, setCalories] = useState(""); // Store user-input calories
  const [mealsCount, setMealsCount] = useState(3); // Store number of meals
  const [mealPlan, setMealPlan] = useState({}); // Store generated meals
  const [selectedMeals, setSelectedMeals] = useState({}); // Store user selections
  const [showSelectedRecipes, setShowSelectedRecipes] = useState(false); // Control visibility of right side
  const [recipeDetails, setRecipeDetails] = useState(null); // Store full recipe details
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

  // Function to Fetch Meal Plan from Backend Server
  const handleGenerateMealPlan = async () => {
    if (!calories || calories <= 0) {
      alert("Please enter a valid calorie amount!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/mealplan", {
        calories: calories,
        mealsCount: mealsCount,
        mealTypes: mealTypes.slice(0, mealsCount),
      });

      // Log the full response from the API
      console.log("Response from backend:", response.data);

      // Set the meal plan state with the response data
      setMealPlan(response.data);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  // Handle Meal Selection
  const handleSelectMeal = (mealType, recipeTitle) => {
    setSelectedMeals({ ...selectedMeals, [mealType]: recipeTitle });
  };

  // Handle Save Meal Plan
  const handleSaveMealPlan = () => {
    alert("Meal plan saved successfully!");
    console.log("Selected Meals:", selectedMeals);
    // Add logic to save the selected meals (e.g., send to backend or local storage)
  };

  // Handle Add Recipe Button Click
  const handleAddRecipe = () => {
    setShowSelectedRecipes(true);
  };

  // Handle Get Recipe Button Click
  const handleGetRecipe = async (recipeTitle) => {
    try {
      const response = await axios.get("https://api.api-ninjas.com/v1/recipe", {
        params: { query: recipeTitle },
        headers: { "X-Api-Key": API_KEY },
      });

      if (response.data.length > 0) {
        setRecipeDetails(response.data[0]);
        setIsModalOpen(true);
      } else {
        alert("No recipe found for the selected title.");
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  // Handle Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setRecipeDetails(null); // Clear recipe details
  };

  return (
    <div className="meal-plan-container">
      <h2 className="meal-plan-title">
        <strong>Plan Your Meals</strong>
      </h2>

      <div className="meal-plan-content">
        {/* Left Side: Input and Meal Options */}
        <div className="meal-plan-left">
          {/* Input Section */}
          <div className="input-container">
            <div className="search-box">
              <span className="label">I want to eat</span>
              <input
                type="number"
                placeholder="Enter cal"
                className="input-field"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
              />
              <span className="label">in</span>
              <select
                className="dropdown"
                value={mealsCount}
                onChange={(e) => setMealsCount(Number(e.target.value))}
              >
                {[2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Meals
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleGenerateMealPlan} className="generate-btn">
              Generate
            </button>
          </div>

          {/* Display Meal Plan with Selection Option */}
          {mealTypes.slice(0, mealsCount).map(
            (mealType) =>
              mealPlan[mealType] && ( // Check if mealType exists in mealPlan
                <div key={mealType} className="meal-container">
                  <h3 className="meal-title">
                    {mealType} - {Math.floor(calories / mealsCount)} cal
                  </h3>
                  {mealPlan[mealType].map((meal, index) => (
                    <div key={index} className="meal-option">
                      <input
                        type="radio"
                        name={mealType}
                        value={meal.title}
                        checked={selectedMeals[mealType] === meal.title}
                        onChange={() => handleSelectMeal(mealType, meal.title)}
                      />
                      <span className="meal-name">{meal.title}</span>
                      <span className="meal-info">
                        ({meal.estimatedCalories} cal)
                      </span>
                    </div>
                  ))}
                </div>
              )
          )}

          {/* Add Recipe Button (Conditional Rendering) */}
          {Object.keys(selectedMeals).length === mealsCount &&
            !showSelectedRecipes && (
              <button onClick={handleAddRecipe} className="add-recipe-btn">
                Add Recipe
              </button>
            )}
        </div>

        {/* Right Side: Selected Recipes (Conditional Rendering) */}
        {showSelectedRecipes && (
          <div className="meal-plan-right">
            <h3>Selected Recipes</h3>
            {Object.keys(selectedMeals).map((mealType) => (
              <div key={mealType} className="selected-meal">
                <h4>{mealType}</h4>
                <p>{selectedMeals[mealType]}</p>
                <button
                  onClick={() => handleGetRecipe(selectedMeals[mealType])}
                  className="get-recipe-btn"
                >
                  Get Recipe
                </button>
              </div>
            ))}
            <button onClick={handleSaveMealPlan} className="save-button">
              Save
            </button>
          </div>
        )}
      </div>

      {/* Recipe Details Modal */}
      {isModalOpen && recipeDetails && (
        <div className="recipe-modal-overlay">
          <div className="recipe-modal">
            <div className="recipe-modal-content">
              <h3>{recipeDetails.title}</h3>
              <h4>
                <strong>Ingredients:</strong>
              </h4>
              <p>{recipeDetails.ingredients}</p>
              <h4>
                <strong>Directions:</strong>
              </h4>
              <p>{recipeDetails.instructions}</p>
              <button onClick={handleCloseModal} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
