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
              content: `🔀 **branch**: ${body.ref}`,
              tag: "lark_md",
            },
          },
          {
            is_short: true,
            text: {
              content: `👤 **sender**: [${body.sender.name}](${body.sender.url})`,
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
              content: `👤 **sender**: [${body.sender.name}](${body.sender.url})`,
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
      content: `🙏 Pull request #${body.pull_request.number} ${body.action}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
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
          is_short: false,
          text: {
            content: `🧩 **pull request**: **[#${body.pull_request.number}](${body.pull_request.url})** [${body.pull_request.head} ➡️ ${body.pull_request.base}](${body.pull_request.url})`,
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
            content: `🦠 **state**: ${body.pull_request.state}\n🔸 **commits**: [${body.pull_request.commits}](${body.pull_request.url}/commits)`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `👤 **sender**: [${body.sender.name}](${body.sender.url})`,
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
        content: `📝 **[#${body.pull_request.number}](${body.pull_request.url}) [${body.pull_request.title}](${body.pull_request.url})**\n${body.pull_request.body}`,
        tag: "lark_md",
      },
    },
  ];

  return botMsg;
};

const translateIssue = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card = {
    config: {
      wide_screen_mode: true,
    },
  };

  botMsg.card.header = {
    template: "orange",
    title: {
      content: `🎈 Issue #${body.issue.number} ${body.action}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
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
            content: `🦠 **state**: [#${body.issue.number}](${
              body.issue.url
            }) ${body.issue.state}\n👩🏻‍💻 **assignee**: ${
              body.issue.assignee
                ? `[${body.issue.assignee.name}](${body.issue.assignee.url})`
                : "none"
            }`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `👤 **sender**: [${body.sender.name}](${body.sender.url})`,
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
        content: `📝 **[#${body.issue.number}](${body.issue.url}) [${body.issue.title}](${body.issue.url})**\n${body.issue.body}`,
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
  ISSUE: translateIssue,
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
