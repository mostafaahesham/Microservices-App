const NotAuthorizedError = require("../errors/not-authorized-error");

function checkApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    next(new NotAuthorizedError());
  }
}

module.exports = checkApiKey;
