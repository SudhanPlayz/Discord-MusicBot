export interface IGuildRole {
    id: string;
    name: string;
    color: string;
}

export interface IGuildChannel {
    id: string;
    name: string;
    type: number;
    parent: string;
}

export interface IGuildMember {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    roles: string[];
}

export interface ITrack {
    title: string;
    author: string;
    duration: number;
}

export interface IGuildPlayer {
    queue: ITrack[];
    playing: ITrack;
}

export interface IGuildDisplay {
    id: string;
    name: string;
    icon?: string;
    mutual: boolean;
}

export interface IGuild {
    id: string;
    name: string;
    icon?: string;
    owner: string;
    roles?: IGuildRole[];
    channels: IGuildChannel[];
    members: IGuildMember[];
    player: IGuildPlayer;
}
