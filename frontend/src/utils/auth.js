export const setAuthState = (token, role, email) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  if (email) localStorage.setItem('userEmail', email);
};

export const getAuthToken = () => localStorage.getItem('token');
export const getUserRole = () => localStorage.getItem('role');

export const isAuthenticated = () => {
  const token = getAuthToken();
  // Add more robust validation here if needed (e.g. check expiry)
  return !!token;
};

export const isAdmin = () => getUserRole() === 'ROLE_ADMIN';
export const isAnalyst = () => getUserRole() === 'ROLE_ANALYST' || isAdmin();
