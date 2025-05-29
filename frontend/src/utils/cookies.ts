export const getCookie = (name: string): string | null => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        return null;
    }

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        if (cookieName === name) {
            console.log("cookie===>>>>",cookie)
            return cookieValue;
        }
    }
    return null;
};

export const setCookie = (name: string, value: string, maxAge: number = 2592000): void => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        return;
    }

    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
};

export const deleteCookie = (name: string): void => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        return;
    }

    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};