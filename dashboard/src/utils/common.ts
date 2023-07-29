import { clearAuth, clearUser } from './localStorage';

export const logout = () => {
    clearAuth();
    clearUser();
    // !TODO: notify server to invalidate cache
};
