const generateHash = require("./generateHash");

const generateMarvelURL = (route, params = "") => {
  const timeStamp = new Date().getTime();
  const hash = generateHash(timeStamp);

  if (params) {
    return `${process.env.MARVEL_BASE_URL}/${route}?${params}&ts=${timeStamp}&apikey=${process.env.MARVEL_API_PUBLIC_KEY}&hash=${hash}`;
  } else {
    return `${process.env.MARVEL_BASE_URL}/${route}?ts=${timeStamp}&apikey=${process.env.MARVEL_API_PUBLIC_KEY}&hash=${hash}`;
  }
};

module.exports = generateMarvelURL;
