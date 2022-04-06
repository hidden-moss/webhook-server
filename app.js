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
  const from = req.params.from.toLowerCase();
  const to = req.params.to.toLowerCase();
  const bot = req.params.bot;
  const parser = ctrl.parsers[from];
  const template = ctrl.templates[to];
  // TODO: need to optimize
  if (parser && template) {
    try {
      const ctx = parser.parse(req);
      if (ctx) {
        template.send(bot, ctx);
        res.status(200).send("OK");
      } else {
        res.status(400).send("Parse Error");
      }
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    } finally {
      return;
    }
  } else {
    console.log(req.body);
    console.log(parser, template);
    res.status(400).send("Link Error");
  }
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
