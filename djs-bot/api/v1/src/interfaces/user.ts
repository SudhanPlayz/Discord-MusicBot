import { IPostLoginResponse } from './discord';

export interface IUser {
  id: string;
  username: string;
  avatar?: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner?: string;
  accent_color: number;
  global_name: string;
  avatar_decoration?: string;
  banner_color: string;
  access_token: string;
}

export interface IUserAuth extends IPostLoginResponse {
  userId: string;
}

export interface IUserGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}
