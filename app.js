const express = require("express");
const Redis = require("ioredis");

const app = express();

app.use(express.static("public"));

/**
 * Redis connection setup
 * If you are running Redis locally, no need to set any env variables (Defaults will be used).
 * Otherwise, set the REDIS_HOST and REDIS_PORT accordingly.
 */

var redisHost = process.env.REDIS_HOST || "127.0.0.1";
var redisPort = process.env.REDIS_PORT || 6379;

const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
});

app.get("/", async (req, res) => {
  const visits = await redisClient.incr("visits");
  console.log("Received a request");
  res.send(`<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Counter with Redis</title>
  </head>
  <body>
    <h1>Counter: <span id="counter">${visits}</span></h1>
    <button id="nukebtn">Nuke this counter!</button>
  </body>
  <script>
    function fetchNuke() {
      document.getElementById('nukebtn').addEventListener('click', () => {
        fetch('/nuke', { method: 'POST' })
          .then(res => {
              console.log('Counter nuked.');
              document.getElementById('counter').textContent = '0';
          }).catch(err => console.error('Error nuking counter:', err));
      });
    };
    fetchNuke();
  </script>
</html>`);
});

app.post("/nuke", async (req, res) => {
  await redisClient.set("visits", 0);
  console.log("Nuked visit count");
  res.send({ status: "completed" });
});

module.exports = app;
