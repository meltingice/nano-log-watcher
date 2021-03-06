const os = require("os");
const Gelf = require("gelf");

const config = {
  HOSTNAME: os.hostname(),
  LOG_DIR: process.env.RAIBLOCKS_LOG_DIR,
  RPC_URL: process.env.RPC_URL || "http://127.0.0.1:7076"
};

const gelf = new Gelf({
  graylogPort: process.env.GRAYLOG_PORT || 12201,
  graylogHostname: process.env.GRAYLOG_HOST,
  connection: "lan"
});

const Logs = require("./lib/logs")(gelf, config);
const RPC = require("./lib/rpc")(gelf, config);

Logs.start();
RPC.start();
