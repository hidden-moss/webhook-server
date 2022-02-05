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
  // Bot Message
  botMsg.card = {
    config: {
      wide_screen_mode: true,
    },
    elements: [
      {
        tag: "div",
        text: {
          content: `🔗 **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})\n🔮 **zen**: ${body.zen}`,
          tag: "lark_md",
        },
      },
    ],
    header: {
      template: "purple",
      title: {
        content: "🤏 New webhook",
        tag: "plain_text",
      },
    },
  };
  return botMsg;
};

const translatePush = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  // Commit Markdown
  let commitMd = "";
  for (const cmt of body.commits) {
    commitMd += `\n🔸 **${cmt.committer}**: `;
    commitMd += `[${cmt.msg.split("\n")[0]}](${cmt.url})`;
  }
  if (commitMd === "") {
    // no commit
    commitMd = "\n🚫 Nothing to commit";
  }

  // Bot Message
  botMsg.card = {
    config: {
      wide_screen_mode: true,
    },
    elements: [
      {
        fields: [
          {
            is_short: false,
            text: {
              content: `🔗 **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
              tag: "lark_md",
            },
          },
          {
            is_short: false,
            text: {
              content: "",
              tag: "lark_md",
            },
          },
          {
            is_short: true,
            text: {
              content: `🔀 **branch**:\n${body.ref}`,
              tag: "lark_md",
            },
          },
          {
            is_short: true,
            text: {
              content: `👤 **sender**:\n[${body.sender.name}](${body.sender.url})`,
              tag: "lark_md",
            },
          },
        ],
        tag: "div",
      },
      {
        tag: "hr",
      },
      {
        tag: "div",
        text: {
          content: commitMd,
          tag: "lark_md",
        },
      },
    ],
    header: {
      template: "blue",
      title: {
        content: `✋ Push → ${body.ref}`,
        tag: "plain_text",
      },
    },
  };

  return botMsg;
};

const translateCreate = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card = {
    config: {
      wide_screen_mode: true,
    },
    elements: [
      {
        fields: [
          {
            is_short: false,
            text: {
              content: `🔗 **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
              tag: "lark_md",
            },
          },
          {
            is_short: false,
            text: {
              content: "",
              tag: "lark_md",
            },
          },
          {
            is_short: true,
            text: {
              content: `🔀 **${body.ref_type}**:\n${body.ref}`,
              tag: "lark_md",
            },
          },
          {
            is_short: true,
            text: {
              content: `👤 **sender**:\n[${body.sender.name}](${body.sender.url})`,
              tag: "lark_md",
            },
          },
        ],
        tag: "div",
      },
    ],
    header: {
      template: "purple",
      title: {
        content: `🤌 New ${body.ref_type} → ${body.ref}`,
        tag: "plain_text",
      },
    },
  };

  return botMsg;
};

const translatePullRequest = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card = {
    config: {
      wide_screen_mode: true,
    },
  };

  botMsg.card.header = {
    template: "red",
    title: {
      content: `🙏 Pull request ${body.action} #${body.pull_request.number}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
    {
      fields: [
        {
          is_short: false,
          text: {
            content: `🧩 **pull request**: [${body.pull_request.head} ➡️ ${body.pull_request.base}](${body.pull_request.url}))`,
            tag: "lark_md",
          },
        },
        {
          is_short: false,
          text: {
            content: "",
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `🔸 **commits**:\n[${body.pull_request.commits}](${body.pull_request.url}/commits)`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `👤 **sender**:\n[${body.sender.name}](${body.sender.url})`,
            tag: "lark_md",
          },
        },
      ],
      tag: "div",
    },
    {
      tag: "hr",
    },
    {
      tag: "div",
      text: {
        content: `📝 **${body.pull_request.title}**\n${body.pull_request.body}`,
        tag: "lark_md",
      },
    },
  ];

  return botMsg;
};

const dict = {
  PING: translatePing,
  PUSH: translatePush,
  CREATE: translateCreate,
  PULL_REQUEST: translatePullRequest,
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
