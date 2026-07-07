// Constantes compartilhadas (compatibilidade com scaffold)
export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export function getLoginUrl() {
  const portalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  
  return `${portalUrl}?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
}
