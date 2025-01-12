require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// ROUTES
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MARVEL API" });
});

const userRoutes = require("./src/routes/user");
app.use(userRoutes);
const comicsRoutes = require("./src/routes/comics");
app.use(comicsRoutes);
const charactersRoutes = require("./src/routes/characters");
app.use(charactersRoutes);

app.all("*", (req, res) => {
  res.json({ message: "Route not found" });
});

//SERVER START
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${process.env.MONGO_URI} : ${PORT}`);
  });
}

module.exports = app;
