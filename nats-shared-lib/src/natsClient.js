let instance = null;
const { connect } = require("nats");

class NatsClient {
  constructor() {
    if (!instance) {
      this.nc = null;
      instance = this;
    }

    return instance;
  }

  async connect(options = { servers: "nats://localhost:4222" }) {
    if (!this.nc) {
      try {
        this.nc = await connect(options);
        console.log(`Connected to NATS: ${options.servers}`);
      } catch (err) {
        console.error("Error connecting to NATS:", err);
      }
    }
  }

  async publish(subject, data) {
    if (!this.nc) {
      throw new Error("Not connected to NATS");
    }
    this.nc.publish(subject, JSON.stringify(data));
  }

  async subscribe(subject, callback, options = {}) {
    if (!this.nc) {
      throw new Error("Not connected to NATS");
    }
    const subscription = this.nc.subscribe(subject, options);
    (async () => {
      for await (const msg of subscription) {
        callback(JSON.parse(msg.data), msg);
      }
    })();
  }

  async close() {
    if (this.nc) {
      await this.nc.close();
      this.nc = null;
      instance = null;
    }
  }
}

module.exports = NatsClient;
