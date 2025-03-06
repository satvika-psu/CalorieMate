const express = require("express");
const cors = require("cors");
const signUp = require("./routes/signUp");
const signIn = require("./routes/signIn");
const signOut = require("./routes/signOut");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/signin", signIn);
app.use("/api/signup", signUp);
app.use("/api/signout", signOut);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
