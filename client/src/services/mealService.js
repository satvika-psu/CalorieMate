import axios from "axios";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://caloriemate-server.vercel.app"
    : "http://localhost:5000";

const API_BASE_URL = `${backendUrl}/api/savemealplan`; // Base URL for your API

// Function to save selected meals
export const saveSelectedMeals = async (selectedMeals, mealPlan, userEmail) => {
  try {
    // Send a POST request to the /saveMeal endpoint
    const response = await axios.post(`${API_BASE_URL}/saveMeal`, {
      selectedMeals,
      mealPlan,
      email: userEmail, // Include the user's email in the request
    });

    // Return the response data (optional)
    return response.data;
  } catch (error) {
    console.error("Error saving selected meals:", error);
    throw new Error("Error saving selected meals");
  }
};

// Function to fetch selected meals for the logged-in user
export const fetchSelectedMeals = async (userEmail) => {
  try {
    // Send a GET request to the /selectedMeals endpoint
    console.error("CALLED FECTH SELCTED MEALS");
    const response = await axios.get(`${API_BASE_URL}/today`, {
      params: { email: userEmail },
    });

    // Return the fetched data
    //console.error("CALLED FECTH SELCTED MEALS RESPONSE: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching selected meals:", error);
    throw new Error("Error fetching selected meals");
  }
};

export const handleEditMeal = async (mealId, newServing, newCalorie) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${mealId}`, {
      newServing: newServing,
      newCalorie: newCalorie,
    });

    if (response.status !== 200) {
      console.log("Error updating the meal, response: ", response.data);
    }
  } catch (error) {
    console.error(
      "Error updating meal serving:",
      error.response?.data || error.message
    );
    throw new Error("Error updating meal serving", error.message);
  }
};

export const handleDeleteMeal = async (mealId) => {
  try {
    await axios.delete(`${API_BASE_URL}/delete/${mealId}`);
  } catch (error) {
    throw new Error("Error deleting meal");
  }
};
