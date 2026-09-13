export const authConfig = {
  clientId: 'oauth2-pkce-client',

  authorizationEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL || 'http://127.0.0.1:8181'}/realms/fittrack-oauth2/protocol/openid-connect/auth`,

  tokenEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL || 'http://127.0.0.1:8181'}/realms/fittrack-oauth2/protocol/openid-connect/token`,

  redirectUri: 'http://localhost:5173/',

  scope: 'openid profile email offline_access',

  onRefreshTokenExpire: (event) => event.logIn(),
}