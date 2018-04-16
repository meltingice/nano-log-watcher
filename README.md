# Nano Log Watcher

This project allows you to send your Nano node logs to Graylog2 using GELF. It watches the log files in the log directory and streams their contents as individual GELF messages to your Graylog server.

It also has support for logging periodical RPC calls to Graylog for tracking various network trends and data.

## Installation

After you clone this repository, run `npm install` to install dependencies. That's it.

On the Graylog side of things, you'll need to create a GELF UDP input to accept messages from this script.

## Configuration

All configuration is done via environment variables:

* `RAIBLOCKS_LOG_DIR` - path to the node log directory. By default, it's located at `/home/<user>/RaiBlocks/log`.
* `RPC_URL` - URL of your Nano node RPC server. Defaults to `http://127.0.0.1:7076`.
* `GRAYLOG_HOST` - Host/IP address of your Graylog server.
* `GRAYLOG_PORT` - Port for the Graylog input.

## Running

You can start the log collection by simply running `node index.js`. I recommend daemonizing it with something like [pm2](http://pm2.keymetrics.io/).
