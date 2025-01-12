const express = require("express");
const router = express.Router();

const fetchMarvelAPI = require("../utils/fetchMarvelAPI");
const generateMarvelURL = require("../utils/generateMarvelURL");

// GET COMICS
router.get("/comics", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const title = req.query.title || "";

    let params = `orderBy=title&limit=${limit}&offset=${offset}`;
    if (title) {
      params += `&titleStartsWith=${title}`;
    }

    const cacheKey = `comics/limit=${limit}&offset=${offset}&title=${title}`;
    const url = generateMarvelURL(`comics`, params);

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
router.get("/comics/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const cacheKey = `comics/id=${id}`;
    const url = generateMarvelURL(`comics/${id}`);

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
