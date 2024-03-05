const userAuthRoutes = require("../routes/userAuthRoutes");
const userRoutes = require("../routes/userRoutes");

const mountRoutes = (app) => {
  app.use("/api/v2/users/auth", userAuthRoutes);
  app.use("/api/v2/users", userRoutes);
};

module.exports = mountRoutes;
