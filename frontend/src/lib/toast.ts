import { toast } from "sonner";

/**
 * Utilitário para padronizar mensagens de toast no projeto
 */
export const showToast = {
  // Mensagens de sucesso
  success: (message: string) => toast.success(message),
  
  // Mensagens de erro
  error: (message: string) => toast.error(message),
  
  // Mensagens de informação
  info: (message: string) => toast.info(message),
  
  // Mensagens de aviso
  warning: (message: string) => toast.warning(message),
  
  // Mensagens específicas do sistema
  auth: {
    loginSuccess: () => toast.success("Login realizado com sucesso!"),
    loginError: (error?: string) => toast.error(error || "Erro ao fazer login"),
    signupSuccess: () => toast.success("Conta criada com sucesso! Bem-vindo ao Dictionary!"),
    signupError: (error?: string) => toast.error(error || "Erro ao criar conta"),
    logoutSuccess: () => toast.success("Logout realizado com sucesso!"),
    unauthorized: () => toast.error("Usuário não autenticado"),
  },
  
  history: {
    clearSuccess: () => toast.success("Histórico limpo com sucesso"),
    clearError: (error?: string) => toast.error(error || "Erro ao limpar histórico"),
    fetchError: (error?: string) => toast.error(error || "Erro ao buscar histórico"),
  },
  
  favorites: {
    markSuccess: () => toast.success("Palavra marcada como favorita"),
    markError: (error?: string) => toast.error(error || "Erro ao marcar favorito"),
    removeSuccess: () => toast.success("Palavra removida dos favoritos"),
    removeError: (error?: string) => toast.error(error || "Erro ao remover dos favoritos"),
    fetchError: (error?: string) => toast.error(error || "Erro ao buscar favoritos"),
  },
  
  dictionary: {
    fetchWordError: (error?: string) => toast.error(error || "Erro ao buscar palavra"),
    fetchWordsError: (error?: string) => toast.error(error || "Erro ao buscar palavras"),
  }
};

/**
 * Função para extrair mensagem de erro de diferentes tipos de erro
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Ocorreu um erro inesperado";
};