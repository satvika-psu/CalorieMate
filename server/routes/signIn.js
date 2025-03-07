// routes/signIn.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
// Route for user signin
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Return an error if sign in fails
      return res.status(400).json({ error: error.message });
    }

    // If sign-in is successful, send user data and session info back to the client
    const user = data.user;
    const session = data.session;

    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user.id,
        email: user.email,
      },
      token: session.access_token,
    });
  } catch (error) {
    console.error("Error during sign in:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
