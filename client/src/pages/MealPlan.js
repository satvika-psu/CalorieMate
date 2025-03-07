import React, { useState } from "react";
import axios from "axios";

const MealPlan = () => {
  const [calories, setCalories] = useState("");
  const [mealsCount, setMealsCount] = useState(3);
  const [mealPlan, setMealPlan] = useState({});
  const [selectedMeals, setSelectedMeals] = useState({});
  const [showSelectedRecipes, setShowSelectedRecipes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [currentRecipe, setCurrentRecipe] = useState(null); // State to store the current recipe details

  const mealTypes = ["Breakfast", "Lunch", "Main Dish", "Snack", "Dessert"];

  // Fetch meal plan from the backend
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

      console.log("Backend Response:", response.data);
      setMealPlan(response.data);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  const handleSelectMeal = (mealType, recipeTitle) => {
    setSelectedMeals({ ...selectedMeals, [mealType]: recipeTitle });
  };

  const fetchRecipeDetails = async (recipeTitle) => {
    let selectedRecipe = null;

    // Search for the selected recipe in the mealPlan
    Object.values(mealPlan).forEach((meals) => {
      const foundRecipe = meals.find((meal) => meal.title === recipeTitle);
      if (foundRecipe) {
        selectedRecipe = foundRecipe;
      }
    });

    if (selectedRecipe) {
      const { description, ingredients, calories, carbohydrate, fat, protein } =
        selectedRecipe;

      console.log("Selected Recipe Details:", selectedRecipe);

      const formattedIngredients = ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ));

      const formattedNutrition = [
        { name: "Calories", value: calories },
        { name: "Carbohydrate", value: carbohydrate },
        { name: "Fat", value: fat },
        { name: "Protein", value: protein },
      ].map((nutrient, index) => (
        <li key={index}>{`${nutrient.name}: ${nutrient.value}`}</li>
      ));

      setCurrentRecipe({
        title: recipeTitle,
        description,
        ingredients: formattedIngredients,
        nutrition: formattedNutrition,
      });

      setIsModalOpen(true);
    } else {
      console.error("Recipe not found in mealPlan");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecipe(null);
  };

  const handleSaveMealPlan = () => {
    alert("Meal plan saved successfully!");
    console.log("Selected Meals:", selectedMeals);
  };

  const handleAddRecipe = () => {
    setShowSelectedRecipes(true);
  };

  return (
    <div className="meal-plan-container">
      <h2 className="meal-plan-title">
        <strong>Plan Your Meals</strong>
      </h2>

      <div className="meal-plan-content">
        <div className="meal-plan-left">
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

          {/* Displaying Meal Plan with Selection Option */}
          {mealTypes.slice(0, mealsCount).map(
            (mealType) =>
              mealPlan[mealType] && (
                <div key={mealType} className="meal-container">
                  <h3 className="meal-title">{mealType}</h3>
                  {mealPlan[mealType].map((meal, index) => (
                    <div key={index} className="meal-option">
                      <input
                        type="checkbox"
                        name={mealType}
                        value={meal.title}
                        checked={selectedMeals[mealType] === meal.title}
                        onChange={() => handleSelectMeal(mealType, meal.title)}
                      />
                      <span className="meal-name">{meal.title}</span>
                      <span className="meal-info">({meal.calories} cal)</span>
                    </div>
                  ))}
                </div>
              )
          )}

          {Object.keys(selectedMeals).length === mealsCount &&
            !showSelectedRecipes && (
              <button onClick={handleAddRecipe} className="add-recipe-btn">
                Add Recipe
              </button>
            )}
        </div>

        {/* Right Side: Selected Recipes */}
        {showSelectedRecipes && (
          <div className="meal-plan-right">
            <h3>Selected Recipes</h3>
            {Object.keys(selectedMeals).map((mealType) => {
              const recipeTitle = selectedMeals[mealType];

              return (
                <div key={mealType} className="selected-meal">
                  <h4>{mealType}</h4>
                  <p>{recipeTitle}</p>
                  <button
                    onClick={() => fetchRecipeDetails(recipeTitle)}
                    className="get-details-btn"
                  >
                    Get Details
                  </button>
                </div>
              );
            })}
            <button onClick={handleSaveMealPlan} className="save-button">
              Save
            </button>
          </div>
        )}
      </div>

      {/* Modal for Recipe Details */}
      {isModalOpen && currentRecipe && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentRecipe.title}</h3>
            <p>{currentRecipe.description}</p>
            <h4>Ingredients:</h4>
            <ul>{currentRecipe.ingredients}</ul>
            <h4>Nutrition:</h4>
            <ul>{currentRecipe.nutrition}</ul>
            <button onClick={closeModal} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
