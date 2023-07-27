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
}
