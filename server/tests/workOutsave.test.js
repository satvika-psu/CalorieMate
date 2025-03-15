const request = require("supertest");
const express = require("express");
const router = require("../routes/workOut");
jest.mock("axios"); // Mock axios

const app = express();
app.use(express.json());
app.use(router);

describe("POST /workout (Save Workout)", () => {
  it("should save a workout to the database", async () => {
    // Mocking Supabase response
    const supabaseInsertMock = jest
      .spyOn(require("../supabaseClient"), "from")
      .mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
      });

    const response = await request(app).post("/workout").send({
      workouttype: "Running",
      duration: 30,
      caloriesburned: 300,
      email: "user@example.com",
      totalcalories: 300,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Workout added successfully",
      data: { id: 1 },
    });

    supabaseInsertMock.mockRestore(); // Clean up the mock
  });
});
