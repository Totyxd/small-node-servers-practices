const http = require('http');
const fs = require("fs");

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.method === "GET" && req.url.startsWith("/static")) {
      const subString = req.url.split("/");
      const assetFolder = subString[2];
      const asset = subString[subString.length - 1];
      const fileExt = asset.split(".")[1];

      const resource = fs.readFileSync(`./assets/${assetFolder}/${asset}`);
      res.statusCode = 200;
      assetFolder === "images" ? res.setHeader("Content-Type", `image/${fileExt}`) : res.setHeader("Content-Type", `text/css`);
      return res.end(resource);
    };

    if (req.method === "GET" && req.url === "/") {
      const html = fs.readFileSync("./index.html");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(html);
    };
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
