const request = require("supertest");
const express = require("express");
const router = require("../routes/workOut");
const axios = require("axios");
jest.mock("axios");

const app = express();
app.use(express.json());
app.use(router);

describe("POST / (Generate Workout Plan)", () => {
  it("should generate a workout plan based on calories and workout types", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          name: "Running",
          calories_per_hour: 600,
        },
      ],
    });

    const response = await request(app)
      .post("/")
      .send({
        calories: 300,
        workoutTypes: ["Running"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      Running: {
        name: "Running",
        duration: "30.00",
        caloriesBurned: 600,
        totalCalories: "300.00",
      },
    });
  });

  it("should return a 400 error if workoutTypes array is invalid or not provided", async () => {
    const response = await request(app).post("/").send({
      calories: 300,
      workoutTypes: "Running",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid input data" });
  });

  it("should return a 400 error if more than 6 activities are selected", async () => {
    const response = await request(app)
      .post("/")
      .send({
        calories: 1000,
        workoutTypes: [
          "Running",
          "Swimming",
          "Cycling",
          "Yoga",
          "Walking",
          "HIIT",
          "Rowing",
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Please select up to 6 activities only.",
    });
  });
});
