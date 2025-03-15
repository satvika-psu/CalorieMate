const request = require("supertest");
const express = require("express");
const router = require("../routes/browsefood");
const axios = require("axios");
jest.mock("axios");

const app = express();
app.use(router);

describe("GET / (Fetch Nutrition Data)", () => {
  it("should return nutrition data for a valid food query", async () => {
    // Mocking the Calorie Ninja API response
    axios.get.mockResolvedValue({
      data: {
        items: [
          {
            name: "Pizza",
            calories: 285,
            carbohydrates_total_g: 36,
            protein_g: 12,
            fat_total_g: 10,
            fat_saturated_g: 4,
            fiber_g: 2,
            sugar_g: 5,
            sodium_mg: 640,
            potassium_mg: 180,
            cholesterol_mg: 25,
            serving_size_g: 100,
          },
        ],
      },
    });

    const response = await request(app).get("/?query=Pizza");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        name: "Pizza",
        calories: 285,
        carbohydrates: 36,
        protein: 12,
        fat: 10,
        fat_saturated: 4,
        fiber: 2,
        sugar: 5,
        sodium: 640,
        potassium: 180,
        cholesterol: 25,
        serving_size: 100,
      },
    ]);
  });

  it("should return a 400 error if no query is provided", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Food query is required" });
  });
});

describe("GET /mealimage (Fetch Meal Image)", () => {
  it("should return a meal image URL for a valid query", async () => {
    // Mock the MealDB API response
    axios.get.mockResolvedValue({
      data: {
        meals: [
          {
            strMealThumb:
              "https://www.themealdb.com/images/media/meals/xyz.jpg",
          },
        ],
      },
    });

    const response = await request(app).get("/mealimage?query=Pizza");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      imageUrl: "https://www.themealdb.com/images/media/meals/xyz.jpg",
    });
  });

  it("should return a 404 error if no meals are found", async () => {
    // Mock the MealDB API response with no meals
    axios.get.mockResolvedValue({
      data: {
        meals: null,
      },
    });

    const response = await request(app).get("/mealimage?query=InvalidFood");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "No meals found" });
  });
});
