export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const BASE_API_URL = `${
    process.env.NEXT_PUBLIC_API_URL || 'localhost:8080'
}/api/${API_VERSION}`;

export const SECURE_PROTOCOL =
    process.env.NEXT_PUBLIC_SECURE_PROTOCOL === 'true';

const secureStr = SECURE_PROTOCOL ? 's' : '';

export const API_URL = `http${secureStr}://${BASE_API_URL}`;

export const WS_URL = `ws${secureStr}://${BASE_API_URL}/ws`;
