export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const API_URL =
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') +
    '/api/' +
    API_VERSION;
