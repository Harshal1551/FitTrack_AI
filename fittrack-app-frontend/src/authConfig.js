export const authConfig = {
  clientId: 'oauth2-pkce-client',

  authorizationEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL || 'http://127.0.0.1:8181'}/realms/fittrack-oauth2/protocol/openid-connect/auth`,

  tokenEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL || 'http://127.0.0.1:8181'}/realms/fittrack-oauth2/protocol/openid-connect/token`,

  logoutEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL || 'http://127.0.0.1:8181'}/realms/fittrack-oauth2/protocol/openid-connect/logout`,

  redirectUri: window.location.origin + '/',

  redirectUri: window.location.origin + '/',

  scope: 'openid profile email offline_access',

  refreshTokenExpiryStrategy: 'renewable',
  refreshTokenExpiresIn: 1800,

  onRefreshTokenExpire: (event) => {
    console.log('Refresh token expired. Login required.');
    event.logIn();
  },
};