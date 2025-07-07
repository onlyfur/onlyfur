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
export const SESSION_TIMESTAMP_NAME = 'onlyfur_session_timestamp';

// Session expiration times
export const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds
export const PERSISTENT_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
export const TOKEN_REFRESH_THRESHOLD = 60 * 60; // Refresh token if expires within 1 hour

// Enhanced security settings
const getSecureCookieOptions = (rememberMe: boolean = false): CookieOptions => {
  const isSecure = window.location.protocol === 'https:';
  const maxAge = rememberMe ? PERSISTENT_DURATION : SESSION_DURATION;
  
  return {
    path: '/',
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax', // 'none' for cross-site HTTPS, 'lax' for local dev
    maxAge: rememberMe ? maxAge : undefined, // Session cookie if not remembering
  };
};

// Session storage fallback keys
const STORAGE_PREFIX = 'onlyfur_session_';
const STORAGE_AUTH_TOKEN = `${STORAGE_PREFIX}auth_token`;
const STORAGE_REFRESH_TOKEN = `${STORAGE_PREFIX}refresh_token`;
const STORAGE_USER_DATA = `${STORAGE_PREFIX}user_data`;
const STORAGE_REMEMBER_ME = `${STORAGE_PREFIX}remember_me`;
const STORAGE_TIMESTAMP = `${STORAGE_PREFIX}timestamp`;

// Check if cookies are available
const areCookiesAvailable = (): boolean => {
  try {
    const testKey = 'test_cookie_support';
    setCookie(testKey, 'test', { maxAge: 1 });
    const testValue = getCookie(testKey);
    deleteCookie(testKey);
    return testValue === 'test';
  } catch {
    return false;
  }
};

// Fallback to sessionStorage/localStorage if cookies aren't available
const setStorageFallback = (key: string, value: string, rememberMe: boolean = false): void => {
  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    const timestamp = Date.now();
    const data = { value, timestamp, rememberMe };
    storage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Storage fallback failed:', error);
  }
};

const getStorageFallback = (key: string): string | null => {
  try {
    // Try localStorage first, then sessionStorage
    let data = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    const { value, timestamp, rememberMe } = parsed;
    
    // Check if session is expired
    const maxAge = rememberMe ? PERSISTENT_DURATION * 1000 : SESSION_DURATION * 1000;
    if (Date.now() - timestamp > maxAge) {
      // Session expired, clean up
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      return null;
    }
    
    return value;
  } catch {
    return null;
  }
};

const clearStorageFallback = (key: string): void => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn('Storage cleanup failed:', error);
  }
};

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
  const options = getSecureCookieOptions(rememberMe);
  setCookie(name, value, options);
};

// Enhanced authentication cookie functions with fallback support
export const setAuthToken = (token: string, rememberMe: boolean = false): void => {
  const options = getSecureCookieOptions(rememberMe);
  
  try {
    setCookie(AUTH_COOKIE_NAME, token, options);
    // Also set timestamp for session validation
    setCookie(SESSION_TIMESTAMP_NAME, Date.now().toString(), options);
  } catch (error) {
    console.warn('Cookie storage failed, using fallback:', error);
    setStorageFallback(STORAGE_AUTH_TOKEN, token, rememberMe);
    setStorageFallback(STORAGE_TIMESTAMP, Date.now().toString(), rememberMe);
  }
};

export const setRefreshToken = (refreshToken: string, rememberMe: boolean = false): void => {
  const options = getSecureCookieOptions(rememberMe);
  
  try {
    setCookie(REFRESH_COOKIE_NAME, refreshToken, options);
  } catch (error) {
    console.warn('Cookie storage failed, using fallback:', error);
    setStorageFallback(STORAGE_REFRESH_TOKEN, refreshToken, rememberMe);
  }
};

