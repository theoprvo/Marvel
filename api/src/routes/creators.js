const express = require("express");
const router = express.Router();

const fetchMarvelAPI = require("../utils/fetchMarvelAPI");
const generateMarvelURL = require("../utils/generateMarvelURL");

// GET CREATORS
router.get("/creators", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const lastName = req.query.lastName || "";

    let params = `orderBy=lastName&limit=${limit}&offset=${offset}`;
    if (lastName) {
      params += `&lastNameStartsWith=${lastName}`;
    }

    const cacheKey = `creators/limit=${limit}&offset=${offset}&title=${lastName}`;
    const url = generateMarvelURL(`creators`, params);

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

// GET A CREATOR
router.get("/creators/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const cacheKey = `creators/id=${id}`;
    const url = generateMarvelURL(`creators/${id}`);

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
