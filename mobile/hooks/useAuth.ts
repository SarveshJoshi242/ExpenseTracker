import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, register, logout, loadToken, updateProfile } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };
};
