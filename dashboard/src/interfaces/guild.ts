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

export interface ICosmiNodeStats {
    /** The amount of players on the node. */
    players: number;
    /** The amount of playing players on the node. */
    playingPlayers: number;
    /** The uptime of the node. */
    uptime: number;
    /** The memory stats of the node. */
    memory: {
        /** The free memory of the node. */
        free: number;
        /** The used memory of the node. */
        used: number;
        /** The allocated memory of the node. */
        allocated: number;
        /** The reservable memory of the node. */
        reservable: number;
    };
    /** The cpu stats of the node. */
    cpu: {
        /** The amount of cores the node has. */
        cores: number;
        /** The system load of the node. */
        systemLoad: number;
        /** The lavalink load of the node. */
        lavalinkLoad: number;
    };
    /** The frame stats of the node. */
    frameStats?: {
        /** The amount of frames sent to Discord. */
        sent: number;
        /** The amount of frames that were nulled. */
        nulled: number;
        /** The amount of frames that were deficit. */
        deficit: number;
    };
}

export interface INodes {
    [id: string]: {
        id: string;
        connected: boolean;
        nodeStats: ICosmiNodeStats;
        stats: {
            cores: number;
            uptime: string;
            ramUsage: number;
            ramTotal: number;
        }
    }
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
    nodes: INodes;
}
