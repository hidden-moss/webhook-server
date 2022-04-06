// @copyright Hidden Moss Inc.
// @see https://hiddenmoss.com/
// @author Yuancheng Zhang

//////! Parser Helpers ///////

const getRepo = (payload) => {
  const repo = {
    name: payload.project.name,
    url: payload.project.web_url,
  };
  return repo;
};

const getOwner = (payload) => {
  const owner = {
    name: payload.project.path_with_namespace.split("/")[0],
    url: `https://gitlab.com/${payload.user.username}`,
  };
  return owner;
};

const getSender = (payload) => {
  const sender = {
    name: payload.user.username,
    url: `https://gitlab.com/${payload.user.username}`,
    avatar_url: payload.user.avatar_url.split("?")[0],
  };
  return sender;
};

//////! Parsers ///////

const parsePipline = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.pipeline = {
    ref: payload.object_attributes.ref,
    status: payload.object_attributes.status,
    stage: payload.object_attributes.stages.join(", "),
    url: payload.commit.url,
  };
  body.zen = payload.zen || "Practicality beats purity.";
  return body;
};

const dict = {
  pipeline: {
    event: "PIPELINE",
    parse: parsePipline,
  },
};

exports.parse = (req) => {
  const ctx = {};
  const event = req.body.object_kind;
  console.log(event);
  if (event && dict[event]) {
    ctx.event = dict[event].event;
    ctx.body = dict[event].parse(req.body);
    return ctx;
  }
};
