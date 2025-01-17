const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is missing" });
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = {
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};
module.exports = auth;
