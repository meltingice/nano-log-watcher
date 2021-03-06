const Nano = require("nanode").Nano;

module.exports = (gelf, config) => {
  const nano = new Nano({ url: config.RPC_URL });

  function getBlockCounts() {
    console.log("Checking block count...");
    nano.blocks.count().then(blocks => {
      console.log(blocks);

      gelf.emit("gelf.log", {
        version: "1.1",
        host: config.HOSTNAME,
        short_message: "Block counts",
        timestamp: Math.floor(new Date().getTime() / 1000),
        level: 7,
        _rpc_call: "block_count",
        _rpc_response: JSON.stringify(blocks)
      });

      setTimeout(getBlockCounts, 10000);
    });
  }

  return {
    start: () => {
      getBlockCounts();
    }
  };
};
