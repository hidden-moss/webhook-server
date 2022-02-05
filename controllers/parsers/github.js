// @copyright Hidden Moss Inc.
// @see https://hiddenmoss.com/
// @author Yuancheng Zhang

//////! Parser Helpers ///////

const getRepo = (payload) => {
  const repo = {
    name: payload.repository.name,
    url: payload.repository.html_url,
  };
  return repo;
};

const getOwner = (payload) => {
  const owner = {
    name: payload.repository.owner.login,
    url: payload.repository.owner.html_url,
  };
  return owner;
};

const getSender = (payload) => {
  const sender = {
    name: payload.sender.login,
    url: payload.sender.html_url,
    avatar_url: payload.sender.avatar_url,
  };
  return sender;
};

const getCommits = (payload) => {
  const commits = [];
  for (const cmt of payload.commits) {
    commits.push({
      msg: cmt.message,
      committer: cmt.committer.username,
      url: cmt.url,
    });
  }
  return commits;
};

//////! Parsers ///////

const parsePing = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.zen = payload.zen;

  return body;
};

const parseBody = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.ref = payload.ref;
  body.commits = getCommits(payload);
  return body;
};

const parseCreate = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.ref = payload.ref;
  body.ref_type = payload.ref_type;
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
  create: {
    event: "CREATE",
    parse: parseCreate,
  },
};

exports.parse = (req) => {
  const ctx = {};
  const event = req.header("X-GitHub-Event");
  ctx.event = dict[event].event;
  ctx.body = dict[event].parse(req.body);
  return ctx;
};
