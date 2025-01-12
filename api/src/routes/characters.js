const express = require("express");
const router = express.Router();

const fetchMarvelAPI = require("../utils/fetchMarvelAPI");
const generateMarvelURL = require("../utils/generateMarvelURL");

// GET CHARACTERS
router.get("/characters", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const name = req.query.name || "";

    let params = `orderBy=name&limit=${limit}&offset=${offset}`;
    if (name) {
      params += `&nameStartsWith=${name}`;
    }

    const cacheKey = `characters/limit=${limit}&offset=${offset}&title=${name}`;
    const url = generateMarvelURL(`characters`, params);

    const responseData = await fetchMarvelAPI(cacheKey, url);

    res.status(200).json({
      count: responseData.count,
      total: responseData.total,
      limit,
      offset,
      results: responseData.results,
    });
  } catch (error) {
    if (error.response) {
      // API MARVEL ERROR
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

// GET A COMIC
router.get("/characters/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const cacheKey = `characters/id=${id}`;
    const url = generateMarvelURL(`characters/${id}`);

    const responseData = await fetchMarvelAPI(cacheKey, url);

    res.status(200).json(responseData);
  } catch (error) {
    if (error.response) {
      // API MARVEL ERROR
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

module.exports = router;
