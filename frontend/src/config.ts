export const API_BASE_URL = 'http://localhost:5069';

// Helper function to build API URLs
export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;