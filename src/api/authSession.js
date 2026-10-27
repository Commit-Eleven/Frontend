import { apiRequest } from './client.js';
import { authorizationHeaders, clearAccessToken, returnModeKey } from './auth.js';

const returnPathKey = 'codegram-login-return-path';

export async function logoutFromApp() {
  try {
    if (authorizationHeaders().Authorization) {
      await apiRequest({ url: '/social/login/logout', method: 'POST' });
    }
  } catch {
    // Clear the local session even when the API is unavailable or the token expired.
  } finally {
    clearAccessToken();
    sessionStorage.removeItem(returnPathKey);
    sessionStorage.removeItem(returnModeKey);
    location.replace('/auth');
  }
}
