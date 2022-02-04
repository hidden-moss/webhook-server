// @copyright Hidden Moss Inc.
// @see https://hiddenmoss.com/
// @author Yuancheng Zhang

const express = require("express");
const ctrl = require("./controllers");
const app = express();

app.use(express.json());

app.get(`/`, (req, res) => {
  res.redirect("http://hiddenmoss.com");
});

app.post(`/webhook/:from/:to/:bot`, (req, res) => {
  console.log(req.body); //
  const from = req.params.from.toLowerCase();
  const to = req.params.to.toLowerCase();
  const bot = req.params.bot;
  console.log(ctrl.parsers[from], ctrl.templates[to]);

  if (ctrl.parsers[from] && ctrl.templates[to]) {
    res.status(200).send("OK");
    return;
  }
  res.status(500).send("Link Error");
});

app.get("/404", (req, res) => {
  res.status(404).send("Not found");
});

app.get("/500", (req, res) => {
  res.status(500).send("Server Error");
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

// Web 类型云函数，只能监听 9000 端口
app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});