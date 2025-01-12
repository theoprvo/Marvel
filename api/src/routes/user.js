const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");
const auth = require("../middlewares/auth");

//SIGN UP
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
    const token = uid2(32);

    const newUser = new User({
      email,
      account: { username, favorites: [] },
      token,
      hash,
      salt,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//LOGIN
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

    res.status(200).json({
      _id: user._id,
      token: user.token,
      account: user.account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET USER BY TOKEN
router.get("/user", auth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      _id: user._id,
      account: user.account,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ADD FAVORITE
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

    const isFavoriteAlreadyAdded = req.user.account.favorites.some(
      (fav) =>
        fav.favoriteType === favoriteType && fav.favoriteID === favoriteID
    );

    if (isFavoriteAlreadyAdded) {
      return res.status(409).json({ message: "Favorite already added" });
    }

    req.user.account.favorites.push({ favoriteType, favoriteID });
    await req.user.save();

    res.status(200).json(req.user.account.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DELETE FAVORITE
router.delete("/user/favorites", auth, async (req, res) => {
  try {
    const { favoriteID } = req.body;

    if (!favoriteID) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const favoriteExists = req.user.account.favorites.some(
      (fav) => fav.favoriteID === favoriteID
    );

    if (!favoriteExists) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    req.user.account.favorites = req.user.account.favorites.filter(
      (fav) => fav.favoriteID !== favoriteID
    );

    await req.user.save();

    res.status(200).json(req.user.account.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET USER FAVORITES
router.get("/user/favorites", auth, async (req, res) => {
  try {
    //ajouter un pagination ?
    const favorites = req.user.account.favorites;

    res.status(200).json({
      _id: req.user._id,
      totalFavorites: favorites.length,
      favorites: favorites,
    });

    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;

    // Récupérer les favoris de l'utilisateur connecté
    // const user = req.user;
    // const favorites = user.account.favorites;

    // Appliquer la pagination
    // const startIndex = (page - 1) * limit;
    // const paginatedFavorites = favorites.slice(startIndex, startIndex + limit);

    // Répondre avec les favoris paginés et les infos supplémentaires
    // res.status(200).json({
    //   page,
    //   limit,
    //   totalFavorites: favorites.length,
    //   favorites: paginatedFavorites,
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
