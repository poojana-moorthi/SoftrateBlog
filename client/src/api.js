// Central API base URL — set VITE_API_URL in your Vercel environment variables
// to your Render backend URL: https://softrate-blog-api.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
