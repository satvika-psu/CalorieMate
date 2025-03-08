import React, { useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BrowseFood = () => {
  const [food, setFood] = useState("");
  const [foodData, setFoodData] = useState(null);
  const [mealImageUrl, setMealImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSearchFood = async () => {
    if (!food.trim()) {
      alert("Please enter a food item");
      return;
    }

    try {
      // Fetch nutrition data
      const nutritionResponse = await axios.get(
        "http://localhost:5000/api/browsefood",
        {
          params: { query: food },
        }
      );
      setFoodData(nutritionResponse.data);

      // Fetch meal image
      const mealImageResponse = await axios.get(
        "http://localhost:5000/api/mealimage/mealimage",
        {
          params: { query: food },
        }
      );
      setMealImageUrl(mealImageResponse.data.imageUrl);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching data:", error);
      setFoodData(null);
      setMealImageUrl(null);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const generateBarChartData = () => {
    if (!foodData || foodData.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: [
        "Carbohydrates",
        "Calories",
        "Cholesterol",
        "Saturated Fat",
        "Total Fat",
        "Fiber",
        "Potassium",
        "Protein",
        "Sodium",
        "Sugar",
      ],
      datasets: [
        {
          label: `Nutritional Values of ${food}`,
          data: [
            foodData[0].carbohydrates,
            foodData[0].calories,
            foodData[0].cholesterol,
            foodData[0].fat_saturated,
            foodData[0].fat,
            foodData[0].fiber,
            foodData[0].potassium,
            foodData[0].protein,
            foodData[0].sodium,
            foodData[0].sugar,
          ],
          backgroundColor: [
            "#FF6384", // Carbohydrates
            "#36A2EB", // Calories
            "#FFCE56", // Cholesterol
            "#8A2BE2", // Saturated Fat
            "#00C49F", // Total Fat
            "#FF7F50", // Fiber
            "#FFD700", // Potassium
            "#32CD32", // Protein
            "#FF4500", // Sodium
            "#A569BD", // Sugar
          ],
        },
      ],
    };
  };

  const generatePieChartData = () => {
    if (!foodData || foodData.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: ["Calories", "Fats", "Proteins", "Carbohydrates"],
      datasets: [
        {
          label: "Nutritional Values",
          data: [
            foodData[0].calories,
            foodData[0].fat,
            foodData[0].protein,
            foodData[0].carbohydrates,
          ],
          backgroundColor: [
            "#36A2EB", // Calories
            "#00C49F", // Fats
            "#32CD32", // Proteins
            "#FF6384", // Carbs
          ],
          hoverOffset: 4,
        },
      ],
    };
  };

  return (
    <div className="browse-food-container">
      <div className="search-box">
        <div className="input-food">
          <input
            type="text"
            placeholder="Search for calories in your food.."
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
        </div>
        <button onClick={handleSearchFood}>Find calories</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display the total calories line */}
      {foodData && foodData.length > 0 && (
        <div className="calories-info">
          <h3>
            {food} has a total of {foodData[0].calories} calories
          </h3>
        </div>
      )}

      {foodData && foodData.length > 0 && (
        <div className="main-container">
          <div className="content-container">
            <div className="food-info-container">
              <div className="nutritional-value-box">
                <h3>Nutritional facts of {food}</h3>
                <div className="serving-size">
                  Serving Size per {foodData[0].serving_size}g
                </div>
                <table className="nutrition-table">
                  <tbody>
                    <tr>
                      <td>Carbohydrates:</td>
                      <td>{foodData[0].carbohydrates} g</td>
                    </tr>
                    <tr>
                      <td>Calories:</td>
                      <td>{foodData[0].calories} g</td>
                    </tr>
                    <tr>
                      <td>Cholesterol:</td>
                      <td>{foodData[0].cholesterol} mg</td>
                    </tr>
                    <tr>
                      <td>Saturated Fat:</td>
                      <td>{foodData[0].fat_saturated} g</td>
                    </tr>
                    <tr>
                      <td>Total Fat:</td>
                      <td>{foodData[0].fat} g</td>
                    </tr>
                    <tr>
                      <td>Fiber Content:</td>
                      <td>{foodData[0].fiber} g</td>
                    </tr>
                    <tr>
                      <td>Potassium:</td>
                      <td>{foodData[0].potassium} mg</td>
                    </tr>
                    <tr>
                      <td>Protein:</td>
                      <td>{foodData[0].protein} g</td>
                    </tr>
                    <tr>
                      <td>Sodium:</td>
                      <td>{foodData[0].sodium} mg</td>
                    </tr>
                    <tr>
                      <td>Sugar:</td>
                      <td>{foodData[0].sugar} g</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="chart-and-image-container">
                <div className="pie-chart-container">
                  <Pie
                    data={generatePieChartData()}
                    options={{ responsive: true }}
                  />
                </div>
                {mealImageUrl && (
                  <div className="meal-image-container">
                    <h3>{food} image</h3>
                    <img
                      src={mealImageUrl}
                      alt="Meal"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bar-chart-container">
              <h4>Visual Breakdown for {food}</h4>
              <Bar
                data={generateBarChartData()}
                options={{ responsive: true }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseFood;
