import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';
import {
  getBaseOauthURL,
  getInvitePermissionsParameter,
  getInviteScopesParameter,
} from '../../../utils/common';
import { createReply } from '../../../utils/reply';

const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  return createReply(
    getBaseOauthURL() +
      getInvitePermissionsParameter() +
      getInviteScopesParameter() +
      encodeURIComponent(' ' + bot.getOauthScopes()),
  );
};

export default handler;