export const setUserData = (userData: any, rememberMe: boolean = false): void => {
  const options = getSecureCookieOptions(rememberMe);
  
  // Don't store sensitive data - remove password if present
  const safeUserData = { ...userData };
  delete safeUserData.password;
  delete safeUserData.passwordHash;
  
  try {
    setCookie(USER_COOKIE_NAME, JSON.stringify(safeUserData), options);
  } catch (error) {
    console.warn('Cookie storage failed, using fallback:', error);
    setStorageFallback(STORAGE_USER_DATA, JSON.stringify(safeUserData), rememberMe);
  }
};

export const setRememberMe = (remember: boolean): void => {
  if (remember) {
    const options = getSecureCookieOptions(true);
    try {
      setCookie(REMEMBER_COOKIE_NAME, 'true', options);
    } catch (error) {
      setStorageFallback(STORAGE_REMEMBER_ME, 'true', true);
    }
  } else {
    deleteCookie(REMEMBER_COOKIE_NAME);
    clearStorageFallback(STORAGE_REMEMBER_ME);
  }
};

export const getAuthToken = (): string | null => {
  return getCookie(AUTH_COOKIE_NAME) || getStorageFallback(STORAGE_AUTH_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return getCookie(REFRESH_COOKIE_NAME) || getStorageFallback(STORAGE_REFRESH_TOKEN);
};

export const getUserData = (): any | null => {
  try {
    const userData = getCookie(USER_COOKIE_NAME) || getStorageFallback(STORAGE_USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const getRememberMe = (): boolean => {
  const remember = getCookie(REMEMBER_COOKIE_NAME) || getStorageFallback(STORAGE_REMEMBER_ME);
  return remember === 'true';
};

export const getSessionTimestamp = (): number | null => {
  try {
    const timestamp = getCookie(SESSION_TIMESTAMP_NAME) || getStorageFallback(STORAGE_TIMESTAMP);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch {
    return null;
  }
};

export const clearAuthCookies = (): void => {
  // Clear cookies
  deleteCookie(AUTH_COOKIE_NAME);
  deleteCookie(REFRESH_COOKIE_NAME);
  deleteCookie(USER_COOKIE_NAME);
  deleteCookie(REMEMBER_COOKIE_NAME);
  deleteCookie(SESSION_TIMESTAMP_NAME);
  
  // Clear storage fallbacks
  clearStorageFallback(STORAGE_AUTH_TOKEN);
  clearStorageFallback(STORAGE_REFRESH_TOKEN);
  clearStorageFallback(STORAGE_USER_DATA);
  clearStorageFallback(STORAGE_REMEMBER_ME);
  clearStorageFallback(STORAGE_TIMESTAMP);
};

export const hasValidAuthSession = (): boolean => {
  const token = getAuthToken();
  const userData = getUserData();
  const timestamp = getSessionTimestamp();
  
  if (!token || !userData || !timestamp) {
    return false;
  }
  
  // Check if session is expired
  const rememberMe = getRememberMe();
  const maxAge = rememberMe ? PERSISTENT_DURATION * 1000 : SESSION_DURATION * 1000;
  const isExpired = Date.now() - timestamp > maxAge;
  
  if (isExpired) {
    // Clean up expired session
    clearAuthCookies();
    return false;
  }
  
  return true;
};

export const isSessionNearExpiration = (): boolean => {
  const timestamp = getSessionTimestamp();
  if (!timestamp) return false;
  
  const rememberMe = getRememberMe();
  const maxAge = rememberMe ? PERSISTENT_DURATION * 1000 : SESSION_DURATION * 1000;
  const timeLeft = maxAge - (Date.now() - timestamp);
  
  // Consider session near expiration if less than threshold remains
  return timeLeft < TOKEN_REFRESH_THRESHOLD * 1000;
};

// Check if cookies are enabled
export const areCookiesEnabled = (): boolean => {
  return areCookiesAvailable();
};

// Session validation utility
export const validateAndCleanupSession = (): boolean => {
  const isValid = hasValidAuthSession();
  if (!isValid) {
    clearAuthCookies();
  }
  return isValid;
};
