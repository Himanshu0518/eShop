
const getApiBaseUrl = () => {

  
  // If VITE_API_URL is explicitly set , use it
  if (import.meta.env.VITE_CLIENT_BASE_URL) {
    return `${import.meta.env.VITE_CLIENT_BASE_URL}/api`;
  }
  
  
  // For production (AWS Docker), use relative path (Nginx will proxy)
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();


