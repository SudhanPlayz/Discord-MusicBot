export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
export const WS_VERSION = process.env.NEXT_PUBLIC_WS_VERSION || 'v1';

export const BASE_API_URL = `${
    process.env.NEXT_PUBLIC_API_URL || 'localhost:3000'
}/api/${API_VERSION}`;

export const BASE_WS_URL = `${
    process.env.NEXT_PUBLIC_WS_URL || 'localhost:8080'
}/ws/${WS_VERSION}`;

export const API_SECURE_PROTOCOL =
    process.env.NEXT_PUBLIC_API_SECURE_PROTOCOL === 'true';

export const WS_SECURE_PROTOCOL =
    process.env.NEXT_PUBLIC_WS_SECURE_PROTOCOL === 'true';

const apiSecureStr = API_SECURE_PROTOCOL ? 's' : '';
const wsSecureStr = WS_SECURE_PROTOCOL ? 's' : '';

export const API_URL = `http${apiSecureStr}://${BASE_API_URL}`;
export const WS_URL = `ws${wsSecureStr}://${BASE_WS_URL}`;
