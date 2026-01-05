// API Base URL configuration
// For AWS Docker: Uses Nginx proxy (/api) 
// For Vercel: Uses full backend URL from environment variable
// For local dev: Uses localhost:8000

const getApiBaseUrl = () => {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV;
  
  // If VITE_API_URL is explicitly set (Vercel deployment), use it
  if (import.meta.env.VITE_CLIENT_BASE_URL) {
    return `${import.meta.env.VITE_CLIENT_BASE_URL}/api`;
  }
  
  // For development, use localhost
  if (isDev) {
    return 'http://localhost:8000/api';
  }
  
  // For production (AWS Docker), use relative path (Nginx will proxy)
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Debug log (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}
