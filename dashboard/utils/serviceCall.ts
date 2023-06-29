import axios from 'axios';
import { HTTP_METHOD } from 'next/dist/server/web/http';

const API_URL = `http://localhost:8080/api/v0`;

export async function apiCall(method: HTTP_METHOD, path: string, params?: any) {
	try {
		return await axios[method.toLowerCase()](API_URL + path, params);
	} catch (error) {
		return Promise.reject(error);
	}
}