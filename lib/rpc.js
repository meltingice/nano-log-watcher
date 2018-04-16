const Nano = require("nanode").Nano;

module.exports = (gelf, config) => {
  const nano = new Nano({ url: config.RPC_URL });

  function getBlockCounts() {
    nano.blocks.count().then(blocks => {
      gelf.emit("gelf.log", {
        version: "1.1",
        host: config.HOSTNAME,
        short_message: "Block counts",
        full_message: JSON.stringify(blocks),
        timestamp: Math.floor(new Date().getTime() / 1000),
        level: 7,
        _rpc_call: "block_count"
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
