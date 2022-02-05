// @copyright Hidden Moss Inc.
// @see https://hiddenmoss.com/
// @author Yuancheng Zhang
const https = require("https");

//////! Translate ///////

const template = {
  msg_type: "interactive",
  card: {},
};

const translatePing = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);
  botMsg.card = {
    config: {
      wide_screen_mode: true,
    },
    elements: [
      {
        tag: "div",
        text: {
          content: `🔗 **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
          tag: "lark_md",
        },
      },
    ],
    header: {
      template: "turquoise",
      title: {
        content: "🤏 添加了新的 Webhook",
        tag: "plain_text",
      },
    },
  };
  return botMsg;
};

const translatePush = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);
  botMsg.card = {};
  //TODO:
  return botMsg;
};

const dict = {
  PING: translatePing,
  PUSH: translatePush,
};

//////! Send Request ///////

const path = "/open-apis/bot/v2/hook/";
const options = {
  hostname: "open.feishu.cn",
  port: 443,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const sendRequest = (bot, msg) => {
  options.path = path + bot;
  const req = https.request(options, (res) => {
    // console.log("statusCode:", res.statusCode);
    // console.log("headers:", res.headers);
    res.on("data", (d) => {
      //   process.stdout.write(d);
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.write(JSON.stringify(msg));

  req.end();
};

exports.send = (bot, ctx) => {
  sendRequest(bot, dict[ctx.event](ctx.body));
};
