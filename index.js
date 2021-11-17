const http = require("http");
const url = require("url");
const pg = require("pg");
const { opSwitch } = require("./dbinit");
const util = require("./util");

const fildsBody = ["fio", "id", "birthday", "gender"];
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Max-Age": 2592000,
  "Content-Type": "application/json",
};

const server = http.createServer((req, res) => {
  const urlParsed = url.parse(req.url, true);

  if (
    urlParsed.pathname == "/user/" &&
    req.method == "GET" &&
    urlParsed.query.id
  ) {
    opSwitch([parseInt(urlParsed.query.id)], "read")
      .then((el) => {
        res.writeHead(200, headers);
        res.write(JSON.stringify(el.rows));
        res.end();
      })
      .catch((e) => {
        res.statusCode("404");
        console.log(e, "not found user");
        res.end();
      });
  } else if (urlParsed.pathname == "/user/" && req.method === "POST") {
    postProcessing(req, res, "create");
  } else if (
    url.parse(req.url).pathname == "/user/update/" &&
    req.method === "POST" &&
    urlParsed.query.id
  ) {
    postProcessing(req, res, "update");
  } else if (
    url.parse(req.url).pathname == "/user/delete/" &&
    req.method === "GET" &&
    urlParsed.query.id
  ) {
    console.log("delete");
    opSwitch([parseInt(urlParsed.query.id)], "delete")
      .then((data) => {
        res.writeHead(200, headers);
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch((e) => {
        console.log(e);
        res.end("no found");
      });
  } else if (
    url.parse(req.url).pathname == "/user/all" &&
    req.method === "GET"
  ) {
    opSwitch([], "all", urlParsed.query.page)
      .then((data) => {
        res.writeHead(200, headers);
        res.write(JSON.stringify(data.rows));
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.end("no found");
      });
  } else if (
    url.parse(req.url).pathname == "/user/search" &&
    req.method === "POST"
  ) {
    postProcessing(req, res, "search");
  } else {
    res.end("Invalid request");
  }
});
server.listen(5000);

async function postProcessing(req, res, typeFunction) {
  let output = [];
  req.on("data", function (data) {
    output.push(util.filter(data.toString(), fildsBody));
  });
  req.on("end", function () {
    opSwitch(output[0], typeFunction, url.parse(req.url, true).query.id)
      .then((data) => {
        res.writeHead(200, headers);
        res.write(JSON.stringify(data.rows));
        res.end(JSON.stringify(data.rows));
      })
      .catch((e) => {
        console.log(e);
        res.end(`error ${typeFunction} user`);
      });
  });
}

console.log("start server");
