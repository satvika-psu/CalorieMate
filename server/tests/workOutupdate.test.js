const request = require("supertest");
const express = require("express");
const router = require("../routes/workOut");
jest.mock("axios");

const app = express();
app.use(express.json());
app.use(router);

describe("DELETE /delete/:id (Delete Workout)", () => {
  it("should delete a workout by ID", async () => {
    const supabaseDeleteMock = jest
      .spyOn(require("../supabaseClient"), "from")
      .mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        }),
      });

    const response = await request(app).delete("/delete/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Workout deleted successfully",
      data: { id: 1 },
    });

    supabaseDeleteMock.mockRestore();
  });
});

describe("PUT /update/:id (Update Workout Duration)", () => {
  it("should update workout duration", async () => {
    const supabaseUpdateMock = jest
      .spyOn(require("../supabaseClient"), "from")
      .mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: { id: 1, duration: 45 },
            error: null,
          }),
        }),
      });

    const response = await request(app).put("/update/1").send({
      duration: 45,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Workout updated successfully",
      data: { id: 1, duration: 45 },
    });

    supabaseUpdateMock.mockRestore();
  });

  it("should return a 400 error for invalid duration value", async () => {
    const response = await request(app).put("/update/1").send({
      duration: -10,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid duration value" });
  });
});
