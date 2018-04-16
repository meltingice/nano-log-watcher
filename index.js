const os = require("os");
const Gelf = require("gelf");

const config = {
  HOSTNAME: os.hostname(),
  RAIBLOCKS_DIR: "/home/ryanlefevre/RaiBlocks",
  LOG_DIR: `${RAIBLOCKS_DIR}/log`,
  RPC_ADDRESS: process.env.RPC_ADDRESS || "127.0.0.1:7076"
};

const gelf = new Gelf({
  graylogPort: process.env.GRAYLOG_PORT || 12201,
  graylogHostname: process.env.GRAYLOG_HOST,
  connection: "lan"
});

const Logs = require("./lib/logs")(gelf, config);

Logs.start();
