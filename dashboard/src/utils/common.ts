import { clearAuth, clearUser } from './localStorage';

export const logout = () => {
    clearAuth();
    clearUser();
    // !TODO: notify server to invalidate cache
};

/**
 * Should be called client side
 */
export const getDocumentDragHandler = () => {
    return document.body;
};

export const setElementActive = (el: Element) => {
    el.classList.add('active');
};

export const setElementInactive = (el: Element) => {
    el.classList.remove('active');
};
