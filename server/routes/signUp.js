// routes/signUp.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Route for user signup
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "User signed up successfully", data });
  } catch (error) {
    console.error("Error during sign up:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
