const { logger } = require('../eris-core/submodules');

// eslint-disable-next-line no-unused-vars
async function onReady(client) {
  logger.rainbow("COOPER");
}

// eslint-disable-next-line no-unused-vars
function onMessage(message, client) {}

// eslint-disable-next-line no-unused-vars
function onGuildMemberAdd(member, client) {}

// eslint-disable-next-line no-unused-vars
function onReaction(messageReaction, user, added) {}

module.exports = {
  onReady,
  onMessage,
  onGuildMemberAdd,
  onReaction,
};
