// ============================================================
// SGDI Web — AuthContext
// Contexto de autenticación global
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, refreshUser } from '../services/authService';
import { getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true hasta verificar sesión inicial

  // Verifica sesión existente al montar.
  // Si hay sesión local + token, valida con /api/auth/me para confirmar
  // que el JWT sigue activo y refrescar el rol real desde el backend.
  useEffect(() => {
    async function verifySession() {
      const localUser = getCurrentUser();

      if (localUser && getToken()) {
        // Hay sesión local y token — validar contra el backend
        try {
          const fresh = await refreshUser();
          setUser(fresh);
        } catch {
          // refreshUser ya hace fallback local si el request falla;
          // si fue 401, api.js ya limpió y redirigió — aquí no hay nada que hacer.
          setUser(getCurrentUser()); // leer estado actualizado tras posible limpieza
        }
      } else {
        // Sin sesión local o sin token — no autenticado
        setUser(null);
      }

      setLoading(false);
    }

    verifySession();
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await loginService(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    setUser(null)
    await logoutService()
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
