import { IGuildDisplay } from './guild';

export interface IBaseApiResponse<T = undefined> {
    success: boolean;
    statusCode?: number;
    error?: string;
    message?: string;
    code?: number;
    data?: T;
}

export interface IDashboardData {
    commandsRan: number;
    users: number;
    servers: number;
    songsPlayed: number;
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
