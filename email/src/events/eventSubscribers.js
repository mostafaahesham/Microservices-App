const {
  onUserSignup,
  onUserPasswordForgotten,
  onUserPasswordReset,
  onUserPasswordUpdated,
  onUserInfoUpdated,
  onUserAccountDeleted,
} = require("./eventHandlers");

const NatsClient = require("../../../nats-shared-lib/src/natsClient");

exports.subscribeToEvents = async () => {
  try {
    const natsClient = new NatsClient();
    await natsClient.connect();

    natsClient.subscribe("user.signup", (msg) => {
      onUserSignup(msg.user);
    });
    natsClient.subscribe("user.password.forgotten", (msg) => {
      onUserPasswordForgotten(msg.user, msg.passwordResetCode);
    });
    natsClient.subscribe("user.password.reset", (msg) => {
      onUserPasswordReset(msg.user);
    });
    natsClient.subscribe("user.password.updated", (msg) => {
      onUserPasswordUpdated(msg.user);
    });
    natsClient.subscribe("user.info.updated", (msg) => {
      onUserInfoUpdated(msg.user, msg.newImage, msg.previousImage);
    });
    natsClient.subscribe("user.account.deleted", (msg) => {
      onUserAccountDeleted(msg.user);
    });
  } catch (err) {
    console.error("Failed to connect to NATS:", err);
  }
};
