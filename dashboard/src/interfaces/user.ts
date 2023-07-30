export interface IUserAuth {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    refresh_token: string;
    scope: string;
}

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
