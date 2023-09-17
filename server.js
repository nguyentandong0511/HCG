var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

async function fetch(...args) {
  const { default: fetch } = await import("node-fetch");
  return await fetch(...args);
}

const CLIENT_ID = "3f68ca8366b5d9990f6d";
const CLIENT_SECRET = "48da847fabcb5d89cb3828df558f981a606acf5d";

var app = express();

app.use(cors());
app.use(bodyParser.json());

// get token

app.get("/getToken", async function (req, res) {
  const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

// get user

app.get("/user", async function (req, res) {
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

// get language

app.get("/languages", async function (req, res) {
  await fetch("https://api.github.com/languages", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

// get repository paging

app.get("/repository", async function (req, res) {
  const params = `?q=${req.query}&page=${req.query.page}&per_page=${req.query.per_page}&sort=${req.query.sort}&order=${req.query.order}`;

  await fetch("https://api.github.com/search/repositories" + params, {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json({
        ...data,
        pageNumber: +req.query.page,
        pageSize: +req.query.per_page,
      });
    });
});

app.listen(4000, function () {});
