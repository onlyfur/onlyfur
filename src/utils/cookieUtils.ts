// Cookie utility functions for secure session management
export interface CookieOptions {
  expires?: Date;
  maxAge?: number; // in seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

// Authentication cookie constants
export const AUTH_COOKIE_NAME = 'onlyfur_auth_token';
export const REFRESH_COOKIE_NAME = 'onlyfur_refresh_token';
export const USER_COOKIE_NAME = 'onlyfur_user_data';
export const REMEMBER_COOKIE_NAME = 'onlyfur_remember_me';

// Set a cookie with options
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

// Get a cookie value by name
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

// Delete a cookie
export const deleteCookie = (name: string, path: string = '/', domain?: string): void => {
  setCookie(name, '', {
    expires: new Date(0),
    path,
    domain
  });
};

// Get all cookies as an object
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
};

// Session management utilities
export const setSessionCookie = (name: string, value: string, rememberMe: boolean = false): void => {
  const options: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  if (rememberMe) {
    // Remember for 30 days
    options.maxAge = 30 * 24 * 60 * 60;
  }
  // If not remembering, cookie will be session-only (expires when browser closes)

  setCookie(name, value, options);
};

// Check if cookies are enabled
export const areCookiesEnabled = (): boolean => {
  try {
    setCookie('test_cookie', 'test', { maxAge: 1 });
    const testValue = getCookie('test_cookie');
    deleteCookie('test_cookie');
    return testValue === 'test';
  } catch {
    return false;
  }
};

// Authentication-specific cookie functions
export const setAuthToken = (token: string, rememberMe: boolean = false): void => {
  const options: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  if (rememberMe) {
    // Remember for 30 days
    options.maxAge = 30 * 24 * 60 * 60;
  }
  // If not remembering, cookie will be session-only (expires when browser closes)

  setCookie(AUTH_COOKIE_NAME, token, options);
};

export const setRefreshToken = (refreshToken: string, rememberMe: boolean = false): void => {
  const options: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  if (rememberMe) {
    // Remember for 30 days
    options.maxAge = 30 * 24 * 60 * 60;
  }

  setCookie(REFRESH_COOKIE_NAME, refreshToken, options);
};

export const setUserData = (userData: any, rememberMe: boolean = false): void => {
  const options: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  };

  if (rememberMe) {
    // Remember for 30 days
    options.maxAge = 30 * 24 * 60 * 60;
  }

  setCookie(USER_COOKIE_NAME, JSON.stringify(userData), options);
};

export const setRememberMe = (remember: boolean): void => {
  if (remember) {
    setCookie(REMEMBER_COOKIE_NAME, 'true', {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    });
  } else {
    deleteCookie(REMEMBER_COOKIE_NAME);
  }
};

export const getAuthToken = (): string | null => {
  return getCookie(AUTH_COOKIE_NAME);
};

export const getRefreshToken = (): string | null => {
  return getCookie(REFRESH_COOKIE_NAME);
};

export const getUserData = (): any | null => {
  try {
    const userData = getCookie(USER_COOKIE_NAME);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const getRememberMe = (): boolean => {
  return getCookie(REMEMBER_COOKIE_NAME) === 'true';
};

export const clearAuthCookies = (): void => {
  deleteCookie(AUTH_COOKIE_NAME);
  deleteCookie(REFRESH_COOKIE_NAME);
  deleteCookie(USER_COOKIE_NAME);
  deleteCookie(REMEMBER_COOKIE_NAME);
};

export const hasValidAuthSession = (): boolean => {
  const token = getAuthToken();
  const userData = getUserData();
  return !!(token && userData);
};
