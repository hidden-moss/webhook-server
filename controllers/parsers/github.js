// @copyright Hidden Moss Inc.
// @see https://hiddenmoss.com/
// @author Yuancheng Zhang

const parsePing = (payload) => {
  const body = {};
  body.repo = {
    name: payload.repository.name,
    url: payload.repository.html_url,
  };
  body.owner = {
    name: payload.repository.owner.login,
    url: payload.repository.owner.html_url,
  };

  return body;
};

const parseBody = (payload) => {
  const body = {};
  return body;
};

const dict = {
  ping: {
    event: "PING",
    parse: parsePing,
  },
  push: {
    event: "PUSH",
    parse: parseBody,
  },
};

exports.parse = (req) => {
  const ctx = {};
  const event = req.header("X-GitHub-Event");
  ctx.event = dict[event].event;
  ctx.body = dict[event].parse(req.body);
  return ctx;
};
