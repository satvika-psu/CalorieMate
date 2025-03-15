import axios from "axios";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://caloriemate-server.vercel.app"
    : "http://localhost:5000";

const API_BASE_URL = `${backendUrl}/api/workout`;

// Create or Save a new workout
export const saveWorkout = async (workoutData) => {
  try {
    const { workoutType, duration, caloriesBurned, email, totalCalories, id } =
      workoutData;
    await axios.post(`${API_BASE_URL}/workout`, {
      id: id,
      workouttype: workoutType,
      duration: duration,
      caloriesburned: caloriesBurned,
      email: email,
      totalcalories: totalCalories,
    });
  } catch (error) {
    throw new Error("Error saving workout");
  }
};

// Fetch workouts for the current user
export const fetchWorkouts = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/today`, {
      params: { email },
    });
    return response.data.message ? [] : response.data;
  } catch (error) {
    throw new Error("Failed to fetch workouts");
  }
};

// Delete a workout by ID
export const deleteWorkout = async (workoutId) => {
  try {
    await axios.delete(`${API_BASE_URL}/delete/${workoutId}`);
  } catch (error) {
    throw new Error("Error deleting workout");
  }
};

// Update workout duration
export const updateWorkoutDuration = async (workoutId, newDuration) => {
  try {
    await axios.put(`${API_BASE_URL}/update/${workoutId}`, {
      duration: newDuration,
    });
  } catch (error) {
    throw new Error("Error updating workout");
  }
};

// Update a workout status to 'completed' (true)
export const updateWorkoutStatus = async (workoutId, status) => {
  try {
    await axios.put(`${API_BASE_URL}/status/${workoutId}`, {
      workoutId: workoutId,
      status: status,
    });
  } catch (error) {
    throw new Error("Error updating workout status");
  }
};
