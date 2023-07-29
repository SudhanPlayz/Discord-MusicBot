import { IUser, IUserGuild } from './user';

export interface IPostLoginData {
  client_id: string;
  client_secret: string;
  grant_type: 'authorization_code';
  code: string;
  redirect_uri: string;
}

export interface IPostLoginResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  guild?: any;
}

export interface IGetUserOauthInfoParams {
  authType: string;
  authToken: string;
}

export interface IGetUserOauthInfoResponse {
  // unused property left out, fill when needed
  user?: IUser;
}

export type IGetUserGuildsResponse = IUserGuild[];
