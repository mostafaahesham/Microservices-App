const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { dbConnection } = require("./database/dbConnection");
const errorHandler = require("./middlewares/error-handler");
const mountRoutes = require("../src/routes/mountRoutes");

const NotFoundError = require("../../errors/not-found-error");
const NatsClient = require("../../nats-shared-lib/src/natsClient");

dotenv.config({ path: "src/config.env" });

const app = express();

const server = dbConnection(app);

const natsClient = new NatsClient();
natsClient.connect();

global.natsClient = natsClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV == "dev") {
  app.use(morgan("dev"));
}

mountRoutes(app);

console.log(`mode: ${process.env.NODE_ENV}`);
console.log(`BASE_URL: ${process.env.BASE_URL}`);
console.log(`APP: ${process.env.APP_NAME}`);

app.all("*", (req, res, next) => {
  next(new NotFoundError(`Cannot find this route: ${req.originalUrl}`));
});

app.use(errorHandler);

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down ...`);
    process.exit(1);
  });
});
