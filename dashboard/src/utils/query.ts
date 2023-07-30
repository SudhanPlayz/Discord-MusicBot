import { IBaseApiResponse } from '@/interfaces/api';
import { getSavedUser } from './localStorage';

export function getQueryData<T = {}>(data: IBaseApiResponse<T> | undefined) {
    return data?.success ? data.data || undefined : undefined;
}

export function getAuthHeaders() {
    return {
        access_token: getSavedUser()?.access_token,
    };
}
