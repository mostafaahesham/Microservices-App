const { onUserAccountDeleted } = require("./eventHandlers");

const NatsClient = require("../../../nats-shared-lib/src/natsClient");

exports.subscribeToEvents = async () => {
  try {
    console.log("here");
    const natsClient = new NatsClient();
    await natsClient.connect();

    natsClient.subscribe("user.account.deleted", (msg) => {
      onUserAccountDeleted(msg.user);
    });
  } catch (err) {
    console.error("Failed to connect to NATS:", err);
  }
};
