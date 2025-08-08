import { User } from '@/types';
import { STORAGE_KEYS } from './api';

/**
 * Gerenciamento de autenticação no localStorage
 */
export class AuthManager {
  /**
   * Salva token de autenticação
   */
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  }

  /**
   * Recupera token de autenticação
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  }

  /**
   * Remove token de autenticação
   */
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  /**
   * Salva dados do usuário
   */
  static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }
  }

  /**
   * Recupera dados do usuário
   */
  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        try {
          return JSON.parse(userData) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Remove dados do usuário
   */
  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Faz logout completo
   */
  static logout(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Faz login salvando token e dados do usuário
   */
  static login(token: string, user: User): void {
    this.setToken(token);
    this.setUser(user);
  }

  /**
   * Verifica se o token está expirado (básico)
   * Nota: Para uma verificação mais robusta, seria necessário decodificar o JWT
   */
  static isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decodifica o payload do JWT (sem verificar assinatura)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch {
      // Se não conseguir decodificar, considera expirado
      return true;
    }
  }

  /**
   * Obtém o header de autorização formatado
   */
  static getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}

/**
 * Hook personalizado para verificar autenticação
 */
export const useAuth = () => {
  const isAuthenticated = AuthManager.isAuthenticated();
  const user = AuthManager.getUser();
  const token = AuthManager.getToken();

  const login = (token: string, user: User) => {
    AuthManager.login(token, user);
  };

  const logout = () => {
    AuthManager.logout();
    // Redirecionar para login se necessário
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isTokenExpired: AuthManager.isTokenExpired(),
  };
};