// routes/signIn.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
// Route for user signin
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Send session/user data back to the client for further use
    res.status(200).json({ message: "User signed in successfully", data });
  } catch (error) {
    console.error("Error during sign in:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
