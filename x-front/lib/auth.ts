export const clearAuthTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const isLoggedIn = () => {
  const token = localStorage.getItem('access_token');
  const storedUsername = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const refresh_token = localStorage.getItem('refresh_token');

  if (token && storedUsername && role && refresh_token) {
    return true
  }
  return false
}