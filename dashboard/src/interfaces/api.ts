export interface IBaseApiResponse<T> {
    success: boolean;
    statusCode?: number;
    error?: string;
    message?: string;
    code?: number;
    data?: T;
}
