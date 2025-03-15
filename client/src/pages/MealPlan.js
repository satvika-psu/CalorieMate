import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";

const MealPlan = () => {
  const [calories, setCalories] = useState("");
  const [mealsCount, setMealsCount] = useState(3);
  const [mealPlan, setMealPlan] = useState({});
  const [selectedMeals, setSelectedMeals] = useState({});
  const [showSelectedRecipes, setShowSelectedRecipes] = useState(false);
  const [expandedMeals, setExpandedMeals] = useState({});
  const { userEmail } = useContext(UserContext);

  const mealTypes = ["Breakfast", "Lunch", "Main Dish", "Snack", "Dessert"];

  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://caloriemate-server.vercel.app"
      : "http://localhost:5000";

  // Fetch meal plan from the backend
  const handleGenerateMealPlan = async () => {
    if (!calories || calories <= 0) {
      alert("Please enter a valid calorie amount!");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/mealplan`, {
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

  const fetchRecipeDetails = async (mealType, recipeTitle) => {
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

      // Update the expanded state for the specific meal
      setExpandedMeals((prev) => ({
        ...prev,
        [mealType]: {
          title: recipeTitle,
          description,
          ingredients: formattedIngredients,
          nutrition: formattedNutrition,
        },
      }));
    } else {
      console.error("Recipe not found in mealPlan");
    }
  };

  const handleSaveMealPlan = async () => {
    alert("Meal plan saved successfully!");
    console.log("Selected Meals:", selectedMeals);
    if (Object.keys(selectedMeals).length !== mealsCount) {
      alert("Please select meals for all meal types before saving.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/savemealplan`, {
        selectedMeals,
        mealPlan,
        userEmail,
      });

      if (response.status === 200) {
        //alert("Meal plan saved successfully!");
        console.log("Saved Meal Plan:", response.data);
      } else {
        alert("Failed to save meal plan. Please try again.");
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("An error occurred while saving the meal plan.");
    }
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
              <label htmlFor="calories-input" className="input-label">
                I want to eat
              </label>
              <input
                type="number"
                id="calories-input"
                placeholder="Enter calories"
                className="input-field"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                style={{ width: "350px", margin: "5px" }}
              />
              <label
                htmlFor="meals-dropdown"
                className="meal-input-label"
                style={{
                  fontSize: "16px",
                  marginRight: "0px",
                  width: "150px",
                }}
              >
                in number of Meals
              </label>
              <select
                id="meals-dropdown"
                className="dropdown"
                value={mealsCount}
                onChange={(e) => setMealsCount(Number(e.target.value))}
                style={{ width: "50px", margin: "5px" }}
              >
                {[2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button onClick={handleGenerateMealPlan} className="generate-btn">
                <h4>Generate</h4>
              </button>
            </div>
          </div>

          {/* Displaying Meal Plan with Selection Option */}
          {mealTypes.slice(0, mealsCount).map(
            (mealType) =>
              mealPlan[mealType] && (
                <div key={mealType} className="meal-container">
                  <h3 className="meal-title">{mealType}</h3>
                  <fieldset>
                    <legend style={{ fontSize: "1rem", color: "black" }}>
                      {mealType} Options
                    </legend>{" "}
                    {/* Add a descriptive legend */}
                    {mealPlan[mealType].map((meal, index) => (
                      <div key={index} className="meal-option">
                        <label>
                          <input
                            type="checkbox"
                            name={mealType}
                            value={meal.title}
                            checked={selectedMeals[mealType] === meal.title}
                            onChange={() =>
                              handleSelectMeal(mealType, meal.title)
                            }
                          />
                          <span className="meal-name">{meal.title}</span>
                          <span className="meal-info">
                            ({meal.calories} cal)
                          </span>
                        </label>
                      </div>
                    ))}
                  </fieldset>
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
      </div>

      {/* Selected Recipes Container */}
      {showSelectedRecipes && (
        <div className="selected-recipes-container">
          <h3>Selected Recipes</h3>
          <div className={`selected-meals-grid meals-count-${mealsCount}`}>
            {Object.keys(selectedMeals).map((mealType) => {
              const recipeTitle = selectedMeals[mealType];

              return (
                <div key={mealType} className="selected-meal-card">
                  <h4>{mealType}</h4>
                  <p>{recipeTitle}</p>
                  <button
                    onClick={() => fetchRecipeDetails(mealType, recipeTitle)}
                    className="get-details-btn"
                  >
                    Get Details
                  </button>

                  {/* Show recipe details if expanded */}
                  {expandedMeals[mealType] && (
                    <div className="recipe-details">
                      <h4>Description:</h4>
                      <p>{expandedMeals[mealType].description}</p>
                      <h4>Ingredients:</h4>
                      <ul>{expandedMeals[mealType].ingredients}</ul>
                      <h4>Nutrition:</h4>
                      <ul>{expandedMeals[mealType].nutrition}</ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="button-container">
            <button onClick={handleSaveMealPlan} className="save-button">
              SAVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
