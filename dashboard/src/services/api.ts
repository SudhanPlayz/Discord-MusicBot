import { API_URL } from '@/configs/constants';
import {
    IBaseApiResponse,
    IDashboardData,
    IServerList,
    IUseQueryOptions,
} from '@/interfaces/api';
import { IGuild } from '@/interfaces/guild';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiService = axios.create({
    baseURL: API_URL,
});

type IGetDashboardData = IBaseApiResponse<IDashboardData>;

export async function getDashboardData() {
    const res = await apiService.get<IGetDashboardData>('/dashboard');

    return res.data;
}

export function useGetDashboardData(
    options: IUseQueryOptions<IGetDashboardData> = {},
) {
    return useQuery({
        queryKey: ['get-dashboard-data'],
        queryFn: getDashboardData,
        ...options,
    });
}

type IGetServerList = IBaseApiResponse<IServerList>;

export async function getServerList() {
    const res = await apiService.get<IGetServerList>('/servers');

    return res.data;
}

export function useGetServerList(
    options: IUseQueryOptions<IGetServerList> = {},
) {
    return useQuery({
        queryKey: ['get-server-list-data'],
        queryFn: getServerList,
        ...options,
    });
}

type IGetServer = IBaseApiResponse<IGuild>;

export async function getServer(id?: string) {
    if (!id) return;

    const res = await apiService.get<IGetServer>('/servers', {
        params: {
            id,
        },
    });

    return res.data;
}

export function useGetServer(
    id: string | undefined,
    options: IUseQueryOptions<IGetServer> = {},
) {
    return useQuery({
        queryKey: ['get-server-data', id],
        queryFn: () => getServer(id),
        enabled: !!id,
        ...options,
    });
}

type IGetLoginURL = IBaseApiResponse<string>;

export async function getLoginURL() {
    const res = await apiService.get<IGetLoginURL>('/login');

    return res.data;
}

export function useGetLoginURL(options: IUseQueryOptions<IGetLoginURL> = {}) {
    return useQuery({
        queryKey: ['get-login-url'],
        queryFn: getLoginURL,
        ...options,
    });
}
