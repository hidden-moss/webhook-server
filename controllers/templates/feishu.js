// @copyright Hidden Moss Inc.
// @see https://hiddenmoss.com/
// @author Yuancheng Zhang
const https = require("https");

//////! Translate ///////

const template = {
  msg_type: "interactive",
  card: {
    config: {
      wide_screen_mode: true,
    },
  },
};

const translatePing = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);
  // Bot Message
  botMsg.card.elements = [
    {
      tag: "div",
      text: {
        content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})\nš® **zen**: ${body.zen}`,
        tag: "lark_md",
      },
    },
  ];
  botMsg.card.header = {
    template: "purple",
    title: {
      content: "š¤ New webhook",
      tag: "plain_text",
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
    commitMd += `\nšø **[${cmt.committer}](${cmt.committer_url})**: `;
    commitMd += `[${cmt.msg.split("\n")[0]}](${cmt.url})`;
  }
  if (commitMd === "") {
    // no commit
    commitMd = "\nš« Nothing to commit";
  }

  // Bot Message
  botMsg.card.header = {
    template: "green",
    title: {
      content: `ā Push ā ${body.ref}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
    {
      fields: [
        {
          is_short: false,
          text: {
            content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
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
            content: `š **branch**: ${body.ref}`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `š¤ **sender**: [${body.sender.name}](${body.sender.url})`,
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
  ];

  return botMsg;
};

const translateCreate = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card.header = {
    template: "purple",
    title: {
      content: `š¤ New ${body.ref_type} ā ${body.ref}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
    {
      fields: [
        {
          is_short: false,
          text: {
            content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
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
            content: `š **${body.ref_type}**:\n${body.ref}`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `š¤ **sender**: [${body.sender.name}](${body.sender.url})`,
            tag: "lark_md",
          },
        },
      ],
      tag: "div",
    },
  ];

  return botMsg;
};

const translateDelete = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card.header = {
    template: "red",
    title: {
      content: `šæ Delete ${body.ref_type} ā ${body.ref}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
    {
      fields: [
        {
          is_short: false,
          text: {
            content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
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
            content: `š **${body.ref_type}**:\n${body.ref}`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `š¤ **sender**: [${body.sender.name}](${body.sender.url})`,
            tag: "lark_md",
          },
        },
      ],
      tag: "div",
    },
  ];

  return botMsg;
};

const translatePullRequest = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card.header = {
    template: "yellow",
    title: {
      content: `š Pull request #${body.pull_request.number} ${body.action}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
    {
      fields: [
        {
          is_short: false,
          text: {
            content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
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
            content: `š§© **pull request**: **[#${body.pull_request.number}](${body.pull_request.url})** [${body.pull_request.head} ā”ļø ${body.pull_request.base}](${body.pull_request.url})`,
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
            content: `š¦  **state**: ${body.pull_request.state}\nšø **commits**: [${body.pull_request.commits}](${body.pull_request.url}/commits)`,
            tag: "lark_md",
          },
        },
        {
          is_short: true,
          text: {
            content: `š¤ **sender**: [${body.sender.name}](${body.sender.url})`,
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
        content: `š **[#${body.pull_request.number}](${body.pull_request.url}) [${body.pull_request.title}](${body.pull_request.url})**\n${body.pull_request.body}`,
        tag: "lark_md",
      },
    },
  ];

  return botMsg;
};

const translateIssue = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card.header = {
    template: "orange",
    title: {
      content: `š Issue #${body.issue.number} ${body.action}`,
      tag: "plain_text",
    },
  };

  botMsg.card.elements = [
    {
      fields: [
        {
          is_short: false,
          text: {
            content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
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
            content: `š¦  **state**: [#${body.issue.number}](${
              body.issue.url
            }) ${body.issue.state}\nš©š»āš» **assignee**: ${
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
            content: `š¤ **sender**: [${body.sender.name}](${body.sender.url})`,
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
        content: `š **[#${body.issue.number}](${body.issue.url}) [${body.issue.title}](${body.issue.url})**\n${body.issue.body}`,
        tag: "lark_md",
      },
    },
  ];

  return botMsg;
};

const translateComment = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);

  botMsg.card.header = {
    template: "turquoise",
    title: {
      content: `š¬ Comment ${body.action}`,
      tag: "plain_text",
    },
  };

  const divFields = {
    fields: [
      {
        is_short: false,
        text: {
          content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
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
    ],
    tag: "div",
  };

  botMsg.card.elements = [divFields];

  if (body.issue) {
    divFields.fields = divFields.fields.concat([
      {
        is_short: false,
        text: {
          content: `š **[#${body.issue.number}](${body.issue.url}) [${body.issue.title}](${body.issue.url})**`,
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
          content: `š¦  **state**: [#${body.issue.number}](${body.issue.url}) ${body.issue.state}`,
          tag: "lark_md",
        },
      },
    ]);
  }

  divFields.fields.push({
    is_short: true,
    text: {
      content: `š¤ **sender**: [${body.sender.name}](${body.sender.url})`,
      tag: "lark_md",
    },
  });

  botMsg.card.elements = botMsg.card.elements.concat([
    {
      tag: "hr",
    },
    {
      tag: "div",
      text: {
        content: `š¬ **[${body.comment.user.name}](${body.comment.user.url})**: ${body.comment.body}`,
        tag: "lark_md",
      },
      extra: {
        tag: "button",
        text: {
          content: "š« REPLY ",
          tag: "lark_md",
        },
        type: "primary",
        url: `${body.comment.url}`,
      },
    },
  ]);

  return botMsg;
};

const translatePipeline = (body) => {
  const botMsg = {};
  Object.assign(botMsg, template);
  // Bot Message
  botMsg.card.header = {
    template: "blue",
    title: {
      content: `āļø Build ā ${body.pipeline.ref}`,
      tag: "plain_text",
    },
  };

  const divFields = {
    fields: [
      {
        is_short: false,
        text: {
          content: `š **repo**: [${body.owner.name}](${body.owner.url}) / [${body.repo.name}](${body.repo.url})`,
          tag: "lark_md",
        },
      },
      {
        is_short: true,
        text: {
          content: `š **branch**:\n${body.pipeline.ref}`,
          tag: "lark_md",
        },
      },
      {
        is_short: true,
        text: {
          content: `š¤ **sender**:\n[${body.sender.name}](${body.sender.url})`,
          tag: "lark_md",
        },
      },
      {
        is_short: true,
        text: {
          content: `š **stage**:\n${body.pipeline.stage}`,
          tag: "lark_md",
        },
      },
      {
        is_short: true,
        text: {
          content: `š„Ø **status**:\n**[${body.pipeline.status}](${body.pipeline.url})**`,
          tag: "lark_md",
        },
      },
    ],
    tag: "div",
  };

  botMsg.card.elements = [divFields];

  return botMsg;
};

const dict = {
  PING: translatePing,
  PUSH: translatePush,
  CREATE: translateCreate,
  DELETE: translateDelete,
  PULL_REQUEST: translatePullRequest,
  ISSUE: translateIssue,
  COMMENT: translateComment,
  PIPELINE: translatePipeline,
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
