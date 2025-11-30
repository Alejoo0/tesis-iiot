const TOKEN_KEY = 'iot_auth_token';

/**
 * Guarda el token JWT en el Local Storage.
 * @param {string} token - El token JWT.
 */
export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Obtiene el token JWT del Local Storage.
 * @returns {string | null} El token JWT o null si no existe.
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Elimina el token del Local Storage (Cerrar Sesión).
 */
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Verifica si el usuario está autenticado (solo chequea la existencia del token).
 * NOTA: La validación real del token (expiración) se hace en el Backend.
 * @returns {boolean} True si hay un token, false si no.
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};