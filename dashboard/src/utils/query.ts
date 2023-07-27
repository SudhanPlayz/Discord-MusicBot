import { IBaseApiResponse } from '@/interfaces/api';
import { getSavedAuth } from './localStorage';

export function getQueryData<T = {}>(data: IBaseApiResponse<T> | undefined) {
    return data?.success ? data.data || undefined : undefined;
}

export function getAuthHeaders() {
    return {
        access_token: getSavedAuth()?.access_token,
    };
}
