const request = require("supertest");
const express = require("express");
const router = require("../routes/mealplan");
const axios = require("axios");
jest.mock("axios"); // Mocking axios for API calls

const app = express();
app.use(express.json());
app.use(router);

//This test checks if the server returns a 400 error when invalid input data is provided.
describe("POST / (Generate Meal Plan)", () => {
  it("should return a 400 error for invalid input data", async () => {
    const invalidInputs = [
      { calories: 2000 }, // Missing mealsCount and mealTypes
      { mealsCount: 3 }, // Missing calories and mealTypes
      { mealTypes: ["Breakfast"] }, // Missing calories and mealsCount
      { calories: 2000, mealsCount: 3 }, // Missing mealTypes
      { calories: 2000, mealTypes: ["Breakfast"] }, // Missing mealsCount
      { mealsCount: 3, mealTypes: ["Breakfast"] }, // Missing calories
      { calories: 2000, mealsCount: 3, mealTypes: "Not an array" }, // Invalid mealTypes
    ];

    for (const input of invalidInputs) {
      const response = await request(app).post("/").send(input);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid input data" });
    }
  });
});

//This test checks if the server successfully generates a meal plan when valid input data is provided.
describe("POST / (Generate Meal Plan)", () => {
  it("should generate a meal plan for valid input data", async () => {
    // Mock the FatSecret API response
    axios.get.mockResolvedValue({
      data: {
        recipes: {
          recipe: [
            {
              recipe_name: "Scrambled Eggs",
              recipe_description: "A classic breakfast dish.",
              recipe_ingredients: {
                ingredient: ["Eggs", "Milk", "Butter"],
              },
              recipe_image: "https://example.com/scrambled-eggs.jpg",
              recipe_nutrition: {
                calories: 200,
                carbohydrate: 2,
                protein: 14,
                fat: 15,
              },
            },
          ],
        },
      },
    });

    const response = await request(app)
      .post("/")
      .send({
        calories: 2000,
        mealsCount: 3,
        mealTypes: ["Breakfast"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      Breakfast: [
        {
          title: "Scrambled Eggs",
          description: "A classic breakfast dish.",
          ingredients: ["Eggs", "Milk", "Butter"],
          image: "https://example.com/scrambled-eggs.jpg",
          calories: 200,
          carbohydrate: 2,
          protein: 14,
          fat: 15,
        },
      ],
    });
  });
});
