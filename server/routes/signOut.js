// routes/signout.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Route for user signout
router.post("/", async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Error during sign out:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
