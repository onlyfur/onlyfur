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
