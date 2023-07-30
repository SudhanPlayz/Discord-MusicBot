import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';
import { IPostLoginData } from '../../../interfaces/discord';
import APIError from '../../../lib/APIError';
import { getUserOauthInfo, postLogin } from '../../../services/discord';
import { createReply } from '../../../utils/reply';
import * as db from '../../../lib/db';
import {
  getBaseOauthURL,
  getOauthScopesParameter,
} from '../../../utils/common';
import { signToken } from '../../../lib/jwt';

const handlers: RouteHandler[] = [
  {
    handler: async (request, reply) => {
      return createReply(getBaseOauthURL() + getOauthScopesParameter());
    },
    method: 'get',
  },
  {
    handler: async (request, reply) => {
      // we going js style
      const body: any = request.body || {};
      const { code, redirect_uri } = body;

      if (!code || !redirect_uri)
        throw new APIError(
          'No',
          APIError.STATUS_CODES.BAD_REQUEST,
          APIError.ERROR_CODES.BAD_REQUEST,
        );

      const bot = getBot();
      const { clientId, clientSecret } = bot.config;

      if (!clientId || !clientSecret)
        throw new APIError(
          "Bot configuration isn't set up correctly for login to work",
          APIError.STATUS_CODES.INTERNAL_ERROR,
          APIError.ERROR_CODES.INVALID_CONFIGURATION,
        );

      const req: IPostLoginData = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        ...body,
      };

      const res = await postLogin(req);

      const authData = await getUserOauthInfo({
        authToken: res.access_token,
        authType: res.token_type,
      });

      if (!authData.user) {
        throw new APIError(
          'Unauthorized',
          APIError.STATUS_CODES.UNAUTHORIZED,
          APIError.ERROR_CODES.UNAUTHORIZED,
        );
      }

      // saving this incase one day needed
      const guild = res.guild;

      const { id } = authData.user;
      delete res.guild;
      await db.updateUserAuth(id, res);

      authData.user.access_token = signToken({ user_id: id });
      return createReply(authData.user);
    },
    method: 'post',
  },
];

export default handlers;
