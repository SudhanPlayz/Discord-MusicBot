import axios from 'axios';
import { HTTP_METHOD } from 'next/dist/server/web/http';

const API_PATH = 'api/v0';
const API_PORT = 8080;

export async function apiCall(method: HTTP_METHOD, path: string, params?: any) {
	axios.defaults.baseURL = `${location.protocol}//${location.hostname}:${API_PORT}/${API_PATH}`;
	try {
		return await axios[method.toLowerCase()](path.startsWith('/') ? path : `/${path}`, { params: params });
	} catch (error) {
		return error.response;
	}
}