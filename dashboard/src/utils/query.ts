import { IBaseApiResponse } from '@/interfaces/api';

export function getQueryData<T = {}>(data: IBaseApiResponse<T> | undefined) {
    return data?.success ? data.data || undefined : undefined;
}
