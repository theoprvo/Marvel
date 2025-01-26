const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middlewares/auth");
const { log } = require("console");

const createAccessToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "21d" }
  );
};

//SIGN UP
//@public
router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);

    const newUser = new User({
      email,
      account: { username, favorites: [] },
      hash,
      salt,
    });
    await newUser.save();

    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 21,
    });
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//LOGIN
//@public
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "No account associated with this email" });
    }

    const hash = SHA256(password + user.salt).toString(encBase64);
    if (hash !== user.hash) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 21,
      sameSite: "None",
      // domain: ".theopruvot.fr",
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//LOGOUT
//@private
router.get("/user/logout", auth, async (req, res) => {
  //TODO: Delete access token on Client side
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(204).json({ message: "No refresh token provided" });
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 21,
    });
    res.status(204).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//REFRESH-TOKEN
//@public
router.post("/user/refresh-token", (req, res) => {
  console.log("Cookies reçus :", req.cookies); // Vérifie si le cookie 'jwt' est présent
  console.log("Headers :", req.headers); // Vérifie si les entêtes sont correctes
  console.log("Mon jwt cookie :", req.cookies.jwt);

  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(403).json({ error: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("decoded values :", decoded);

    const newAccessToken = createAccessToken(decoded);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

//GET CURRENT USER PROFILE INFOS BY TOKEN
//@private
router.get("/user/profile", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Please log in." });
    }

    const email = req.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.account.username,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET CURRENT USER FAVORITES BY TOKEN
//@private
router.get("/user/favorites", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const email = req.user.email;
    const user = await User.findOne({ email });
    const favorites = user.account.favorites;

    const startIndex = (page - 1) * limit;
    const paginatedFavorites = favorites.slice(startIndex, startIndex + limit);

    res.status(200).json({
      page,
      limit,
      totalFavorites: favorites.length,
      favorites: paginatedFavorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ADD FAVORITE
//@private
router.post("/user/favorites", auth, async (req, res) => {
  try {
    const { favoriteType, favoriteID } = req.body;

    if (!favoriteType || !favoriteID) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const allowedTypes = ["character", "comic"];
    if (!allowedTypes.includes(favoriteType)) {
      return res.status(400).json({ message: "Invalid favorite type" });
    }

    const email = req.user.email;
    const user = await User.findOne({ email });

    const isFavoriteAlreadyAdded = user.account.favorites.some(
      (fav) =>
        fav.favoriteType === favoriteType && fav.favoriteID === favoriteID
    );

    if (isFavoriteAlreadyAdded) {
      return res.status(409).json({ message: "Favorite already added" });
    }

    user.account.favorites.push({ favoriteType, favoriteID });
    await user.save();

    res.status(200).json({
      totalFavorites: user.account.favorites,
      favorites: user.account.favorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DELETE FAVORITE
//@private
router.delete("/user/favorites", auth, async (req, res) => {
  try {
    const { favoriteID } = req.body;

    if (!favoriteID) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const email = req.user.email;
    const user = await User.findOne({ email });

    const favoriteExists = user.account.favorites.some(
      (fav) => fav.favoriteID === favoriteID
    );

    if (!favoriteExists) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    user.account.favorites = user.account.favorites.filter(
      (fav) => fav.favoriteID !== favoriteID
    );

    await user.save();

    res.status(200).json({
      totalFavorites: user.account.favorites,
      favorites: user.account.favorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
