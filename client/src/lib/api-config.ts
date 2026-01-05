// API Base URL configuration
// For AWS: Uses Nginx proxy (/api) 
// For Vercel/Render: Uses full backend URL from environment

const getApiBaseUrl = () => {
  // If VITE_API_URL is set (Vercel deployment), use it
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_CLIENT_BASE_URL}/api`;
  }
  
  // Otherwise use relative path (AWS with Nginx proxy)
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
