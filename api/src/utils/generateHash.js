const md5 = require("md5");

const generateHash = (timeStamp) => {
  return md5(
    timeStamp +
      process.env.MARVEL_API_PRIVATE_KEY +
      process.env.MARVEL_API_PUBLIC_KEY
  );
};

module.exports = generateHash;
