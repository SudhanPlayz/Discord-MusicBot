import axios from 'axios';
import { HTTP_METHOD } from 'next/dist/server/web/http';

const API_PATH = 'api/v1';
const API_PORT = 8080;

export async function apiCall(method: HTTP_METHOD, path: string, params?: any) {
    axios.defaults.baseURL = `${location.protocol}//${location.hostname}:${API_PORT}/${API_PATH}`;
    try {
        const endpoint = path.startsWith('/') ? path : `/${path}`;
        const fullpath = axios.defaults.baseURL + endpoint;
        const res = await axios[method.toLowerCase()](endpoint, {
            params: params,
        });
        console.log('response:', fullpath, res);
        return res;
    } catch (error) {
        return error.response;
    }
}
