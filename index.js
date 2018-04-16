var os = require("os");
var fs = require("fs");
const Tail = require("tail").Tail;
const Gelf = require("gelf");

const HOSTNAME = os.hostname();
const RAIBLOCKS_DIR = "/home/ryanlefevre/RaiBlocks";
const LOG_DIR = `${RAIBLOCKS_DIR}/log`;

var stream = null;

const gelf = new Gelf({
  graylogPort: process.env.GRAYLOG_PORT || 12201,
  graylogHostname: process.env.GRAYLOG_HOST,
  connection: "lan"
});

function watchForNewLogFile() {
  fs.watch(LOG_DIR, { encoding: "utf8" }, (eventType, filename) => {
    if (filename && eventType === "rename" && /^log_/.test(filename)) {
      console.log("New log file detected!");
      changeLogFile(filename);
    }
  });
}

function streamLogFile(filename) {
  if (stream) stream.unwatch();

  console.log(`Beginning stream of ${filename}`);

  stream = new Tail(`${LOG_DIR}/${filename}`);

  stream.on("line", data => {
    gelf.emit("gelf.log", {
      version: "1.1",
      host: HOSTNAME,
      short_message: line,
      timestamp: Math.floor(new Date().getTime() / 1000),
      level: 7
    });
  });
}

const files = fs.readdirSync(LOG_DIR);
streamLogFile(files[files.length - 1]);
watchForNewLogFile();
