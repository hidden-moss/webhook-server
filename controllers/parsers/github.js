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
      committer_url: `https://github.com/${cmt.committer.username}`,
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

const parseDelete = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.ref = payload.ref;
  body.ref_type = payload.ref_type;
  return body;
};

const parsePullRequest = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.action = payload.action;
  body.pull_request = {
    number: payload.pull_request.number,
    url: payload.pull_request.html_url,
    state: payload.pull_request.state,
    title: payload.pull_request.title,
    body: payload.pull_request.body,
    head: payload.pull_request.head.label,
    base: payload.pull_request.base.label,
    commits: payload.pull_request.commits,
    merged: payload.pull_request.merged,
  };
  return body;
};

const parseIssue = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.action = payload.action;
  body.issue = {
    number: payload.issue.number,
    url: payload.issue.html_url,
    state: payload.issue.state,
    title: payload.issue.title,
    body: payload.issue.body,
    assignee: payload.issue.assignee
      ? {
          name: payload.issue.assignee.login,
          url: payload.issue.assignee.html_url,
        }
      : undefined,
    merged: payload.issue.merged,
  };
  return body;
};

const parseIssueComment = (payload) => {
  const body = parseIssue(payload);
  body.comment = {
    url: payload.comment.html_url,
    body: payload.comment.body,
    user: {
      name: payload.comment.user.login,
      url: payload.comment.user.html_url,
    },
  };
  return body;
};

const parseCommitComment = (payload) => {
  const body = {};
  body.repo = getRepo(payload);
  body.owner = getOwner(payload);
  body.sender = getSender(payload);
  body.action = payload.action;
  body.comment = {
    url: payload.comment.html_url,
    body: payload.comment.body,
    user: {
      name: payload.comment.user.login,
      url: payload.comment.user.html_url,
    },
  };
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
  delete: {
    event: "DELETE",
    parse: parseDelete,
  },
  pull_request: {
    event: "PULL_REQUEST",
    parse: parsePullRequest,
  },
  issues: {
    event: "ISSUE",
    parse: parseIssue,
  },
  issue_comment: {
    event: "COMMENT",
    parse: parseIssueComment,
  },
  commit_comment: {
    event: "COMMENT",
    parse: parseCommitComment,
  },
};

exports.parse = (req) => {
  const ctx = {};
  const event = req.header("X-GitHub-Event");
  if (event && dict[event]) {
    ctx.event = dict[event].event;
    ctx.body = dict[event].parse(req.body);
    return ctx;
  }
};
