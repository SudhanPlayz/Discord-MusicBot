import axios from 'axios';

import { DISCORD_API_URL } from '../lib/constants';

import type {
  IGetUserGuildsResponse,
  IGetUserOauthInfoParams,
  IGetUserOauthInfoResponse,
  IPostLoginData,
  IPostLoginResponse,
} from '../interfaces/discord';
import APICache from '../lib/APICache';
import * as db from '../lib/db';

const discordService = axios.create({
  baseURL: DISCORD_API_URL,
});

export const postLogin = async (data: IPostLoginData) => {
  const res = await discordService.post<IPostLoginResponse>(
    '/oauth2/token',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  return res.data;
};

export const getUserOauthInfo = async ({
  authType,
  authToken,
}: IGetUserOauthInfoParams) => {
  const res = await discordService.get<IGetUserOauthInfoResponse>(
    '/oauth2/@me',
    {
      headers: {
        Authorization: `${authType} ${authToken}`,
      },
    },
  );

  return res.data;
};

const getUserGuildsResponseCache = new APICache<string, IGetUserGuildsResponse>(
  {
    invalidateTimeout: 10 * 60 * 1000,
  },
);

export const invalidateGetUserGuildsResponseCache = async (userId: string) => {
  const { token_type, access_token } = await db.getUserAuth(userId as string);
  const auth = `${token_type} ${access_token}`;
  getUserGuildsResponseCache.delete(auth);
};

export const getUserGuilds = async (userId: string) => {
  const { token_type, access_token } = await db.getUserAuth(userId as string);

  const auth = `${token_type} ${access_token}`;

  const cache = getUserGuildsResponseCache.get(auth);

  if (cache) {
    return cache;
  }

  const res = await discordService.get<IGetUserGuildsResponse>(
    '/users/@me/guilds',
    {
      headers: {
        Authorization: auth,
      },
    },
  );

  getUserGuildsResponseCache.set(auth, res.data);

  return res.data;
};
