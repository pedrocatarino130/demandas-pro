/**
 * Utilitário central para lidar com BASE_URL em ambientes locais e GitHub Pages.
 */

export const BASE_PATH_STORAGE_KEY = 'GERENCIADOR_PEDRO_BASE_PATH';
export const SPA_REDIRECT_STORAGE_KEY = 'GERENCIADOR_PEDRO_PENDING_ROUTE';

let memoizedBasePath = null;

function normalizeBasePath(value) {
    if (!value || typeof value !== 'string') {
        return '/';
    }

    const trimmed = value.trim();
    if (trimmed === './' || trimmed === '.') {
        return './';
    }

    let normalized = trimmed;
    if (!normalized.startsWith('/')) {
        normalized = `/${normalized}`;
    }
    if (!normalized.endsWith('/')) {
        normalized = `${normalized}/`;
    }

    return normalized;
}

function computeBasePath() {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.BASE_URL === 'string') {
            return normalizeBasePath(import.meta.env.BASE_URL);
        }
    } catch (error) {
        // Ignorar durante build/SSR
    }

    if (typeof document !== 'undefined') {
        const baseTag = document.querySelector('base[href]');
        if (baseTag && baseTag.getAttribute('href')) {
            return normalizeBasePath(baseTag.getAttribute('href'));
        }
    }

    if (typeof window !== 'undefined' && window.location && window.location.pathname) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
            return `/${segments[0]}/`;
        }
    }

    return '/';
}

export function getBasePath() {
    if (memoizedBasePath) {
        return memoizedBasePath;
    }
    memoizedBasePath = computeBasePath();
    return memoizedBasePath;
}

export function getBrowserBasePath() {
    const base = getBasePath();
    return base === './' ? '/' : base;
}

export function buildAssetPath(target = '') {
    const base = getBasePath();

    if (!target) {
        return base === './' ? './' : base;
    }

    if (target.startsWith('http')) {
        return target;
    }

    if (base === './') {
        if (target.startsWith('./')) {
            return target;
        }
        if (target.startsWith('/')) {
            return `.${target}`;
        }
        return `./${target}`;
    }

    const normalizedTarget = target.startsWith('/') ? target.slice(1) : target;
    return `${base}${normalizedTarget}`;
}

export function stripBasePath(pathname = '/') {
    const base = getBrowserBasePath();
    if (!pathname) {
        return '/';
    }
    if (!pathname.startsWith('/')) {
        pathname = `/${pathname}`;
    }

    if (base === '/' || base === './') {
        return pathname || '/';
    }

    if (pathname.startsWith(base)) {
        const stripped = pathname.slice(base.length - 1);
        return stripped || '/';
    }

    if (pathname === base.slice(0, -1)) {
        return '/';
    }

    return pathname || '/';
}

export function buildHistoryPath(path = '/') {
    const base = getBrowserBasePath();
    const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '/';

    if (base === '/' || base === './') {
        return normalizedPath;
    }

    const baseWithoutTrailingSlash = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${baseWithoutTrailingSlash}${normalizedPath}`;
}

export function rememberBasePath() {
    const baseForStorage = getBrowserBasePath();

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(BASE_PATH_STORAGE_KEY, baseForStorage);
        }
    } catch (error) {
        // Ignore storage errors (modo privado, etc)
    }

    try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem(BASE_PATH_STORAGE_KEY, baseForStorage);
        }
    } catch (error) {
        // Ignore storage errors
    }
}

export function consumePendingRoute() {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return null;
    }

    try {
        const pending = window.sessionStorage.getItem(SPA_REDIRECT_STORAGE_KEY);
        if (pending) {
            window.sessionStorage.removeItem(SPA_REDIRECT_STORAGE_KEY);
            return pending;
        }
    } catch (error) {
        return null;
    }

    return null;
}

