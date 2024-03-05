const DatabaseConnectionError = require("../../../errors/database-connection-error");

const { connect, set } = require("mongoose");

const options = {
  maxPoolSize: 200, 
  autoIndex: false,
  dbName: process.env.DB_NAME,
};

const connectWithRetry = () => {
  connect(process.env.DB_URI, options)
    .then((connect) => {
      console.log(
        `Success Connect to Database: ${connect.connection.host} - DB_NAME: ${connect.connection.db.databaseName}`
      );
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB: ${error}`);
      setTimeout(connectWithRetry, 5000);
    });
};

exports.dbConnection = (app, server) => {
  set("strictQuery", false);
  app.listen(process.env.PORT, () => {
    console.log(`App Running on port ${process.env.PORT}`);
    connectWithRetry();
    return server;
  });
};
