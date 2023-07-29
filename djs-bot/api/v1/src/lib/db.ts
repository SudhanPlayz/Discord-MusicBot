import { getBot } from '..';
import { IPostLoginResponse } from '../interfaces/discord';
import { IUserAuth } from '../interfaces/user';
import { invalidateGetUserGuildsResponseCache } from '../services/discord';
import APICache from './APICache';

const getUserAuthDbCache = new APICache<string, IUserAuth>({
  invalidateTimeout: 60 * 1000,
});

export const getUserAuth = async (userId: string) => {
  const bot = getBot();

  const cache = getUserAuthDbCache.get(userId);
  if (cache) return cache;

  const data: IUserAuth = await bot.db.userAuth.findUnique({
    where: { userId },
  });

  invalidateGetUserGuildsResponseCache(userId);
  getUserAuthDbCache.set(userId, data);

  return data;
};

export const updateUserAuth = async (
  userId: string,
  authData: IPostLoginResponse,
) => {
  const bot = getBot();

  const res = await bot.db.userAuth.upsert({
    where: {
      userId,
    },
    create: { ...authData, userId },
    update: authData,
  });

  invalidateGetUserGuildsResponseCache(userId);
  getUserAuthDbCache.set(userId, res);

  return res;
};
