// handleLogout.js
import { useNavigate } from 'react-router-dom';

/**
 * Logs out the user or admin by clearing relevant localStorage and navigating home.
 * @param {object} options - Options for logout.
 * @param {boolean} options.isAdmin - If true, also removes 'shop' from localStorage.
 * @param {function} [options.navigate] - Optional navigate function from useNavigate.
 * @param {function} [options.setIsLoggedIn] - Optional setter for isLoggedIn state.
 */
export function handleLogout({ isAdmin = false, navigate, setIsLoggedIn } = {}) {
  localStorage.setItem('isLoggedIn', false);
  localStorage.removeItem('authToken');
  if (isAdmin) {
    localStorage.removeItem('shop');
  }
  if (typeof setIsLoggedIn === 'function') {
    setIsLoggedIn(false);
  }
  if (typeof navigate === 'function') {
    navigate('/', { replace: true });
  }
  window.location.reload();
} 