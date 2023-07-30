import { getBot } from '..';

export const getBaseOauthURL = () => {
  const bot = getBot();

  return `https://discord.com/api/oauth2/authorize?client_id=${bot.config.clientId}&response_type=code&prompt=none`;
};

export const getInvitePermissionsParameter = () => {
  const bot = getBot();

  return '&permissions=' + bot.config.permissions;
};

export const getInviteScopesParameter = () => {
  const bot = getBot();

  return '&scope=' + encodeURIComponent(bot.config.scopes.join(' '));
};

export const getOauthScopesParameter = () => {
  const bot = getBot();

  return '&scope=' + encodeURIComponent(bot.getOauthScopes());
};
