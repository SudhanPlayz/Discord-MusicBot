import { API_URL } from '@/configs/constants';
import axios from 'axios';

const apiService = axios.create({
    baseURL: API_URL,
});
