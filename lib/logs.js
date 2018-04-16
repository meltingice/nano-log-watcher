const fs = require("fs");
const ts = require("tail-stream");

module.exports = (gelf, config) => {
  let stream = null;

  function watchForNewLogFile() {
    fs.watch(config.LOG_DIR, { encoding: "utf8" }, (eventType, filename) => {
      if (filename && eventType === "rename" && /^log_/.test(filename)) {
        console.log("New log file detected!");
        streamLogFile(filename);
      }
    });
  }

  function streamLogFile(filename, isRetry) {
    if (stream) stream.destroy();

    console.log(`Beginning stream of ${filename}`);

    stream = ts.createReadStream(`${config.LOG_DIR}/${filename}`, {
      onMove: "end",
      detectTruncate: false,
      endOnError: true,
      waitForCreate: true
    });

    stream.on("data", data => {
      data
        .toString()
        .split("\n")
        .forEach(line => {
          if (!line) return;

          gelf.emit("gelf.log", {
            version: "1.1",
            host: config.HOSTNAME,
            short_message: line,
            timestamp: Math.floor(new Date().getTime() / 1000),
            level: 7
          });
        });
    });

    stream.on("error", error => {
      console.log("ERROR: ", error);
    });
  }

  return {
    start: () => {
      const files = fs.readdirSync(config.LOG_DIR);
      streamLogFile(files[files.length - 1]);
      watchForNewLogFile();
    }
  };
};
