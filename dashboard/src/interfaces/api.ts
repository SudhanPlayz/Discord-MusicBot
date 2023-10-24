import { IGuildDisplay } from './guild';

export interface IBaseApiResponse<T = undefined> {
    success: boolean;
    statusCode?: number;
    error?: string;
    message?: string;
    code?: number;
    data?: T;
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

export interface IDashboardData {
    commandsRan: number;
    users: number;
    servers: number;
    songsPlayed: number;
    nodes: INodes;
}

export interface IServerList {
    servers: IGuildDisplay[];
}

export interface IUseQueryOptions<T = undefined> {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (err: unknown) => void;
}

export interface IUseProcessDataOptions {
    loadingComponent?: React.ReactNode;
    failedComponent?: React.ReactNode;
    enabled?: boolean;
}
