const { subscribe } = require('diagnostics_channel');
const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    };
    // Do not edit above this line

    if (req.method === "GET" && req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Dog Club");
    };

    if (req.method === "GET" && req.url === "/dogs" || req.url === "/dogs/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Dogs Index");
    };

    if (req.method === "GET" && req.url.startsWith("/dogs/") && req.url !== "/dogs/new") {
      const subString = req.url.split("/");
      if (subString.length === 3) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Dog details for " + subString[2]);
      };
    };

    if (req.method === "GET" && req.url === ("/dogs/new")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Create Dog form page");
    };

    if (req.method === "POST" && req.url === "/dogs") {
      res.statusCode = 302;
      res.setHeader("Location", "/dogs/" + getNewDogId());
      return res.end();
    };

    if (req.method === "GET" && req.url.startsWith("/dogs/")) {
      const subString = req.url.split("/");
      if (subString.length === 4 && subString[3] === "edit") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Dog edit form page for dog " + subString[2]);
      };
    };

    if (req.method === "POST" && req.url.startsWith("/dogs/")) {
      const subString = req.url.split("/");
      if (subString.length === 3) {
        res.statusCode = 302;
        res.setHeader("Location", + subString[2]);
        return res.end("Found. Redirecting -- 302");
      };
    };

    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
