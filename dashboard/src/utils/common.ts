import { clearAuth, clearUser } from './localStorage';

export const logout = () => {
    clearAuth();
    clearUser();
};
