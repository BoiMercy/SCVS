import api from './api';

let csrfToken: string | null = null;

/**
 * Initialize CSRF token on app startup
 * Must be called once before making any authenticated requests
 */
export const initializeCsrfToken = async (): Promise<string> => {
  try {
    console.log('🔐 Fetching CSRF token...');
    
    // Since baseURL now includes /api/v1, we use a relative path
    const response = await api.get('/csrf-token');
    csrfToken = response.data.csrf_token;
    
    if (csrfToken) {
      // Set meta tag for interceptor
      let metaTag = document.querySelector('meta[name="csrf-token"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'csrf-token');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', csrfToken);
      
      console.log('✅ CSRF token loaded:', csrfToken.substring(0, 10) + '...');
      return csrfToken;
    }
    
    throw new Error('No CSRF token in response');
  } catch (error) {
    console.error('❌ Failed to load CSRF token:', error);
    throw error;
  }
};

/**
 * Initialize authentication (wrapper function)
 * Fetches CSRF token and checks if user is already logged in
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    // Step 1: Get CSRF token
    await initializeCsrfToken();
    
    // Step 2: Check if user is already logged in (optional)
    try {
      const user = await getCurrentUser();
      console.log('✅ User already logged in:', user?.email);
    } catch (error) {
      console.log('ℹ️ No active session - user needs to login');
    }
  } catch (error) {
    console.error('❌ Auth initialization failed:', error);
    throw error;
  }
};

/**
 * Login with email and password
 */
export const login = async (credentials: { email: string; password: string }) => {
  try {
    console.log('🔐 Attempting login for:', credentials.email);
    
    // Ensure we have a CSRF token before attempting login
    if (!csrfToken) {
      await initializeCsrfToken();
    }
    
    const response = await api.post('/auth/login', credentials);
    
    // Update CSRF token from response if available
    if (response.data.csrf_token) {
      csrfToken = response.data.csrf_token;
      let metaTag = document.querySelector('meta[name="csrf-token"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'csrf-token');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', csrfToken);
    }
    
    console.log('✅ Login successful');
    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Register a new user
 */
export const register = async (userData: any) => {
  try {
    console.log('📝 Attempting registration for:', userData.email);
    
    if (!csrfToken) {
      await initializeCsrfToken();
    }
    
    const response = await api.post('/auth/register', userData);
    
    console.log('✅ Registration successful');
    return response.data;
  } catch (error: any) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('ℹ️ User not authenticated');
      return null;
    }
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async () => {
  try {
    console.log('👋 Logging out...');
    await api.post('/auth/logout');
    csrfToken = null;
    console.log('✅ Logged out successfully');
  } catch (error) {
    console.error('❌ Logout error:', error);
  }
};

/**
 * Get stored CSRF token
 */
export const getCsrfToken = (): string | null => {
  return csrfToken;
};

export default {
  initializeAuth,
  initializeCsrfToken,
  login,
  getCurrentUser,
  logout,
  getCsrfToken
};
